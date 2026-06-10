import type { ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  trailing,
  action,
}: {
  title: string;
  trailing?: ReactNode;
  action?: { label: string; disabled?: boolean; onClick?: () => void };
}) {
  return (
    <div className="flex items-center justify-between px-6 pt-5">
      <div className="flex items-center gap-3">
        <h1 className="text-[17px] font-semibold text-foreground">{title}</h1>
        {trailing}
      </div>
      {action ? (
        <Button disabled={action.disabled} onClick={action.onClick} size="sm" className="h-8 gap-1.5">
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

export function FilterBar({
  search,
  children,
}: {
  search?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-6 py-4">
      {search ? (
        <div className="relative min-w-[280px] flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder={search}
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-auto px-6 pb-4">
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-foreground/70",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}

export function Pagination({ total, page = 1 }: { total: number; page?: number }) {
  return (
    <div className="flex items-center justify-end gap-4 border-t border-border px-6 py-3 text-sm text-muted-foreground">
      <span>Rows per page: 100</span>
      <span>1–{total} of {total}</span>
      <span className="grid h-6 w-6 place-items-center rounded border border-border bg-secondary text-xs font-medium text-foreground">
        {page}
      </span>
      <div className="flex items-center gap-1">
        <button className="rounded p-1 hover:bg-secondary" aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="rounded p-1 hover:bg-secondary" aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function LinkText({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left text-[var(--sidebar-active-fg)] hover:underline"
    >
      {children}
    </button>
  );
}

export function UserCell({ email = "rcarneiro@..." }: { email?: string }) {
  const letter = email[0]?.toUpperCase() ?? "U";
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-[11px] font-medium text-emerald-700">
        {letter}
      </span>
      <span className="text-foreground/80">{email}</span>
    </div>
  );
}

type PillTone = "violet" | "amber" | "blue" | "slate" | "red" | "green";

const toneClass: Record<PillTone, string> = {
  violet: "bg-violet-100 text-violet-700",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-sky-100 text-sky-700",
  slate: "bg-slate-100 text-slate-700",
  red: "border border-rose-200 bg-rose-50 text-rose-700",
  green: "bg-emerald-100 text-emerald-700",
};

export function Pill({
  children,
  tone = "slate",
  className,
}: {
  children: ReactNode;
  tone?: PillTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function NoBadge() {
  return (
    <Pill tone="red" className="rounded-full px-2 py-0.5">
      <span className="mr-1">✕</span>
      No
    </Pill>
  );
}
