import ClickInteractionToggle from "@/components/ClickInteractionToggle";
import ClickBurst from "@/components/ClickBurst";

export default function ClickToggleTestPage() {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "var(--color-neutral-light)",
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
        width: "100%",
      }}
    >
      <ClickInteractionToggle />
      <ClickBurst />
    </div>
  );
}
