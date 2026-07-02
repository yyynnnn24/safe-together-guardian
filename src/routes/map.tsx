import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { MiniMap, type MapPoint } from "@/components/mini-map";
import { SosButton } from "@/components/sos-button";
import { useLocation } from "@/hooks/use-location";
import { useAlerts } from "@/hooks/use-alerts";
import { useStore, KEYS, type Incident } from "@/lib/safe-store";

export const Route = createFileRoute("/map")({
  component: () => (
    <AuthGate>
      <MapPage />
    </AuthGate>
  ),
});

// Mock nearby alerts (relative to user)
const MOCK_OFFSETS = [
  { d: 0.004, l: 0.006, label: "Reported harassment" },
  { d: -0.005, l: 0.003, label: "Poor lighting" },
  { d: 0.002, l: -0.008, label: "Suspicious activity" },
];

function MapPage() {
  const { coords, loading } = useLocation(true);
  const { alerts } = useAlerts();
  const [incidents] = useStore<Incident[]>(KEYS.incidents, []);

  const center = coords ?? { lat: 40.7128, lng: -74.006 };

  const points: MapPoint[] = useMemo(() => {
    const arr: MapPoint[] = [{ id: "me", lat: center.lat, lng: center.lng, kind: "you" }];
    MOCK_OFFSETS.forEach((o, i) =>
      arr.push({ id: `mock-${i}`, lat: center.lat + o.d, lng: center.lng + o.l, kind: "alert", label: o.label }),
    );
    incidents.slice(0, 20).forEach((i) => arr.push({ id: i.id, lat: i.lat, lng: i.lng, kind: "incident", label: i.type }));
    alerts.slice(0, 20).forEach((a) => arr.push({ id: a.id, lat: a.lat, lng: a.lng, kind: "alert", label: "SOS" }));
    return arr;
  }, [center.lat, center.lng, incidents, alerts]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Safety map</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Locating you…" : `Centered at ${center.lat.toFixed(3)}, ${center.lng.toFixed(3)}`}
          </p>
        </div>
        <div className="hidden md:block">
          <SosButton compact />
        </div>
      </div>
      <MiniMap center={center} points={points} height={480} />
      <div className="md:hidden">
        <div className="card-soft flex items-center justify-between rounded-2xl p-4">
          <div>
            <div className="font-semibold">Emergency</div>
            <div className="text-xs text-muted-foreground">Tap SOS to alert your circle.</div>
          </div>
          <SosButton compact />
        </div>
      </div>
    </div>
  );
}
