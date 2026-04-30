import DiscoButton from "@/components/DiscoButton";
import DiscoMode from "@/components/DiscoMode";

export default function DiscoButtonTestPage() {
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
      <DiscoButton />
      <DiscoMode />
    </div>
  );
}
