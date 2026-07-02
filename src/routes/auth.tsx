import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { loginUser, registerUser } from "@/lib/safe-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/dashboard" });
  }, [isAuthenticated, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res =
      mode === "login"
        ? loginUser(email, password)
        : registerUser(name || email.split("@")[0], email, password);
    if (!res.ok) return toast.error(res.error);
    toast.success(mode === "login" ? "Welcome back!" : "Account created");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="card-soft w-full max-w-md rounded-3xl p-8">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">SafeTogether</div>
            <div className="text-xs text-muted-foreground">Your safety, always with you</div>
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "Sign in to your safety dashboard" : "Join the SafeTogether community"}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "register" && (
            <Field label="Name">
              <input value={name} onChange={(e) => setName(e.target.value)} required className="input" placeholder="Jane Doe" />
            </Field>
          )}
          <Field label="Email">
            <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="input" placeholder="you@example.com" />
          </Field>
          <Field label="Password">
            <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" minLength={4} className="input" placeholder="••••••••" />
          </Field>
          <button className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-medium text-primary hover:underline"
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </div>
      </div>
      <style>{`.input { width:100%; border-radius:12px; border:1px solid var(--color-border); background:var(--color-card); padding:10px 14px; font-size:14px; outline:none; }
      .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px oklch(0.55 0.19 330 / 0.15); }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
