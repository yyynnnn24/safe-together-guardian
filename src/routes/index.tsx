import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Siren, MapPin, Users, Timer, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Feature({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="card-soft rounded-2xl p-5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Landing() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-semibold">SafeTogether</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Link to="/auth" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
            Get started
          </Link>
        </div>
      </nav>

      <section className="mt-16 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Shield className="h-3.5 w-3.5" /> Designed for women, by design
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Feel safe wherever <span className="text-primary">you go.</span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            SafeTogether is a soft, powerful safety companion — one-tap SOS, live location sharing,
            trusted contacts, and safety check-ins that alert your circle if something feels off.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/auth" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90">
              Create your account
            </Link>
            <Link to="/dashboard" className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-secondary">
              Try the dashboard
            </Link>
          </div>
        </div>
        <div className="card-soft relative rounded-3xl p-8">
          <div className="grid place-items-center">
            <div className="btn-sos animate-pulse-ring grid h-40 w-40 place-items-center rounded-full text-lg font-bold uppercase tracking-widest text-white">
              <div className="flex flex-col items-center">
                <Siren className="h-10 w-10" />
                SOS
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            One tap sends your live location to every trusted contact.
          </p>
        </div>
      </section>

      <section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Feature icon={Siren} title="Emergency SOS" desc="Instant alert with GPS location to your circle." />
        <Feature icon={MapPin} title="Live Location" desc="Share your whereabouts with people you trust." />
        <Feature icon={Users} title="Trusted Contacts" desc="Curate the people who look out for you." />
        <Feature icon={Timer} title="Safety Check-in" desc="If you don't reply in time, we alert your contacts." />
        <Feature icon={AlertTriangle} title="Incident Reports" desc="Log unsafe places to protect others." />
        <Feature icon={Shield} title="Community Map" desc="See nearby alerts and reported incidents." />
      </section>

      <footer className="mt-20 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SafeTogether — Built with care.
      </footer>
    </div>
  );
}
