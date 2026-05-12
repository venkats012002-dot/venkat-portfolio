import Separator from "./Separator";
import ProjectCard from "./ProjectCard";

const PROJECTS = [
  {
    image: "/projects/bluethroat-branding.png",
    tags: ["Visual Design", "Branding", "Custom AI Tools"],
    title: "Branding for Bluethroat Labs",
    description:
      "Led end-to-end brand creation for Bluethroat Labs, from identity to web. Designed and built custom tools leveraging programmable design (WebGL-based controls and dynamic report generation) to automate and scale brand consistency.",
    href: "/work/bluethroat-branding",
  },
  {
    image: "/projects/quillaudits-leaderboard.png",
    tags: ["Product Design", "Data Structuring"],
    title: "QuillAudits Audit Leaderboard",
    description:
      "Designed the Audit Leaderboard as a system for structuring audit data, scoring logic, and findings into a clear, navigable interface. Collaborated with audit and engineering teams to align technical evaluation with usable representations.",
  },
  {
    image: "/projects/quillaudits-redesign.png",
    tags: ["Services Design", "Performance Optimization", "Design Systems"],
    title: "QuillAudits Brand Redesign",
    description:
      "Redesigned QuillAudits with a focus on performance, clarity, and motion, introducing SVG-based interactions and a cohesive visual system. Iterated continuously using user data and heatmaps to refine key pages, resulting in a 25% increase in average engagement time and a 3x growth in active users.",
  },
];

export default function KeyProjects() {
  return (
    <section
      id="keyprojects"
      data-section-index={1}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: "72px",
        width: "720px",
        maxWidth: "100%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "8px" }}>
          <div
            style={{
              backgroundColor: "var(--color-neutral-dark)",
              width: "12px",
              height: "12px",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              color: "var(--color-neutral-dark)",
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "180%",
            }}
          >
            Key Projects
          </div>
        </div>
        <Separator variant="primary" />
      </div>

      {PROJECTS.map((p) => (
        <ProjectCard key={p.title} {...p} />
      ))}
    </section>
  );
}
