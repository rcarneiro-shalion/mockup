import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { HelpCircle, ChevronLeft, ChevronRight, ChevronDown, Search } from "lucide-react";
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
import { BULK_METHODS } from "@/lib/bulkMethods";
import { DASHBOARD_PRODUCTS, DASHBOARD_CONFIG_GROUPS } from "@/lib/dashboardGuide";
import { BulkMethodsCatalogue } from "@/components/bulk/BulkMethodsModal";
import { DashboardGuideContent } from "@/components/settings/DashboardGuideModal";
import { cn } from "@/lib/utils";

// Combined navigation: every rules section, then the two appendices.
type NavEntry = { kind: "section" | "appendix"; key: string; label: string };
const NAV: NavEntry[] = [
  ...RULE_SECTIONS.map((s) => ({ kind: "section" as const, key: s.section, label: s.section })),
  { kind: "appendix", key: "bulk", label: "Bulk methods" },
  { kind: "appendix", key: "dashboard", label: "Dashboard guide" },
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

// Flat search index across all sections + the Bulk and Dashboard appendices.
type SearchHit = { navIdx: number; pageKey?: string; where: string; snippet: string; hay: string };
const SEARCH_INDEX: SearchHit[] = (() => {
  const out: SearchHit[] = [];
  NAV.forEach((e, navIdx) => {
    if (e.kind === "section") {
      const sec = sectionByName(e.key);
      sec?.pages.forEach((p) =>
        p.groups.forEach((g) =>
          g.rules.forEach((rule) =>
            out.push({
              navIdx,
              pageKey: p.key,
              where: `${e.key} › ${p.label}`,
              snippet: rule,
              hay: `${e.key} ${p.label} ${g.category} ${rule}`.toLowerCase(),
            }),
          ),
        ),
      );
    } else if (e.key === "bulk") {
      BULK_METHODS.forEach((m) =>
        out.push({
          navIdx,
          where: `Bulk › ${m.entity} · ${m.action}`,
          snippet: m.goal,
          hay: [m.entity, m.action, m.goal, ...m.mandatoryFields, ...m.notes].join(" ").toLowerCase(),
        }),
      );
    } else {
      DASHBOARD_PRODUCTS.forEach((pr) =>
        out.push({
          navIdx,
          where: `Dashboard › ${pr.code} ${pr.name}`,
          snippet: `${pr.tagline} ${pr.measures}`,
          hay: [pr.code, pr.name, pr.tagline, pr.measures, ...pr.dashboards].join(" ").toLowerCase(),
        }),
      );
      DASHBOARD_CONFIG_GROUPS.forEach((g) =>
        g.rules.forEach((rule) =>
          out.push({
            navIdx,
            where: `Dashboard › ${g.category}`,
            snippet: rule,
            hay: `${g.category} ${rule}`.toLowerCase(),
          }),
        ),
      );
    }
  });
  return out;
})();

/**
 * The (?) help affordance in the top bar — a browsable manual across every
 * rules section plus the Bulk / Dashboard appendices, with a global search.
 * Shown on pages with registered rules and on Home.
 */
export function BusinessRulesTrigger() {
  const { pathname } = useLocation();
  const found = rulesForPath(pathname);
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [pageKey, setPageKey] = useState<string>("");
  const [query, setQuery] = useState("");

  if (!found && !isHome) return null;

  const entry = NAV[idx] ?? NAV[0];
  const goEntry = (next: number) => {
    setIdx((next + NAV.length) % NAV.length);
    setPageKey("");
    setQuery("");
  };
  const goHit = (h: SearchHit) => {
    setIdx(h.navIdx);
    setPageKey(h.pageKey ?? "");
    setQuery("");
  };

  const openModal = () => {
    const startIdx = found
      ? NAV.findIndex((e) => e.kind === "section" && e.key === found.section.section)
      : 0;
    setIdx(startIdx >= 0 ? startIdx : 0);
    setPageKey(found ? found.activePageKey : "");
    setQuery("");
    setOpen(true);
  };

  const section = entry.kind === "section" ? sectionByName(entry.key) : undefined;
  const page = section ? (section.pages.find((p) => p.key === pageKey) ?? section.pages[0]) : undefined;

  const q = query.trim().toLowerCase();
  const results = q ? SEARCH_INDEX.filter((h) => h.hay.includes(q)).slice(0, 60) : [];

  return (
    <>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={openModal}
              aria-label="Manual and business rules"
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <HelpCircle className="h-4.5 w-4.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Manual &amp; business rules</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 space-y-3 border-b border-border px-6 py-5">
            <div className="pr-7">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5 text-[var(--sidebar-active-fg)]" />
                {query ? "Search the manual" : titleFor(entry)}
              </DialogTitle>
            </div>

            {/* Controls: search + section navigator */}
            <div className="flex items-center gap-2">
              <div className="relative min-w-[160px] flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search all manuals & rules"
                  className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => goEntry(idx - 1)}
                  aria-label="Previous section"
                  className="grid h-8 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-secondary"
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
                        className={cn(!query && entry.key === e.key && "bg-secondary font-medium")}
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
                        className={cn(!query && entry.key === e.key && "bg-secondary font-medium")}
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
                  className="grid h-8 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {query ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query.trim()}”` : introFor(entry)}
            </p>
          </DialogHeader>

          {/* Body: search results, appendix, or section rules */}
          {query ? (
            <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-6 py-4">
              {results.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">No matches found.</p>
              ) : (
                results.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goHit(h)}
                    className="block w-full rounded-lg border border-border bg-card p-3 text-left hover:border-[var(--sidebar-active-fg)]/40 hover:bg-secondary/40"
                  >
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-[var(--sidebar-active-fg)]">
                      {h.where}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-foreground/90">{h.snippet}</span>
                  </button>
                ))
              )}
            </div>
          ) : entry.kind === "appendix" ? (
            entry.key === "bulk" ? (
              <BulkMethodsCatalogue />
            ) : (
              <DashboardGuideContent />
            )
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
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
