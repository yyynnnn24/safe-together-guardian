import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, MapPin } from "lucide-react";
import { toast } from "sonner";
import { AuthGate } from "@/components/auth-gate";
import { useLocation } from "@/hooks/use-location";
import { useStore, KEYS, type Incident } from "@/lib/safe-store";

export const Route = createFileRoute("/report")({
  component: () => (
    <AuthGate>
      <ReportPage />
    </AuthGate>
  ),
});

const TYPES = ["Harassment", "Stalking", "Poor lighting", "Suspicious activity", "Unsafe area", "Other"];

function ReportPage() {
  const { coords } = useLocation();
  const [incidents, setIncidents] = useStore<Incident[]>(KEYS.incidents, []);
  const [type, setType] = useState(TYPES[0]);
  const [description, setDescription] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return toast.error("Please describe the incident");
    const loc = coords ?? { lat: 0, lng: 0 };
    const inc: Incident = {
      id: crypto.randomUUID(),
      type,
      description: description.trim(),
      lat: loc.lat,
      lng: loc.lng,
      createdAt: Date.now(),
    };
    setIncidents((prev) => [inc, ...prev]);
    setDescription("");
    toast.success("Incident reported. Thank you for keeping others safe.");
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
      <div className="card-soft h-fit rounded-2xl p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4 text-primary" /> Report an incident
        </h2>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary">
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what happened…"
            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div className="flex items-center gap-2 rounded-xl bg-secondary/70 px-3 py-2 text-xs text-secondary-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Locating…"}
          </div>
          <button className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Submit report
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Recent incidents ({incidents.length})</h2>
        {incidents.length === 0 ? (
          <div className="card-soft rounded-2xl p-8 text-center text-sm text-muted-foreground">
            No incidents reported yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {incidents.map((i) => (
              <li key={i.id} className="card-soft rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {i.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(i.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-sm">{i.description}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {i.lat.toFixed(4)}, {i.lng.toFixed(4)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
