"use client";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  animated?: boolean;
}

export default function ProgressBar({ value, className = "", animated = false }: ProgressBarProps) {
  const clipped = Math.min(100, Math.max(0, value));
  const color =
    clipped < 60 ? "bg-rose-500" : clipped < 80 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className={`h-2 rounded-full bg-slate-100 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full ${color} ${animated ? "transition-all duration-1000 ease-out" : ""}`}
        style={{ width: `${clipped}%` }}
      />
    </div>
  );
}
