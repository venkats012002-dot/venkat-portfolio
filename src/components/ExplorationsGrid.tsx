import ExplorationCard, { type Exploration } from "./ExplorationCard";

export default function ExplorationsGrid({ items }: { items: Exploration[] }) {
  return (
    <div
      style={{
        alignSelf: "stretch",
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      }}
    >
      {items.map((item) => (
        <ExplorationCard key={item.id} {...item} />
      ))}
    </div>
  );
}
