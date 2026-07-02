import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, UserPlus, Phone } from "lucide-react";
import { toast } from "sonner";
import { AuthGate } from "@/components/auth-gate";
import { useStore, KEYS, type Contact } from "@/lib/safe-store";

export const Route = createFileRoute("/contacts")({
  component: () => (
    <AuthGate>
      <ContactsPage />
    </AuthGate>
  ),
});

function ContactsPage() {
  const [contacts, setContacts] = useStore<Contact[]>(KEYS.contacts, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return toast.error("Name and phone are required");
    setContacts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: name.trim(), phone: phone.trim(), relation: relation.trim() || undefined },
    ]);
    setName("");
    setPhone("");
    setRelation("");
    toast.success("Contact added");
  };

  const remove = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast("Contact removed");
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
      <div className="card-soft h-fit rounded-2xl p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <UserPlus className="h-4 w-4 text-primary" /> Add trusted contact
        </h2>
        <form onSubmit={add} className="mt-4 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary" />
          <input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Relation (e.g. Mom, Friend)" className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary" />
          <button className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Add contact
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Your circle ({contacts.length})</h2>
        {contacts.length === 0 ? (
          <div className="card-soft rounded-2xl p-8 text-center text-sm text-muted-foreground">
            No trusted contacts yet. Add someone who should know when you need help.
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {contacts.map((c) => (
              <li key={c.id} className="card-soft flex items-center gap-3 rounded-2xl p-4">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
                  {c.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{c.name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" /> {c.phone}
                    {c.relation && <span className="ml-1">· {c.relation}</span>}
                  </div>
                </div>
                <button onClick={() => remove(c.id)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
