import { useState } from "react";
import { Siren } from "lucide-react";
import { useLocation } from "@/hooks/use-location";
import { useAlerts } from "@/hooks/use-alerts";
import { cn } from "@/lib/utils";

export function SosButton({ compact = false }: { compact?: boolean }) {
  const { coords, refresh } = useLocation();
  const { triggerSos } = useAlerts();
  const [sending, setSending] = useState(false);

  const handle = async () => {
    setSending(true);
    refresh();
    const loc = coords ?? { lat: 0, lng: 0 };
    triggerSos(loc, "Emergency! I need help.");
    setTimeout(() => setSending(false), 800);
  };

  return (
    <button
      onClick={handle}
      disabled={sending}
      className={cn(
        "btn-sos animate-pulse-ring group relative grid place-items-center rounded-full font-bold uppercase tracking-widest transition active:scale-95 disabled:opacity-80",
        compact ? "h-24 w-24 text-xs" : "h-48 w-48 text-lg",
      )}
      aria-label="Trigger SOS emergency alert"
    >
      <div className="flex flex-col items-center gap-1">
        <Siren className={compact ? "h-6 w-6" : "h-12 w-12"} />
        <span>{sending ? "Sending" : "SOS"}</span>
      </div>
    </button>
  );
}
