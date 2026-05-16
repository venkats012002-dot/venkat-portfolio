import MobileNavWithSidebar from "@/components/MobileNavWithSidebar";
import Footer from "@/components/Footer";
import HiddenFooter from "@/components/HiddenFooter";
import Separator from "@/components/Separator";
import PersonalArchiveLogo from "@/components/PersonalArchiveLogo";
import { fetchArchiveEntries, type ArchiveEntry } from "@/lib/notion";

export const revalidate = 300;

export default async function PersonalArchivePage() {
  const entries = await fetchArchiveEntries();
  const grouped = groupByYear(entries);

  return (
    <div
      style={{
        backgroundColor: "var(--color-neutral-light)",
        color: "var(--color-neutral-dark)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <MobileNavWithSidebar />

      <main
        style={{
          alignSelf: "stretch",
          boxSizing: "border-box",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          paddingTop: 120,
          paddingBottom: 48,
          paddingInline: "max(24px, calc((100vw - 720px) / 2))",
        }}
      >
        <header style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <PersonalArchiveLogo />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h1
              style={{
                margin: 0,
                color: "var(--color-neutral-12, #000)",
                fontFamily: "var(--font-heading)",
                fontSize: "24px",
                fontWeight: 500,
                lineHeight: "180%",
              }}
            >
              Welcome to my Personal Archive
            </h1>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={paragraphStyle}>
                I like to go on walks everyday and the best part about it was always the introspection and self talks I have on everything around me. They say the world is your canvas right. Not every thought I get might be appropriate to be shared on the internet, but most times I get thoughts on how everything around us has a story to convey and makes me wondering.
              </p>
            </div>
          </div>
        </header>

        <div style={{ marginTop: 48, marginBottom: 48 }}>
          <Separator variant="primary" />
        </div>

        {grouped.length === 0 ? (
          <div style={{ ...paragraphStyle, fontStyle: "italic" }}>
            No entries yet. Check back after the next walk.
          </div>
        ) : (
          grouped.map(([year, items], i) => (
            <section
              key={year}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 48,
                marginTop: i === 0 ? 0 : 96,
              }}
            >
              <div
                style={{
                  color: "#7A7A7A",
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  lineHeight: "180%",
                }}
              >
                {year} • {items.length} {items.length === 1 ? "entry" : "entries"} so far
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
                {items.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <Footer />
      <HiddenFooter />
    </div>
  );
}

const paragraphStyle: React.CSSProperties = {
  margin: 0,
  color: "#7A7A7A",
  fontFamily: "var(--font-body)",
  fontSize: "14px",
  lineHeight: "150%",
};

function EntryRow({ entry }: { entry: ArchiveEntry }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          gap: 84,
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingBlock: "8px",
        }}
      >
        <div
          style={{
            flex: "1 1 540px",
            maxWidth: 540,
            color: "#101010",
            fontFamily: "var(--font-heading)",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "180%",
          }}
        >
          {entry.description}
        </div>
        <div
          style={{
            flexShrink: 0,
            color: "#7A7A7A",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            lineHeight: "180%",
            whiteSpace: "nowrap",
          }}
        >
          {entry.date}
        </div>
      </div>
      <div style={{ height: 0, borderTop: "1px dashed #CACACA" }} />
    </div>
  );
}

function groupByYear(entries: ArchiveEntry[]): Array<[number, ArchiveEntry[]]> {
  const map = new Map<number, ArchiveEntry[]>();
  for (const e of entries) {
    const list = map.get(e.year) ?? [];
    list.push(e);
    map.set(e.year, list);
  }
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
}
