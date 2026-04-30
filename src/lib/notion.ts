import { Client } from "@notionhq/client";
import type { Exploration } from "@/components/ExplorationCard";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const archiveNotion = new Client({
  auth: process.env.NOTION_ARCHIVE_TOKEN ?? process.env.NOTION_TOKEN,
});
const envId = process.env.NOTION_EXPLORATIONS_DB_ID;

type AnyProp = { type?: string } & Record<string, unknown>;

function getTitle(prop: unknown): string {
  const p = prop as AnyProp;
  if (p?.type !== "title") return "";
  return (p as { title: Array<{ plain_text: string }> }).title
    ?.map((t) => t.plain_text)
    .join("") ?? "";
}

function getNumber(prop: unknown): number | null {
  const p = prop as AnyProp;
  if (p?.type !== "number") return null;
  return (p as { number: number | null }).number ?? null;
}

function getUrl(prop: unknown): string | null {
  const p = prop as AnyProp;
  if (p?.type !== "url") return null;
  return (p as { url: string | null }).url ?? null;
}

function getSelect(prop: unknown): string | null {
  const p = prop as AnyProp;
  if (p?.type !== "select") return null;
  return (p as { select: { name: string } | null }).select?.name ?? null;
}

function getRichText(prop: unknown): string {
  const p = prop as AnyProp;
  if (p?.type !== "rich_text") return "";
  return (p as { rich_text: Array<{ plain_text: string }> }).rich_text
    ?.map((t) => t.plain_text)
    .join("") ?? "";
}

/**
 * Look up a Notion property by name, ignoring case and any trailing
 * `(*)` decorator that users sometimes add to mark optional columns.
 */
function findTitleProp(props: Record<string, unknown>): unknown {
  for (const v of Object.values(props)) {
    if ((v as AnyProp)?.type === "title") return v;
  }
  return undefined;
}

function findProp(props: Record<string, unknown>, name: string): unknown {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/\s*\(\*\)\s*$/, "").trim();
  const target = normalize(name);
  for (const [k, v] of Object.entries(props)) {
    if (normalize(k) === target) return v;
  }
  return undefined;
}

/**
 * The ID copied from a Notion URL can be a data source, a database, or the
 * page that wraps an inline database. Resolve to a queryable data source ID.
 */
async function resolveDataSourceId(id: string, client: Client = notion): Promise<string | null> {
  // 1. Try as data source directly
  try {
    await client.dataSources.retrieve({ data_source_id: id });
    return id;
  } catch {}

  // 2. Try as database — pick its first data source
  try {
    const db = await client.databases.retrieve({ database_id: id });
    if ("data_sources" in db && db.data_sources?.[0]?.id) {
      return db.data_sources[0].id;
    }
  } catch {}

  // 3. Try as a page — look for a child database block, recurse on it
  try {
    const children = await client.blocks.children.list({ block_id: id });
    for (const block of children.results) {
      if ("type" in block && block.type === "child_database") {
        const db = await client.databases.retrieve({ database_id: block.id });
        if ("data_sources" in db && db.data_sources?.[0]?.id) {
          return db.data_sources[0].id;
        }
      }
    }
  } catch {}

  return null;
}

export async function fetchExplorations(): Promise<Exploration[]> {
  if (!process.env.NOTION_TOKEN || !envId) {
    console.warn("[notion] NOTION_TOKEN or NOTION_EXPLORATIONS_DB_ID missing");
    return [];
  }

  try {
    const dataSourceId = await resolveDataSourceId(envId);
    if (!dataSourceId) {
      console.warn("[notion] could not resolve a data source from id:", envId);
      return [];
    }

    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      sorts: [{ property: "Year", direction: "descending" }],
    });

    return response.results
      .filter((r): r is Extract<typeof r, { properties: unknown }> => "properties" in r)
      .map((row) => {
        const props = row.properties as Record<string, unknown>;
        const mediaUrl = getUrl(findProp(props, "Media URL"));
        const mediaTypeRaw = getSelect(findProp(props, "Media Type"))?.toLowerCase();
        const mediaType =
          mediaTypeRaw === "image" || mediaTypeRaw === "video" ? mediaTypeRaw : null;
        const linkUrl = getUrl(findProp(props, "Link URL"));
        const buttonText = getRichText(findProp(props, "Button Text"));

        const exploration: Exploration = {
          id: row.id,
          name: getTitle(findProp(props, "Name")) || "Untitled",
          year: getNumber(findProp(props, "Year")) ?? new Date().getFullYear(),
          media:
            mediaUrl && mediaType
              ? { type: mediaType, src: mediaUrl }
              : undefined,
          link: linkUrl
            ? { href: linkUrl, label: buttonText.trim() || undefined }
            : undefined,
        };
        return exploration;
      });
  } catch (err) {
    console.error("[notion] fetch failed:", err);
    return [];
  }
}

export type ArchiveEntry = {
  id: string;
  description: string;
  date: string;
  year: number;
  createdTime: string;
};

const archiveDbId = process.env.NOTION_ARCHIVE_DB_ID;

export async function fetchArchiveEntries(): Promise<ArchiveEntry[]> {
  const archiveToken = process.env.NOTION_ARCHIVE_TOKEN ?? process.env.NOTION_TOKEN;
  if (!archiveToken || !archiveDbId) {
    console.warn("[notion] NOTION_ARCHIVE_TOKEN or NOTION_ARCHIVE_DB_ID missing");
    return [];
  }

  try {
    const dataSourceId = await resolveDataSourceId(archiveDbId, archiveNotion);
    if (!dataSourceId) {
      console.warn("[notion] could not resolve a data source from id:", archiveDbId);
      return [];
    }

    const response = await archiveNotion.dataSources.query({
      data_source_id: dataSourceId,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    return response.results
      .filter((r): r is Extract<typeof r, { properties: unknown }> & { created_time: string } =>
        "properties" in r && "created_time" in r,
      )
      .map((row) => {
        const props = row.properties as Record<string, unknown>;
        const descProp =
          findProp(props, "Thought") ??
          findProp(props, "Description") ??
          findProp(props, "Idea") ??
          findProp(props, "Note") ??
          findTitleProp(props);
        const dateProp = findProp(props, "Date") ?? findProp(props, "date");
        const description = getTitle(descProp) || getRichText(descProp);
        const date = getRichText(dateProp) || getTitle(dateProp);
        const year = new Date(row.created_time).getFullYear();
        return {
          id: row.id,
          description,
          date,
          year,
          createdTime: row.created_time,
        };
      })
      .filter((e) => e.description.trim().length > 0);
  } catch (err) {
    console.error("[notion] archive fetch failed:", err);
    return [];
  }
}
