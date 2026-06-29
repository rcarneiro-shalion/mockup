import { useState } from "react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { FilterBar, TableShell, Th, Td, Pagination, SortTh, useSort, sortRows, usePagination } from "@/components/seeds/ListPrimitives";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { toast } from "sonner";
import { Plus, Calendar } from "lucide-react";
import { FilterChip } from "@/components/seeds/FilterChip";

export type SettingsColumn<T> = {
  key: string;
  label: string;
  sortValue?: (r: T) => string | number;
  cell: (r: T) => ReactNode;
};

/** Presentational settings datagrid. The parent route owns `rows` so add/edit/delete stay in sync. */
export function SettingsList<T extends { id: string }>({
  title,
  newLabel,
  onNew,
  searchPlaceholder,
  searchText,
  entityLabel,
  columns,
  rows,
  onDelete,
  onEdit,
  extra,
  headerActions,
}: {
  title: string;
  newLabel: string;
  onNew?: () => void;
  searchPlaceholder: string;
  searchText: (r: T) => string;
  entityLabel: string;
  columns: SettingsColumn<T>[];
  rows: T[];
  onDelete: (id: string) => void;
  /** When provided, the row "⋮" menu shows an Edit action that opens the row. */
  onEdit?: (r: T) => void;
  extra?: ReactNode;
  /** Extra controls rendered in the header, before the New button. */
  headerActions?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const sort = useSort(`settings:${title}`);

  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) => !q || searchText(r).toLowerCase().includes(q));
  const accessors: Record<string, (r: T) => unknown> = {};
  for (const c of columns) if (c.sortValue) accessors[c.key] = c.sortValue;
  const visible = sortRows(filtered, sort, accessors);
  const pg = usePagination(visible.length, query);

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">{title}</h1>
          <div className="flex items-center gap-2">
            {headerActions}
            <Button size="sm" className="h-8 gap-1.5" onClick={onNew ?? (() => toast.info(`${newLabel} — coming soon`))}>
              <Plus className="h-4 w-4" />
              {newLabel}
            </Button>
          </div>
        </div>
        <FilterBar search={searchPlaceholder} searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              {columns.map((c) =>
                c.sortValue ? (
                  <SortTh key={c.key} label={c.label} sortKey={c.key} sort={sort} />
                ) : (
                  <Th key={c.key}>{c.label}</Th>
                ),
              )}
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <Td className="text-muted-foreground"><span className="block py-2">No {entityLabel}s yet.</span></Td>
                {columns.slice(1).map((c) => <Td key={c.key} />)}
                <Td />
              </tr>
            )}
            {pg.slice(visible).map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                {columns.map((c) => <Td key={c.key}>{c.cell(r)}</Td>)}
                <Td>
                  <RowActionsMenu id={r.id} entityLabel={entityLabel} onDelete={() => onDelete(r.id)} onEdit={onEdit ? () => onEdit(r) : undefined} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={visible.length} page={pg.page} pageSize={pg.pageSize} onPageChange={pg.setPage} onPageSizeChange={pg.setPageSize} />
      </div>
      {extra}
    </AppShell>
  );
}
