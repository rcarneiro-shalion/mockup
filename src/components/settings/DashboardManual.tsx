import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import {
  DASHBOARD_OVERVIEW,
  DASHBOARD_PRODUCTS,
  DASHBOARD_CONFIG_GROUPS,
  DASHBOARD_SECTION_CATALOGUE,
  DASHBOARD_CREATION_STEPS,
  DASHBOARD_PIPELINE,
} from "@/lib/dashboardGuide";
import { ArrowLeft } from "lucide-react";

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Table of contents, in render order.
const TOC: { id: string; title: string }[] = [
  { id: "overview", title: "Overview" },
  { id: "products", title: "The Maestro products" },
  ...DASHBOARD_CONFIG_GROUPS.map((g) => ({ id: slug(g.category), title: g.category })),
  { id: "section-catalogue", title: "Dashboard sections catalogue" },
  { id: "creating", title: "Creating a dashboard" },
  { id: "pipeline", title: "Behind the scenes (dbt & Snowflake)" },
];

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map((r, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sidebar-active-fg)]" />
          <span>{r}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-6 border-b border-border pb-2 text-lg font-semibold text-foreground">
      {children}
    </h2>
  );
}

export function DashboardManual() {
  const navigate = useNavigate();
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <AppShell>
      <div className="h-full overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
          <button
            type="button"
            onClick={() => navigate({ to: "/settings/dashboard-applications" })}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard applications
          </button>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Dashboard manual</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            How the dashboards clients see are configured through Ecometry — the products, the
            structure, what governs visibility, and how the configuration flows to the data.
          </p>

          <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
            {/* TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  On this page
                </h3>
                <nav className="mt-2 flex flex-col gap-1">
                  {TOC.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => go(t.id)}
                      className="rounded px-2 py-1 text-left text-sm text-foreground/70 hover:bg-secondary hover:text-foreground"
                    >
                      {t.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0 space-y-10">
              <section className="space-y-3">
                <SectionTitle id="overview">Overview</SectionTitle>
                {DASHBOARD_OVERVIEW.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/90">
                    {p}
                  </p>
                ))}
              </section>

              <section className="space-y-3">
                <SectionTitle id="products">The Maestro products</SectionTitle>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DASHBOARD_PRODUCTS.map((p) => (
                    <div key={p.code} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-[var(--sidebar-active)] px-2 py-0.5 text-xs font-semibold text-[var(--sidebar-active-fg)]">
                          {p.code}
                        </span>
                        <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                      </div>
                      <p className="mt-1.5 text-sm text-foreground/90">{p.tagline}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.measures}</p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {p.dashboards.map((d) => (
                          <span
                            key={d}
                            className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-foreground/80"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {DASHBOARD_CONFIG_GROUPS.map((g) => (
                <section key={g.category} className="space-y-2">
                  <SectionTitle id={slug(g.category)}>{g.category}</SectionTitle>
                  <Bullets items={g.rules} />
                </section>
              ))}

              <section className="space-y-3">
                <SectionTitle id="section-catalogue">Dashboard sections catalogue</SectionTitle>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The standard top-level section sets a client's data group can expose:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DASHBOARD_SECTION_CATALOGUE.map((s) => (
                    <div key={s.name} className="rounded-lg border border-border bg-card p-4">
                      <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.items.map((it) => (
                          <span
                            key={it}
                            className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-foreground/80"
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <SectionTitle id="creating">Creating a dashboard</SectionTitle>
                <ol className="space-y-2.5">
                  {DASHBOARD_CREATION_STEPS.map((s, i) => (
                    <li key={s.title} className="flex gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--sidebar-active)] text-xs font-semibold text-[var(--sidebar-active-fg)]">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-foreground/90">
                        <span className="font-medium text-foreground">{s.title}.</span> {s.text}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="space-y-2">
                <SectionTitle id="pipeline">Behind the scenes (dbt &amp; Snowflake)</SectionTitle>
                <Bullets items={DASHBOARD_PIPELINE} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
