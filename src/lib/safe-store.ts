// Client-side store using localStorage. Simple pub/sub for reactivity.
import { useEffect, useState, useCallback } from "react";

type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach((l) => l());

const isBrowser = typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(val));
  notify();
}

export function useStore<T>(key: string, fallback: T) {
  const [state, setState] = useState<T>(fallback);
  useEffect(() => {
    setState(read(key, fallback));
    const l = () => setState(read(key, fallback));
    listeners.add(l);
    window.addEventListener("storage", l);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", l);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback(
    (val: T | ((prev: T) => T)) => {
      const prev = read<T>(key, fallback);
      const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
      write(key, next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [state, set] as const;
}

export type User = { id: string; name: string; email: string; password: string };
export type Contact = { id: string; name: string; phone: string; relation?: string };
export type Incident = {
  id: string;
  type: string;
  description: string;
  lat: number;
  lng: number;
  createdAt: number;
};
export type SosAlert = {
  id: string;
  lat: number;
  lng: number;
  createdAt: number;
  message?: string;
};
export type Session = { userId: string } | null;

export const KEYS = {
  users: "st.users",
  session: "st.session",
  contacts: "st.contacts",
  incidents: "st.incidents",
  alerts: "st.alerts",
  sharing: "st.sharing",
  checkin: "st.checkin",
} as const;

export function loginUser(email: string, password: string): { ok: true } | { ok: false; error: string } {
  const users = read<User[]>(KEYS.users, []);
  const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
  if (!u) return { ok: false, error: "Invalid email or password" };
  write<Session>(KEYS.session, { userId: u.id });
  return { ok: true };
}

export function registerUser(name: string, email: string, password: string): { ok: true } | { ok: false; error: string } {
  const users = read<User[]>(KEYS.users, []);
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    return { ok: false, error: "Email already registered" };
  const user: User = { id: crypto.randomUUID(), name, email, password };
  write(KEYS.users, [...users, user]);
  write<Session>(KEYS.session, { userId: user.id });
  return { ok: true };
}

export function logout() {
  write<Session>(KEYS.session, null);
}

export function getCurrentUser(): User | null {
  const s = read<Session>(KEYS.session, null);
  if (!s) return null;
  const users = read<User[]>(KEYS.users, []);
  return users.find((u) => u.id === s.userId) ?? null;
}
