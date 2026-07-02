import { useCallback } from "react";
import { toast } from "sonner";
import { useStore, KEYS, type SosAlert, type Contact } from "@/lib/safe-store";

export function useAlerts() {
  const [alerts, setAlerts] = useStore<SosAlert[]>(KEYS.alerts, []);
  const [contacts] = useStore<Contact[]>(KEYS.contacts, []);

  const triggerSos = useCallback(
    (loc: { lat: number; lng: number }, message?: string) => {
      const alert: SosAlert = {
        id: crypto.randomUUID(),
        lat: loc.lat,
        lng: loc.lng,
        createdAt: Date.now(),
        message,
      };
      setAlerts((prev) => [alert, ...prev]);
      const names = contacts.length
        ? contacts.map((c) => c.name).join(", ")
        : "no trusted contacts yet";
      toast.error("SOS Alert sent", {
        description: `Location shared with ${names}.`,
      });
      return alert;
    },
    [contacts, setAlerts],
  );

  const clearAlert = useCallback(
    (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id)),
    [setAlerts],
  );

  return { alerts, triggerSos, clearAlert };
}
