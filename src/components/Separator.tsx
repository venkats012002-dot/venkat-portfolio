type Variant = "primary" | "secondary";

export default function Separator({
  variant = "primary",
  color = "#CACACA",
}: {
  variant?: Variant;
  color?: string;
}) {
  const strokeWidth = variant === "primary" ? 4 : 1;
  return (
    <svg
      height={strokeWidth}
      preserveAspectRatio="none"
      viewBox={`0 0 10 ${strokeWidth}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", flexShrink: 0 }}
    >
      <line
        x1="0"
        y1={strokeWidth / 2}
        x2="10"
        y2={strokeWidth / 2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray="4 8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
