import HomeClient from "@/components/HomeClient";
import type { KeyProject } from "@/components/KeyProjects";
import { fetchWorkList } from "@/lib/notion";

export const revalidate = 3600;

export default async function Home() {
  const items = await fetchWorkList("case-study");
  const projects: KeyProject[] = items
    .filter((item) => item.cover && item.title)
    .map((item) => ({
      image: item.cover ?? "",
      tags: item.tags,
      title: item.title,
      description: item.subtitle,
      ...(item.slug ? { href: `/work/${item.slug}` } : {}),
    }));
  return <HomeClient projects={projects} />;
}
