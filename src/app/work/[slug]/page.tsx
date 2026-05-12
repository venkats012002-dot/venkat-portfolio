import { notFound } from "next/navigation";
import CaseStudyContent from "@/components/CaseStudyContent";
import { fetchWorkBySlug, fetchWorkList } from "@/lib/notion";

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await fetchWorkList();
  return items
    .filter((i) => i.slug)
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchWorkBySlug(slug);
  return {
    title: data ? `${data.title} — Venkat` : "Not found — Venkat",
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [data, allCaseStudies] = await Promise.all([
    fetchWorkBySlug(slug),
    fetchWorkList("case-study"),
  ]);
  if (!data) notFound();
  const others = allCaseStudies.filter((item) => item.slug && item.slug !== data.slug);
  return <CaseStudyContent data={data} others={others} />;
}
