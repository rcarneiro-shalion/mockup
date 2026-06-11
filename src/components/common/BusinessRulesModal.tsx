import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { rulesForPath } from "@/lib/businessRules";
import { cn } from "@/lib/utils";

/**
 * The (?) help affordance shown in the top bar. It only appears on pages that
 * have business rules registered (src/lib/businessRules.ts). Clicking opens a
 * modal that summarises the section's rules, divided page by page.
 */
export function BusinessRulesTrigger() {
  const { pathname } = useLocation();
  const found = rulesForPath(pathname);
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string>("");

  if (!found) return null;
  const { section, activePageKey } = found;
  const currentKey = activeKey || activePageKey;
  const page = section.pages.find((p) => p.key === currentKey) ?? section.pages[0];

  return (
    <>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => {
                setActiveKey(activePageKey);
                setOpen(true);
              }}
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
            <DialogTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-[var(--sidebar-active-fg)]" />
              {section.section} — business rules
            </DialogTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">{section.intro}</p>
          </DialogHeader>

          {/* Page selector */}
          <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-border px-6 py-3">
            {section.pages.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setActiveKey(p.key)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  p.key === currentKey
                    ? "border-[var(--sidebar-active-fg)] bg-[var(--sidebar-active)] font-medium text-[var(--sidebar-active-fg)]"
                    : "border-border text-foreground/70 hover:bg-secondary",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Rules for the selected page — scrolls vertically when long */}
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {page.groups.map((g) => (
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
        </DialogContent>
      </Dialog>
    </>
  );
}
