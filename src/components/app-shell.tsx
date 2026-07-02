import { Link, useRouterState } from "@tanstack/react-router";
import { Shield, Home, Users, MapPin, AlertTriangle, Timer, LogOut } from "lucide-react";
import { logout } from "@/lib/safe-store";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const nav = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/map", label: "Map", icon: MapPin },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/checkin", label: "Check-in", icon: Timer },
  { to: "/report", label: "Report", icon: AlertTriangle },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-none">SafeTogether</div>
              <div className="text-xs text-muted-foreground">Female Friendly Safety</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            {user && (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  Hi, <span className="font-medium text-foreground">{user.name.split(" ")[0]}</span>
                </span>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/auth";
                  }}
                  className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-5">
          {nav.map((n) => {
            const active = pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
