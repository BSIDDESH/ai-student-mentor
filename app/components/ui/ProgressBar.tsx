// Dark-canvas progress bar with optional glow.
// Used everywhere a score appears as a bar.
import { scoreColor, scoreGlow } from "@/app/lib/helpers";

interface Props {
  value: number;
  glow?: boolean;
}

export default function ProgressBar({ value, glow = true }: Props) {
  return (
    <div className="h-1.5 rounded-full overflow-visible" style={{ background: "rgba(255,255,255,0.07)" }}>
      <div
        className={`h-full rounded-full ${scoreColor(value)} transition-all duration-700`}
        style={{
          width: `${value}%`,
          boxShadow: glow ? scoreGlow(value) : "none",
        }}
      />
    </div>
  );
}
