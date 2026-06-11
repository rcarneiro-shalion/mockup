import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DASHBOARD_PRODUCTS,
  DASHBOARD_CONFIG_GROUPS,
} from "@/lib/dashboardGuide";
import { BookOpen, LayoutDashboard, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "products" | "config";

/** Helper modal explaining the Maestro products and how the Ecometry
 *  configuration drives the client dashboards. Triggered from the
 *  Dashboard applications page. */
export function DashboardGuideModal({ trigger }: { trigger?: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("products");

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <BookOpen className="h-4 w-4" /> Products & dashboards
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 space-y-1.5 border-b border-border px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <LayoutDashboard className="h-5 w-5 text-[var(--sidebar-active-fg)]" />
            Products & dashboard configuration
          </DialogTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">
            What each Maestro product measures, and how the configuration you set up here in
            Ecometry drives the dashboards clients see.
          </p>
        </DialogHeader>

        {/* Tab switch */}
        <div className="flex shrink-0 gap-1.5 border-b border-border px-6 py-3">
          <TabBtn active={tab === "products"} onClick={() => setTab("products")} icon={LayoutDashboard}>
            Products
          </TabBtn>
          <TabBtn active={tab === "config"} onClick={() => setTab("config")} icon={Settings2}>
            How configuration drives the dashboard
          </TabBtn>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {tab === "products" ? (
            <div className="space-y-3">
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
          ) : (
            <div className="space-y-5">
              {DASHBOARD_CONFIG_GROUPS.map((g) => (
                <div key={g.category}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {g.category}
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {g.rules.map((r, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sidebar-active-fg)]" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TabBtn({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
        active
          ? "border-[var(--sidebar-active-fg)] bg-[var(--sidebar-active)] font-medium text-[var(--sidebar-active-fg)]"
          : "border-border text-foreground/70 hover:bg-secondary",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
