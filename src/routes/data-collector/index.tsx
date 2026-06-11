import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import {
  FolderKanban,
  LayoutTemplate,
  Braces,
  ClipboardList,
  PlayCircle,
  ListChecks,
  Network,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/data-collector/")({
  head: () => ({ meta: [{ title: "Data Collector — Shalion" }] }),
  component: DataCollectorHome,
});

type Card = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
};

const cards: Card[] = [
  { label: "Projects", to: "/data-collector/projects", icon: FolderKanban, desc: "Extraction projects — code, output schema, template, tags and proxy account." },
  { label: "Templates", to: "/data-collector/templates", icon: LayoutTemplate, desc: "Reusable project templates with environment variables and allowed proxies." },
  { label: "Output schemas", to: "/data-collector/outputs/schemas", icon: Braces, desc: "The shape of the extracted data — fields and their data types." },
  { label: "Orders", to: "/data-collector/orders", icon: ClipboardList, desc: "What to extract from which store, on which schedule and delivery method." },
  { label: "Executions", to: "/data-collector/executions", icon: PlayCircle, desc: "Each run of an order — status, task summary, errors and proxy usage." },
  { label: "Tasks", to: "/data-collector/tasks", icon: ListChecks, desc: "The individual scraping units inside an execution, with status and errors." },
  { label: "Proxies", to: "/data-collector/settings/proxies/accounts", icon: Network, desc: "Proxy providers and accounts used to route extraction traffic." },
  { label: "Error indicators", to: "/data-collector/settings/error-indicators", icon: AlertTriangle, desc: "Regex rules that classify task failures and drive automatic re-execution." },
];

function DataCollectorHome() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Data Collector</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The Data Collector is Shalion&apos;s scraping / extraction engine. Ecometry decides{" "}
          <em>what</em> to measure; the Data Collector decides <em>how</em> it is collected from the
          web — projects define the scraper, orders schedule the work per store, and each run becomes
          an execution made of many tasks.
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
