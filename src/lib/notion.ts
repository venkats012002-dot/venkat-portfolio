import { Client } from "@notionhq/client";
import type { Exploration } from "@/components/ExplorationCard";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const archiveNotion = new Client({
  auth: process.env.NOTION_ARCHIVE_TOKEN ?? process.env.NOTION_TOKEN,
});
const workNotion = new Client({
  auth: process.env.NOTION_WORK_TOKEN ?? process.env.NOTION_TOKEN,
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

function getMultiSelect(prop: unknown): string[] {
  const p = prop as AnyProp;
  if (p?.type !== "multi_select") return [];
  return (p as { multi_select: Array<{ name: string }> }).multi_select
    ?.map((t) => t.name) ?? [];
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

// ─────────────────────────────────────────────────────────────────────────
// Work / Case Studies + Sides
// ─────────────────────────────────────────────────────────────────────────

const workDbId = process.env.NOTION_WORK_DB_ID;

export type WorkBlock =
  | { type: "heading_1" | "heading_2" | "heading_3" | "heading_4"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; caption: string }
  | { type: "video"; src: string }
  | { type: "divider" }
  | { type: "quote"; text: string }
  | { type: "callout"; text: string; emoji: string | null; children: WorkBlock[] }
  | { type: "bullet" | "number"; text: string }
  | { type: "spacer" };

export type WorkSummary = {
  id: string;
  slug: string;
  type: string | null;
  status: string | null;
  order: number | null;
  title: string;
  subtitle: string;
  timeline: string;
  role: string;
  stats: string;
  team: string;
  tags: string[];
  cover: string | null;
};

export type WorkDetail = WorkSummary & {
  body: WorkBlock[];
};

// Notion stores slug values like "/work/bluethroat-branding" or "bluethroat-branding".
// Normalize to just the last path segment so the dynamic route can match cleanly.
function normalizeSlug(s: string): string {
  return s.replace(/^.*\//, "").trim();
}

// URL-encode the path of a URL (handles spaces in filenames from Notion).
function encodeUrl(raw: string): string {
  if (!raw) return raw;
  try {
    const u = new URL(raw);
    u.pathname = u.pathname.split("/").map((seg) => encodeURIComponent(decodeURIComponent(seg))).join("/");
    return u.toString();
  } catch {
    return raw;
  }
}

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;
const VIDEO_EXT_RE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

function richTextOf(rt: Array<{ plain_text: string }> | undefined): string {
  return rt?.map((t) => t.plain_text).join("") ?? "";
}

// SDK's discriminated types are noisy; we treat the raw block as a loose
// record and only read the fields we need.
type RawBlock = { id: string; type: string; has_children: boolean; [k: string]: unknown };

async function mapBlock(raw: RawBlock): Promise<WorkBlock | null> {
  const b = raw as unknown as Record<string, { rich_text?: Array<{ plain_text: string }> } & Record<string, unknown>> & RawBlock;
  const t = raw.type;
  if (t === "heading_1" || t === "heading_2" || t === "heading_3" || t === "heading_4") {
    return { type: t, text: richTextOf(b[t]?.rich_text) };
  }
  if (t === "paragraph") {
    const text = richTextOf(b.paragraph?.rich_text);
    const trimmed = text.trim();
    if (!trimmed) return { type: "spacer" };
    if (/^https?:\/\//i.test(trimmed) && IMAGE_EXT_RE.test(trimmed)) {
      return { type: "image", src: encodeUrl(trimmed), caption: "" };
    }
    if (/^https?:\/\//i.test(trimmed) && VIDEO_EXT_RE.test(trimmed)) {
      return { type: "video", src: encodeUrl(trimmed) };
    }
    return { type: "paragraph", text };
  }
  if (t === "image") {
    const img = b.image as { external?: { url: string }; file?: { url: string }; caption?: Array<{ plain_text: string }> } | undefined;
    const src = img?.external?.url ?? img?.file?.url ?? "";
    const caption = richTextOf(img?.caption);
    return src ? { type: "image", src: encodeUrl(src), caption } : null;
  }
  if (t === "video") {
    const v = b.video as { external?: { url: string }; file?: { url: string } } | undefined;
    const src = v?.external?.url ?? v?.file?.url ?? "";
    return src ? { type: "video", src: encodeUrl(src) } : null;
  }
  if (t === "divider") return { type: "divider" };
  if (t === "quote") {
    return { type: "quote", text: richTextOf(b.quote?.rich_text) };
  }
  if (t === "callout") {
    const data = b.callout as { rich_text?: Array<{ plain_text: string }>; icon?: { type?: string; emoji?: string } | null } | undefined;
    const emoji = data?.icon?.type === "emoji" ? (data.icon.emoji ?? null) : null;
    const text = richTextOf(data?.rich_text);
    const children = raw.has_children ? await fetchPageBlocks(raw.id) : [];
    return { type: "callout", text, emoji, children };
  }
  if (t === "bulleted_list_item") {
    return { type: "bullet", text: richTextOf(b.bulleted_list_item?.rich_text) };
  }
  if (t === "numbered_list_item") {
    return { type: "number", text: richTextOf(b.numbered_list_item?.rich_text) };
  }
  return null;
}

async function fetchPageBlocks(pageId: string): Promise<WorkBlock[]> {
  const out: WorkBlock[] = [];
  let cursor: string | undefined;
  do {
    const res = await workNotion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });
    for (const b of res.results) {
      const block = await mapBlock(b as unknown as RawBlock);
      if (block) out.push(block);
    }
    cursor = (res as { next_cursor: string | null }).next_cursor ?? undefined;
  } while (cursor);
  return out;
}

function rowToSummary(row: { id: string; properties: Record<string, unknown> }): WorkSummary {
  const props = row.properties;
  const cover = getRichText(findProp(props, "Cover")).trim();
  return {
    id: row.id,
    slug: normalizeSlug(getRichText(findProp(props, "Slug"))),
    type: getSelect(findProp(props, "Type")),
    status: getSelect(findProp(props, "Status")),
    order: getNumber(findProp(props, "Order")),
    title:
      getTitle(findProp(props, "Name")) ||
      getTitle(findProp(props, "Title")) ||
      getTitle(findTitleProp(props)) ||
      "Untitled",
    subtitle: getRichText(findProp(props, "Subtitle")),
    timeline: getRichText(findProp(props, "Timeline")),
    role: getRichText(findProp(props, "Role")),
    stats: getRichText(findProp(props, "Stats")),
    team: getRichText(findProp(props, "Team")),
    tags: getMultiSelect(findProp(props, "Tags")),
    cover: cover ? encodeUrl(cover) : null,
  };
}

export async function fetchWorkList(typeFilter?: "case-study" | "side"): Promise<WorkSummary[]> {
  if (!process.env.NOTION_WORK_TOKEN || !workDbId) {
    console.warn("[notion] NOTION_WORK_TOKEN or NOTION_WORK_DB_ID missing");
    return [];
  }
  try {
    const dataSourceId = await resolveDataSourceId(workDbId, workNotion);
    if (!dataSourceId) {
      console.warn("[notion] could not resolve a data source from id:", workDbId);
      return [];
    }

    const response = await workNotion.dataSources.query({
      data_source_id: dataSourceId,
      sorts: [{ property: "Order", direction: "ascending" }],
    });

    const items = response.results
      .filter((r): r is Extract<typeof r, { properties: unknown }> => "properties" in r)
      .map((row) => rowToSummary(row as { id: string; properties: Record<string, unknown> }));

    if (!typeFilter) return items;
    const target = typeFilter.toLowerCase();
    return items.filter((i) => (i.type ?? "").toLowerCase().replace(/\s+/g, "-") === target);
  } catch (err) {
    console.error("[notion] work list failed:", err);
    return [];
  }
}

export async function fetchWorkBySlug(slug: string): Promise<WorkDetail | null> {
  if (!process.env.NOTION_WORK_TOKEN || !workDbId) return null;
  try {
    const dataSourceId = await resolveDataSourceId(workDbId, workNotion);
    if (!dataSourceId) return null;

    const response = await workNotion.dataSources.query({
      data_source_id: dataSourceId,
    });

    const target = normalizeSlug(slug);
    const row = response.results
      .filter((r): r is Extract<typeof r, { properties: unknown }> => "properties" in r)
      .find((r) => {
        const props = (r as { properties: Record<string, unknown> }).properties;
        return normalizeSlug(getRichText(findProp(props, "Slug"))) === target;
      });

    if (!row) return null;
    const summary = rowToSummary(row as { id: string; properties: Record<string, unknown> });
    const body = await fetchPageBlocks(row.id);
    return { ...summary, body };
  } catch (err) {
    console.error("[notion] work detail failed:", err);
    return null;
  }
}
