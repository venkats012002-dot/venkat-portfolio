import SidesContent from "@/components/SidesContent";
import type { Side } from "@/components/SideItem";

const PLACEHOLDER_DESCRIPTION =
  "Lorem ipsum dolor sit amet consectetur. Tempus eu sagittis.";

const PLACEHOLDER_ITEMS: Side[] = [
  {
    id: "p1",
    title: "Building a custom image tool for the Bluethroat Labs Team",
    description: PLACEHOLDER_DESCRIPTION,
    image: "/sides/placeholder.png",
  },
  {
    id: "p2",
    title: "Building a pdf report generator for the Bluethroat Labs Team",
    description: PLACEHOLDER_DESCRIPTION,
    image: "/sides/placeholder.png",
  },
  {
    id: "p3",
    title: "Custom Animations using Math",
    description: PLACEHOLDER_DESCRIPTION,
    image: "/sides/placeholder.png",
  },
  {
    id: "p4",
    title: "How I used Claude to animate SVG’s using native animations",
    description: PLACEHOLDER_DESCRIPTION,
    image: "/sides/placeholder.png",
  },
  {
    id: "p5",
    title: "Notes on building portfolio sites that don’t suck",
    description: PLACEHOLDER_DESCRIPTION,
    image: "/sides/placeholder.png",
  },
  {
    id: "p6",
    title: "Self-hosting Paper exports for performance",
    description: PLACEHOLDER_DESCRIPTION,
    image: "/sides/placeholder.png",
  },
];

export default function SidesPage() {
  return <SidesContent items={PLACEHOLDER_ITEMS} />;
}
