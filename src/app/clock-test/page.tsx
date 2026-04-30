import Clock from "@/components/Clock";

export default function ClockTestPage() {
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
      <Clock />
    </div>
  );
}
