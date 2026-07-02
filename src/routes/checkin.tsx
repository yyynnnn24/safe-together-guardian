import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Timer, Check, X } from "lucide-react";
import { toast } from "sonner";
import { AuthGate } from "@/components/auth-gate";
import { useAlerts } from "@/hooks/use-alerts";
import { useLocation } from "@/hooks/use-location";

export const Route = createFileRoute("/checkin")({
  component: () => (
    <AuthGate>
      <CheckinPage />
    </AuthGate>
  ),
});

function CheckinPage() {
  const [minutes, setMinutes] = useState(5);
  const [remaining, setRemaining] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { triggerSos } = useAlerts();
  const { coords } = useLocation();

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRemaining(minutes * 60);
    toast.success(`Check-in armed for ${minutes} min`);
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r === null) return null;
        if (r <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          triggerSos(coords ?? { lat: 0, lng: 0 }, "Missed safety check-in!");
          return null;
        }
        return r - 1;
      });
    }, 1000);
  };

  const stop = (safe: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRemaining(null);
    toast(safe ? "You're marked safe ✨" : "Check-in cancelled");
  };

  const mm = remaining !== null ? String(Math.floor(remaining / 60)).padStart(2, "0") : "--";
  const ss = remaining !== null ? String(remaining % 60).padStart(2, "0") : "--";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Safety check-in</h1>
        <p className="text-sm text-muted-foreground">
          Set a timer. If you don't respond in time, we'll send an SOS to your trusted contacts.
        </p>
      </div>

      <div className="card-soft rounded-3xl p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Timer className="h-8 w-8" />
        </div>
        <div className="mt-6 font-display text-6xl font-bold tabular-nums text-primary">
          {mm}:{ss}
        </div>

        {remaining === null ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-center gap-2">
              {[2, 5, 10, 15, 30].map((m) => (
                <button
                  key={m}
                  onClick={() => setMinutes(m)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    minutes === m ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
            <button
              onClick={start}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
            >
              Arm check-in for {minutes} min
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => stop(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Check className="h-4 w-4" /> I'm safe
            </button>
            <button
              onClick={() => stop(false)}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold hover:bg-secondary"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
