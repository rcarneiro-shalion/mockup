import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import {
  FilterBar,
  TableShell,
  Th,
  Td,
  LinkText,
  SortTh,
  useSort,
  sortRows,
} from "@/components/seeds/ListPrimitives";
import { FilterChip } from "@/components/seeds/FilterChip";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { Plus, ChevronLeft, ChevronRight, TriangleAlert, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type ApproxColumn = { label: string; key: string };
export type ApproxRow = { id: string } & Record<string, string | number | boolean>;
export type FieldSpec = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "date" | "select";
  required?: boolean;
  options?: string[];
};
export type ApproxSpec = {
  key: string;
  title: string;
  addLabel: string;
  search: string;
  filters: string[];
  total: number;
  columns: ApproxColumn[];
  rows: ApproxRow[];
  /** Editable form fields — when present the list rows link to an edit page. */
  fields?: FieldSpec[];
  /** Optional amber notice (e.g. deprecation) rendered above the list. */
  notice?: string;
  /** Per-entity label used by the row delete confirmation. */
  entityLabel?: string;
};

function fmtCell(v: unknown): string {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (v === "" || v === null || v === undefined) return "-";
  return String(v);
}

/**
 * Generic, data-driven listing for the prototype's "approximated" pages. Each
 * entity provides a spec (columns + seed rows mined from its service repo); the
 * page renders a believable grid with search, display-only filter chips, sort,
 * per-row actions and a console-style paginator. These are approximations —
 * Add and row clicks are stubs ("coming soon").
 */
export function EntityListPage({ spec, editBase }: { spec: ApproxSpec; editBase?: string }) {
  const [rows, setRows] = usePersistentState<ApproxRow[]>(`approx:${spec.key}:v1`, spec.rows);
  const [q, setQ] = useState("");
  const sort = useSort();
  const navigate = useNavigate();
  // Dynamic, registry-driven paths: the typed router can't know them statically.
  const go = (to: string) => navigate({ to } as never);

  const ql = q.trim().toLowerCase();
  const filtered = ql
    ? rows.filter((r) => spec.columns.some((c) => fmtCell(r[c.key]).toLowerCase().includes(ql)))
    : rows;
  const sorted = sortRows(filtered, sort);
  const pages = Math.max(1, Math.ceil(spec.total / 100));

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">{spec.title}</h1>
          {spec.addLabel ? (
            <Button
              size="sm"
              className="h-8 gap-1.5"
              onClick={() =>
                editBase ? go(`${editBase}/new`) : toast.info(`${spec.addLabel} — coming soon`)
              }
            >
              <Plus className="h-4 w-4" /> {spec.addLabel}
            </Button>
          ) : null}
        </div>

        {spec.notice ? (
          <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <span className="leading-relaxed">{spec.notice}</span>
          </div>
        ) : null}

        <FilterBar search={spec.search} searchValue={q} onSearchChange={setQ}>
          {spec.filters.map((f) => (
            <FilterChip key={f} label={f} />
          ))}
        </FilterBar>

        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              {spec.columns.map((c) => (
                <SortTh key={c.key} label={c.label} sortKey={c.key} sort={sort} />
              ))}
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                {spec.columns.map((c, i) => {
                  const isImage = /image/i.test(c.key) && i === 0;
                  const content = isImage ? (
                    <span className="grid h-9 w-9 place-items-center rounded border border-border bg-secondary/60 text-muted-foreground">
                      <ImageIcon className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="block max-w-[240px] truncate" title={fmtCell(r[c.key])}>
                      {fmtCell(r[c.key])}
                    </span>
                  );
                  return (
                    <Td
                      key={c.key}
                      className={i === 0 ? "font-medium text-foreground" : "text-foreground/80"}
                    >
                      {i === 0 && editBase ? (
                        <LinkText onClick={() => go(`${editBase}/${r.id}`)}>{content}</LinkText>
                      ) : (
                        content
                      )}
                    </Td>
                  );
                })}
                <Td>
                  <RowActionsMenu
                    id={r.id}
                    entityLabel={spec.entityLabel ?? spec.title.toLowerCase()}
                    onDelete={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>

        <div className="flex items-center justify-end gap-5 border-t border-border px-6 py-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            Rows per page:
            <span className="rounded border border-border px-2 py-0.5 text-foreground">100</span>
          </span>
          <span>
            1–{Math.min(sorted.length, 100)} of {spec.total.toLocaleString("en-US")}
          </span>
          <div className="flex items-center gap-1">
            <button className="rounded p-1 hover:bg-secondary" aria-label="Previous">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3, 4, 5]
              .filter((n) => n <= pages)
              .map((n) => (
                <span
                  key={n}
                  className={cn(
                    "grid h-6 min-w-6 place-items-center rounded px-1 text-xs",
                    n === 1
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:bg-secondary",
                  )}
                >
                  {n}
                </span>
              ))}
            {pages > 6 && <span className="px-1">…</span>}
            {pages > 5 && (
              <span className="grid h-6 min-w-6 place-items-center rounded px-1 text-xs text-muted-foreground">
                {pages}
              </span>
            )}
            <button className="rounded p-1 hover:bg-secondary" aria-label="Next">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
