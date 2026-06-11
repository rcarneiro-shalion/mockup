import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { HelpCircle, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { rulesForPath, RULE_SECTIONS } from "@/lib/businessRules";
import { BulkMethodsCatalogue } from "@/components/bulk/BulkMethodsModal";
import { DashboardGuideContent } from "@/components/settings/DashboardGuideModal";
import { cn } from "@/lib/utils";

// Combined navigation: every rules section, then the two appendices.
type NavEntry = { kind: "section" | "appendix"; key: string; label: string };
const NAV: NavEntry[] = [
  ...RULE_SECTIONS.map((s) => ({ kind: "section" as const, key: s.section, label: s.section })),
  { kind: "appendix", key: "bulk", label: "Bulk" },
  { kind: "appendix", key: "dashboard", label: "Dashboard" },
];
const sectionByName = (name: string) => RULE_SECTIONS.find((s) => s.section === name);

const titleFor = (e: NavEntry) =>
  e.kind === "section"
    ? `${e.key} — business rules`
    : e.key === "bulk"
      ? "Bulk import methods"
      : "Dashboard products & configuration";

const introFor = (e: NavEntry) =>
  e.kind === "section"
    ? (sectionByName(e.key)?.intro ?? "")
    : e.key === "bulk"
      ? "Every supported bulk operation — pick an entity and action, then download its example file."
      : "What each Maestro product measures and how Ecometry configuration drives the dashboards.";

/**
 * The (?) help affordance in the top bar. Appears on pages with registered
 * rules; once open it can navigate across every section and the Bulk /
 * Dashboard appendices via the header navigator.
 */
export function BusinessRulesTrigger() {
  const { pathname } = useLocation();
  const found = rulesForPath(pathname);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [pageKey, setPageKey] = useState<string>("");

  if (!found) return null;

  const entry = NAV[idx] ?? NAV[0];
  const goEntry = (next: number) => {
    setIdx((next + NAV.length) % NAV.length);
    setPageKey("");
  };

  const openModal = () => {
    const startIdx = NAV.findIndex((e) => e.kind === "section" && e.key === found.section.section);
    setIdx(startIdx >= 0 ? startIdx : 0);
    setPageKey(found.activePageKey);
    setOpen(true);
  };

  const section = entry.kind === "section" ? sectionByName(entry.key) : undefined;
  const page = section ? (section.pages.find((p) => p.key === pageKey) ?? section.pages[0]) : undefined;

  return (
    <>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={openModal}
              aria-label="Business rules for this page"
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <HelpCircle className="h-4.5 w-4.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Business rules for this page</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 space-y-1.5 border-b border-border px-6 py-5">
            <div className="flex items-start justify-between gap-3 pr-7">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5 text-[var(--sidebar-active-fg)]" />
                {titleFor(entry)}
              </DialogTitle>

              {/* Section navigator: < [dropdown] > */}
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => goEntry(idx - 1)}
                  aria-label="Previous section"
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-sm text-foreground/80 hover:bg-secondary"
                    >
                      {entry.label}
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="max-h-72 overflow-auto">
                    <DropdownMenuLabel>Sections</DropdownMenuLabel>
                    {NAV.filter((e) => e.kind === "section").map((e) => (
                      <DropdownMenuItem
                        key={e.key}
                        onSelect={() => goEntry(NAV.indexOf(e))}
                        className={cn(entry.key === e.key && "bg-secondary font-medium")}
                      >
                        {e.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Appendices</DropdownMenuLabel>
                    {NAV.filter((e) => e.kind === "appendix").map((e) => (
                      <DropdownMenuItem
                        key={e.key}
                        onSelect={() => goEntry(NAV.indexOf(e))}
                        className={cn(entry.key === e.key && "bg-secondary font-medium")}
                      >
                        {e.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => goEntry(idx + 1)}
                  aria-label="Next section"
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{introFor(entry)}</p>
          </DialogHeader>

          {/* Appendix content */}
          {entry.kind === "appendix" ? (
            entry.key === "bulk" ? (
              <BulkMethodsCatalogue />
            ) : (
              <DashboardGuideContent />
            )
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Page selector */}
              <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-border px-6 py-3">
                {section?.pages.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPageKey(p.key)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm transition-colors",
                      p.key === page?.key
                        ? "border-[var(--sidebar-active-fg)] bg-[var(--sidebar-active)] font-medium text-[var(--sidebar-active-fg)]"
                        : "border-border text-foreground/70 hover:bg-secondary",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Rules for the selected page */}
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
                {page?.groups.map((g) => (
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
