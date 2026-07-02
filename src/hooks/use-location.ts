import { useEffect, useState, useCallback } from "react";

export type Coords = { lat: number; lng: number; accuracy?: number };

// Default fallback: New York-ish
const FALLBACK: Coords = { lat: 40.7128, lng: -74.006 };

export function useLocation(watch = false) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setCoords(FALLBACK);
      setError("Geolocation not available — using fallback");
      setLoading(false);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setCoords(FALLBACK);
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  useEffect(() => {
    refresh();
    if (!watch || typeof navigator === "undefined" || !navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      (err) => setError(err.message),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [watch, refresh]);

  return { coords, error, loading, refresh };
}
