import QuoteDispenser from "@/components/QuoteDispenser";

export default function QuoteTestPage() {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "var(--color-neutral-light)",
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: 32,
        width: "100%",
      }}
    >
      <QuoteDispenser />
    </div>
  );
}
