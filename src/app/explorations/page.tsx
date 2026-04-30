import ExplorationsContent from "@/components/ExplorationsContent";
import { fetchExplorations } from "@/lib/notion";

export const revalidate = 3600;

export default async function ExplorationsPage() {
  const items = await fetchExplorations();
  return <ExplorationsContent items={items} />;
}
