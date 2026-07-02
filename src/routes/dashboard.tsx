import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, MapPin, AlertTriangle, Timer, Share2, X } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { SosButton } from "@/components/sos-button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "@/hooks/use-location";
import { useAlerts } from "@/hooks/use-alerts";
import { useStore, KEYS, type Contact, type Incident } from "@/lib/safe-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AuthGate>
      <DashboardPage />
    </AuthGate>
  ),
});

function DashboardPage() {
  const { user } = useAuth();
  const { coords } = useLocation();
  const { alerts, clearAlert } = useAlerts();
  const [contacts] = useStore<Contact[]>(KEYS.contacts, []);
  const [incidents] = useStore<Incident[]>(KEYS.incidents, []);
  const [sharing, setSharing] = useStore<boolean>(KEYS.sharing, false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hi {user?.name.split(" ")[0]} 👋</h1>
        <p className="text-sm text-muted-foreground">
          {coords
            ? `You're near ${coords.lat.toFixed(3)}°, ${coords.lng.toFixed(3)}°`
            : "Getting your location…"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="card-soft flex flex-col items-center justify-center rounded-3xl p-8">
          <SosButton />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Tap to instantly alert your {contacts.length} trusted contact
            {contacts.length === 1 ? "" : "s"} with your live location.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="card-soft rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Live location sharing</div>
                  <div className="text-xs text-muted-foreground">
                    {sharing ? "Actively sharing with contacts" : "Off"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSharing(!sharing);
                  toast.success(!sharing ? "Location sharing ON" : "Location sharing OFF");
                }}
                className={`h-7 w-12 rounded-full transition ${sharing ? "bg-primary" : "bg-muted"}`}
                aria-label="Toggle live location sharing"
              >
                <span
                  className={`block h-6 w-6 translate-y-0.5 rounded-full bg-white shadow transition ${sharing ? "translate-x-[26px]" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={Users} label="Trusted contacts" value={contacts.length} to="/contacts" />
            <StatCard icon={AlertTriangle} label="Incidents reported" value={incidents.length} to="/report" />
            <StatCard icon={MapPin} label="Active alerts" value={alerts.length} to="/map" />
            <StatCard icon={Timer} label="Check-in timer" value="Setup" to="/checkin" />
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="card-soft rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h2 className="font-semibold">Recent SOS alerts</h2>
          </div>
          <ul className="space-y-2">
            {alerts.slice(0, 5).map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-medium">{a.message ?? "SOS triggered"}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleString()} · {a.lat.toFixed(3)}, {a.lng.toFixed(3)}
                  </div>
                </div>
                <button
                  onClick={() => clearAlert(a.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary"
                  aria-label="Dismiss alert"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  to: string;
}) {
  return (
    <Link to={to} className="card-soft rounded-2xl p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Link>
  );
}
