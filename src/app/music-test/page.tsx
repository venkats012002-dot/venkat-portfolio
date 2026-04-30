import MusicPlayer from "@/components/MusicPlayer";

export default function MusicTestPage() {
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
      <MusicPlayer />
    </div>
  );
}
