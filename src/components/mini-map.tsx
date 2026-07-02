import { AlertTriangle, MapPin } from "lucide-react";
import type { Coords } from "@/hooks/use-location";

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  kind: "you" | "alert" | "incident" | "contact";
};

// Simple projection around a center point (mock map)
function project(p: { lat: number; lng: number }, center: Coords, w: number, h: number) {
  const dx = (p.lng - center.lng) * 800;
  const dy = (center.lat - p.lat) * 800;
  return { x: w / 2 + dx, y: h / 2 + dy };
}

export function MiniMap({
  center,
  points,
  height = 360,
}: {
  center: Coords;
  points: MapPoint[];
  height?: number;
}) {
  const w = 800;
  const h = height;
  return (
    <div className="card-soft relative overflow-hidden rounded-2xl">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.9 0.03 330)" strokeWidth="1" />
          </pattern>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.55 0.19 330 / 0.35)" />
            <stop offset="100%" stopColor="oklch(0.55 0.19 330 / 0)" />
          </radialGradient>
        </defs>
        <rect width={w} height={h} fill="oklch(0.98 0.02 340)" />
        <rect width={w} height={h} fill="url(#grid)" />
        {/* streets */}
        <path d={`M0 ${h * 0.4} Q ${w / 2} ${h * 0.2} ${w} ${h * 0.5}`} stroke="oklch(0.88 0.04 320)" strokeWidth="18" fill="none" />
        <path d={`M${w * 0.3} 0 L ${w * 0.35} ${h}`} stroke="oklch(0.88 0.04 320)" strokeWidth="14" fill="none" />
        <path d={`M0 ${h * 0.75} L ${w} ${h * 0.7}`} stroke="oklch(0.88 0.04 320)" strokeWidth="12" fill="none" />

        {/* points */}
        {points.map((p) => {
          const { x, y } = project(p, center, w, h);
          if (p.kind === "you") {
            return (
              <g key={p.id}>
                <circle cx={x} cy={y} r={60} fill="url(#halo)" />
                <circle cx={x} cy={y} r={12} fill="oklch(0.55 0.19 330)" stroke="white" strokeWidth="3" />
              </g>
            );
          }
          const color =
            p.kind === "alert" ? "oklch(0.62 0.26 20)" : p.kind === "incident" ? "oklch(0.7 0.2 60)" : "oklch(0.6 0.15 250)";
          return (
            <g key={p.id}>
              <circle cx={x} cy={y} r={10} fill={color} stroke="white" strokeWidth="2" />
              {p.label && (
                <text x={x + 14} y={y + 4} fontSize="12" fill="oklch(0.3 0.06 320)">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-3 bg-gradient-to-t from-background/90 to-transparent p-3 text-xs">
        <Legend color="oklch(0.55 0.19 330)" label="You" icon={<MapPin className="h-3 w-3" />} />
        <Legend color="oklch(0.62 0.26 20)" label="SOS alerts" icon={<AlertTriangle className="h-3 w-3" />} />
        <Legend color="oklch(0.7 0.2 60)" label="Incidents" icon={<AlertTriangle className="h-3 w-3" />} />
      </div>
    </div>
  );
}

function Legend({ color, label, icon }: { color: string; label: string; icon: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2 py-1 shadow-sm">
      <span className="grid h-4 w-4 place-items-center rounded-full text-white" style={{ backgroundColor: color }}>
        {icon}
      </span>
      {label}
    </span>
  );
}
