import { useEffect, useState, type ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Distinct, sorted, non-empty values for a column — used to populate filter dropdowns. */
export function distinct<T>(rows: T[], get: (r: T) => string | undefined | null): string[] {
  const set = new Set<string>();
  for (const r of rows) {
    const v = get(r);
    if (v) set.add(v);
  }
  return [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

// ---- Sorting ----------------------------------------------------------------

export type SortState = { key: string | null; dir: "asc" | "desc"; toggle: (k: string) => void };

/** Click-to-sort state: first click on a column sorts asc, next toggles desc.
 *  Pass `persistKey` to remember the chosen column + direction across navigation
 *  and reloads (localStorage, keyed per table). Omit it for ephemeral sorting. */
export function useSort(persistKey?: string, initialKey: string | null = null, initialDir: "asc" | "desc" = "asc"): SortState {
  const storageKey = persistKey ? `pref:sort:${persistKey}` : null;
  const [state, setState] = useState<{ key: string | null; dir: "asc" | "desc" }>(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const p = JSON.parse(raw) as { key: string | null; dir: "asc" | "desc" };
          // Only restore a real, user-picked column. A persisted null key is just the
          // stale initial default from a first render — it must not override a newly
          // introduced initialKey/initialDir default (e.g. "updated desc").
          if (p && typeof p.key === "string" && (p.dir === "asc" || p.dir === "desc")) return p;
        }
      } catch { /* ignore */ }
    }
    return { key: initialKey, dir: initialDir };
  });
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* ignore */ }
  }, [storageKey, state]);
  const toggle = (k: string) =>
    setState((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
  return { key: state.key, dir: state.dir, toggle };
}

function sortValue(v: unknown): string | number {
  if (Array.isArray(v)) return v.length;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "number") return v;
  return (v ?? "") as string;
}

/** Parse the app's date strings into a sortable epoch-ms. Handles both the ISO-ish
 *  stamp from nowStamp() ("2026-06-19, 14:30:05") and the human format seeded in the
 *  data ("Mon, Oct 27, 2025 2:00"). Returns 0 for blank/"-"/unparseable values so
 *  they sort last under a desc sort. Use as a sortRows accessor for date columns —
 *  the default lexical compare would order weekday-prefixed strings wrongly. */
export function parseListDate(s: unknown): number {
  if (typeof s !== "string") return 0;
  const str = s.trim();
  if (!str || str === "-") return 0;
  const iso = str.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ ,T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (iso) {
    const [, y, mo, d, h = "0", mi = "0", se = "0"] = iso;
    return new Date(+y, +mo - 1, +d, +h, +mi, +se).getTime();
  }
  // Human format — drop a leading weekday ("Mon, ") so Date.parse is reliable.
  const t = Date.parse(str.replace(/^[A-Za-z]{3,}\.?,\s*/, ""));
  return Number.isNaN(t) ? 0 : t;
}

/** Returns a sorted copy of rows per the sort state. `accessors` overrides the
 *  default `row[key]` lookup for derived columns. */
export function sortRows<T>(rows: T[], sort: SortState, accessors?: Record<string, (row: T) => unknown>): T[] {
  if (!sort.key) return rows;
  const key = sort.key;
  const acc = accessors?.[key] ?? ((row: T) => (row as Record<string, unknown>)[key]);
  const out = [...rows].sort((a, b) => {
    const x = sortValue(acc(a));
    const y = sortValue(acc(b));
    if (typeof x === "number" && typeof y === "number") return x - y;
    return String(x).localeCompare(String(y), undefined, { numeric: true });
  });
  return sort.dir === "desc" ? out.reverse() : out;
}

/** Clickable, sortable table header cell. */
export function SortTh({
  label,
  sortKey,
  sort,
  className,
}: {
  label: ReactNode;
  sortKey: string;
  sort: SortState;
  className?: string;
}) {
  const active = sort.key === sortKey;
  return (
    <th
      onClick={() => sort.toggle(sortKey)}
      className={cn(
        "cursor-pointer select-none px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-foreground/70 transition-colors hover:text-foreground",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          sort.dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        ) : (
          <ChevronsUpDown className="h-3 w-3 opacity-40" />
        )}
      </span>
    </th>
  );
}

export function PageHeader({
  title,
  trailing,
  action,
  actionSlot,
}: {
  title: string;
  trailing?: ReactNode;
  action?: { label: string; disabled?: boolean; onClick?: () => void };
  /** Custom right-side content; takes precedence over `action` (e.g. a menu button). */
  actionSlot?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-6 pt-5">
      <div className="flex items-center gap-3">
        <h1 className="text-[17px] font-semibold text-foreground">{title}</h1>
        {trailing}
      </div>
      {actionSlot ? (
        actionSlot
      ) : action ? (
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
  searchValue,
  onSearchChange,
  children,
}: {
  search?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-6 py-4">
      {search ? (
        <div className="relative min-w-[280px] flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder={search}
            value={onSearchChange ? searchValue ?? "" : undefined}
            onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
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

type PillTone = "violet" | "amber" | "blue" | "slate" | "red" | "green" | "orange" | "violetOutline";

const toneClass: Record<PillTone, string> = {
  violet: "bg-violet-100 text-violet-700",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-sky-100 text-sky-700",
  slate: "bg-slate-100 text-slate-700",
  red: "border border-rose-200 bg-rose-50 text-rose-700",
  green: "bg-emerald-100 text-emerald-700",
  orange: "bg-orange-100 text-orange-800",
  violetOutline: "border border-violet-200 bg-violet-100 text-violet-800",
};

export function Pill({
  children,
  tone = "slate",
  className,
  title,
}: {
  children: ReactNode;
  tone?: PillTone;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
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
