import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";

/** Decorative "Add label translations" chips (🇪🇸 / 🇧🇷) reused across edit pages. */
export function TranslationChips() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Add label translations</span>
      {["🇪🇸", "🇧🇷"].map((flag) => (
        <button
          key={flag}
          type="button"
          onClick={() => toast.info("Label translations — coming soon")}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-accent"
        >
          <span>{flag}</span>
          <Plus className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
}

export type Crumb = { label: string; onClick?: () => void };

/** "Dashboard applications › App › …" breadcrumb. The last crumb renders muted. */
export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-sm">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-muted-foreground">›</span>}
          {c.onClick ? (
            <button
              onClick={c.onClick}
              className="cursor-pointer text-[var(--sidebar-active-fg)] hover:underline"
            >
              {c.label}
            </button>
          ) : (
            <span className="text-muted-foreground">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** "← {label}" back link. */
export function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </button>
  );
}

/** Standard "Not found" state inside the app shell. */
export function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <AppShell>
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
        <p className="text-sm text-muted-foreground">Not found.</p>
        <Button variant="outline" onClick={onBack}>
          Back to Dashboard applications
        </Button>
      </div>
    </AppShell>
  );
}

/** Field label with optional required asterisk and 🇺🇸 prefix. */
export function FieldLabel({
  children,
  required,
  flag,
}: {
  children: ReactNode;
  required?: boolean;
  flag?: boolean;
}) {
  return (
    <span className="text-sm font-medium text-foreground/80">
      {flag && <span className="mr-1">🇺🇸</span>}
      {children}
      {required && <span className="text-destructive"> *</span>}
    </span>
  );
}
