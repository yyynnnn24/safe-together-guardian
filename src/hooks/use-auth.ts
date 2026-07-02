import { useStore, KEYS, type Session, type User } from "@/lib/safe-store";

export function useAuth() {
  const [session] = useStore<Session>(KEYS.session, null);
  const [users] = useStore<User[]>(KEYS.users, []);
  const user = session ? users.find((u) => u.id === session.userId) ?? null : null;
  return { user, isAuthenticated: !!user };
}
