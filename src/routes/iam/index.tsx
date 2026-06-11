import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { LayoutGrid, Users, Building2, Contact } from "lucide-react";

export const Route = createFileRoute("/iam/")({
  head: () => ({ meta: [{ title: "IAM — Shalion" }] }),
  component: IamHome,
});

type Card = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
};

const cards: Card[] = [
  { label: "Applications", to: "/iam/applications", icon: LayoutGrid, desc: "The products users and accounts can access (Ecometry, Data Collector, IAM), each with its own permissions." },
  { label: "Users", to: "/iam/users", icon: Users, desc: "Console and end users — their email, the accounts they belong to, their role and active status." },
  { label: "Accounts", to: "/iam/accounts", icon: Building2, desc: "The client / organisation contexts that group users and authorise access to applications." },
  { label: "Roles / Persona", to: "/iam/roles", icon: Contact, desc: "Roles and personas that bundle the permissions assigned to users within an account." },
];

function IamHome() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">IAM</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Identity &amp; access management for the Shalion platform. IAM controls who can sign in,
          which <em>accounts</em> they belong to, which <em>applications</em> they can reach, and
          what they may do there through <em>roles</em> and per-application permissions.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.label}
                to={c.to}
                className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-[var(--sidebar-active-fg)]/40 hover:bg-secondary/40"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--sidebar-active)] text-[var(--sidebar-active-fg)]">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h2 className="text-sm font-semibold text-foreground">{c.label}</h2>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
