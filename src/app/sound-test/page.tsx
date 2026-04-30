import SoundSettings from "@/components/SoundSettings";
import ClickBurst from "@/components/ClickBurst";

export default function SoundTestPage() {
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
      <SoundSettings />
      <ClickBurst />
    </div>
  );
}
