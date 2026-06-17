import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { DashboardManualSections, MANUAL_TOC } from "@/components/settings/DashboardManual";

/** The dashboard manual body — quick-nav + the full shared sections (products,
 *  configuration rules, section catalogue, data sources, …). Fills its parent
 *  flex column; reused by the helper modal and the global help modal appendix. */
export function DashboardGuideContent() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Quick-nav over the manual sections */}
      <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-border px-6 py-3">
        {MANUAL_TOC.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => go(t.id)}
            className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <DashboardManualSections />
      </div>

      <div className="shrink-0 border-t border-border px-6 py-3 text-right">
        <Link
          to="/settings/dashboard-applications/manual"
          className="text-sm text-[var(--sidebar-active-fg)] hover:underline"
        >
          Open as full page →
        </Link>
      </div>
    </div>
  );
}

/** The main manual helper — Maestro products, dashboard structure, and how the
 *  Ecometry configuration drives client dashboards. Triggered from the Dashboard
 *  applications page. */
export function DashboardGuideModal({ trigger }: { trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <BookOpen className="h-4 w-4" /> Manual
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 space-y-1.5 border-b border-border px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-[var(--sidebar-active-fg)]" />
            Dashboard manual
          </DialogTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">
            What each Maestro product measures, the dashboard structure, and how the configuration you set up
            here in Ecometry drives the dashboards clients see.
          </p>
        </DialogHeader>
        <DashboardGuideContent />
      </DialogContent>
    </Dialog>
  );
}
