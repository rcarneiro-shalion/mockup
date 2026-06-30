import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Store,
  Sprout,
  ListTodo,
  Megaphone,
  Package,
  ShoppingBag,
  Settings,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Home — Shalion Ecometry" }] }),
  component: HomePage,
});

type Section = {
  label: string;
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  detail: string;
};

// Plain-language, business-tone descriptions for non-technical readers.
const SECTIONS: Section[] = [
  {
    label: "Clients",
    to: "/clients",
    icon: Briefcase,
    summary: "The brands we measure for.",
    detail:
      "Every company that hires us — like Coca Cola — lives here. We set up who they are, the markets they care about, and how their products, regions and competitors are organised so the rest of the platform knows what to watch.",
  },
  {
    label: "Retailers",
    to: "/retailers",
    icon: Store,
    summary: "Where products are sold.",
    detail:
      "The master list of shops and websites — supermarkets, marketplaces, pharmacies — together with their individual stores and how those stores are grouped into regions. This is the 'where' behind every price and availability number.",
  },
  {
    label: "Seeds API",
    to: "/seeds-api/projects",
    icon: Sprout,
    summary: "What we keep an eye on.",
    detail:
      "The starting points we monitor across the web: search terms, product pages and data feeds. Projects bundle the work, subscriptions decide what gets collected and how often, and seeds are the individual things we track.",
  },
  {
    label: "Tasks",
    icon: ListTodo,
    summary: "The work in motion (being replaced by Seeds API).",
    detail:
      "The day-to-day operational jobs that keep data flowing — what is queued, running or finished. Tasks is being phased out in favour of the new Seeds API over the coming weeks, so new work is gradually moving there.",
  },
  {
    label: "Codification",
    icon: Megaphone,
    summary: "Turning messy data into clean facts.",
    detail:
      "Raw scraped data arrives inconsistent and incomplete. Here it is matched to the right brand, category and promotion — mostly automatically using rules, with the operations team correcting by hand where needed. Manual corrections always win, so every report and dashboard can be trusted.",
  },
  {
    label: "Product",
    to: "/product/client-skus",
    icon: Package,
    summary: "The catalogue and its prices.",
    detail:
      "The products being measured — our clients' SKUs, the retailers' store SKUs, and how they map together — including recommended retail prices broken down by market, region and store.",
  },
  {
    label: "Bulk",
    to: "/bulk",
    icon: ShoppingBag,
    summary: "Big changes, made fast.",
    detail:
      "Tools to import or update large amounts of information in one go, instead of editing records one by one — ideal for onboarding a new client or refreshing a whole catalogue.",
  },
  {
    label: "Settings",
    to: "/settings/dashboard-applications",
    icon: Settings,
    summary: "The control room.",
    detail:
      "The shared configuration everything else relies on: dashboard applications, targets, task groups, categories, country groups, the business rules that keep results consistent — and the legacy timeframes.",
  },
];

function HomePage() {
  return (
    <AppShell>
      <div className="h-full overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
          {/* Intro */}
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-[var(--sidebar-active)] px-3 py-1 text-xs font-medium text-[var(--sidebar-active-fg)]">
              Ecometry console
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
              Welcome to Ecometry
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Ecometry is Shalion's command centre for e-commerce measurement. In short, it keeps
              track of <span className="font-medium text-foreground">who</span> we measure for,{" "}
              <span className="font-medium text-foreground">where</span> products are sold,{" "}
              <span className="font-medium text-foreground">what</span> we watch, and{" "}
              <span className="font-medium text-foreground">how</span> the numbers are cleaned,
              configured and delivered. The guide below explains each area in everyday terms.
            </p>
          </div>

          {/* Section-by-section summary (left-aligned main column) */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                What each area is for
              </h2>
              <div className="space-y-3">
                {SECTIONS.map((s) => {
                  const Icon = s.icon;
                  const card = (
                    <div className="group flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-[var(--sidebar-active-fg)]/40">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--sidebar-active)] text-[var(--sidebar-active-fg)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{s.label}</h3>
                          <span className="text-sm text-muted-foreground">— {s.summary}</span>
                          {s.to && (
                            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          )}
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {s.detail}
                        </p>
                      </div>
                    </div>
                  );
                  return s.to ? (
                    <Link key={s.label} to={s.to} className="block">
                      {card}
                    </Link>
                  ) : (
                    <div key={s.label}>{card}</div>
                  );
                })}
              </div>
            </div>

            {/* Side note */}
            <aside className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground">New here?</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Pick any area from the menu on the left. On most pages you'll find a{" "}
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border text-[10px] font-semibold">
                    ?
                  </span>{" "}
                  button in the top-right corner — it opens a plain-language summary of the business
                  rules behind that page.
                </p>
              </div>
              <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This console is a working prototype used to validate how data and navigation flow
                  across the Ecometry platform.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
