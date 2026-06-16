import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import {
  SEEDS_KEY,
  INITIAL_SEEDS,
  KEYWORD_TYPE_OPTIONS,
  SEED_STATUS_OPTIONS,
  type Seed,
} from "@/lib/seeds";
import { PAGE_TYPE_OPTIONS } from "@/lib/seedOptions";
import {
  PageHeader,
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  Pill,
  SortTh,
  useSort,
  sortRows,
  distinct,
} from "@/components/seeds/ListPrimitives";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Calendar, Store } from "lucide-react";

const SEED_TYPE_FILTER_OPTIONS = ["All", "URL", "API", "KEYWORD"];

export const Route = createFileRoute("/seeds-api/seeds/")({
  head: () => ({ meta: [{ title: "Seeds — Shalion" }] }),
  component: SeedsPage,
});

const dash = <span className="text-muted-foreground">—</span>;

function StatusCell({ status }: { status?: Seed["status"] }) {
  const active = (status ?? "Active") !== "Inactive";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80">
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-slate-400")} />
      {status ?? "Active"}
    </span>
  );
}

type Col = { key: string; label: ReactNode; sortKey?: string; cell: (r: Seed) => ReactNode };

function SeedsPage() {
  const [rows, setRows] = usePersistentState<Seed[]>(SEEDS_KEY, INITIAL_SEEDS);
  const [seedType, setSeedType] = useState("All");
  const [query, setQuery] = useState("");
  const [fValue, setFValue] = useState<string[]>([]);
  const [fStore, setFStore] = useState<string[]>([]);
  const [fCat, setFCat] = useState<string[]>([]);
  const [fPageType, setFPageType] = useState<string[]>([]);
  const [fKwType, setFKwType] = useState<string[]>([]);
  const [fStatus, setFStatus] = useState<string[]>([]);
  const sort = useSort("seeds");
  const navigate = useNavigate();

  // Switching the seed type resets the type-specific filters.
  const changeSeedType = (t: string) => {
    setSeedType(t);
    setFValue([]);
    setFPageType([]);
    setFKwType([]);
  };

  const goEdit = (r: Seed) => navigate({ to: "/seeds-api/seeds/$seedId", params: { seedId: r.id } });

  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) =>
    (seedType === "All" || (r.type ?? "") === seedType) &&
    (!q || r.d.toLowerCase().includes(q) || (r.value ?? "").toLowerCase().includes(q)) &&
    (!fValue.length || fValue.includes(r.value ?? "")) &&
    (!fStore.length || fStore.includes(r.store)) &&
    (!fCat.length || fCat.includes(r.cat)) &&
    (!fPageType.length || fPageType.includes(r.pageType ?? "")) &&
    (!fKwType.length || fKwType.includes(r.keywordType ?? "")) &&
    (!fStatus.length || fStatus.includes(r.status ?? "Active")),
  );

  // Searchable value filter — its label + options follow the selected seed type.
  const valueFilterLabel =
    seedType === "URL" ? "Url" : seedType === "API" ? "Api origin" : seedType === "KEYWORD" ? "Keyword" : "Value";
  const valueOptions = distinct(
    rows.filter((r) => seedType === "All" || (r.type ?? "") === seedType),
    (r) => r.value ?? "",
  ).filter(Boolean);
  const visible = sortRows(filtered, sort, {
    description: (r) => r.d,
    value: (r) => r.value ?? "",
    keywordType: (r) => r.keywordType ?? "",
    pageType: (r) => r.pageType ?? "",
    type: (r) => r.type ?? "",
    store: (r) => r.store,
    category: (r) => r.cat,
    status: (r) => r.status ?? "Active",
    createdAt: (r) => r.c,
    updatedAt: (r) => r.u,
  });

  const valueLabel =
    seedType === "URL" ? "Url" : seedType === "API" ? "Api origin" : seedType === "KEYWORD" ? "Keyword" : "Value";

  const showKwType = seedType === "KEYWORD" || seedType === "All";
  const showPageType = seedType === "URL" || seedType === "API" || seedType === "All";

  // In "All" every variant column is shown and each cell renders only the field
  // relevant to that row's seed type ("—" otherwise). Single-type views keep just
  // their own fields.
  const cols: Col[] = [
    { key: "d", label: "Description", sortKey: "description", cell: (r) => <LinkText onClick={() => goEdit(r)}>{r.d}</LinkText> },
  ];
  if (seedType === "All") {
    cols.push({
      key: "type",
      label: "Seed type",
      sortKey: "type",
      cell: (r) => (r.type ? <Pill tone="blue">{r.type}</Pill> : dash),
    });
  }
  cols.push({
    key: "value",
    label: valueLabel,
    sortKey: "value",
    cell: (r) =>
      r.value ? (
        <span className="block max-w-[280px] truncate text-foreground/80" title={r.value}>{r.value}</span>
      ) : (
        dash
      ),
  });
  if (showKwType) {
    cols.push({
      key: "kwt",
      label: "Keyword type",
      sortKey: "keywordType",
      cell: (r) => (r.keywordType ? <Pill tone={r.keywordType === "BRANDED" ? "violet" : "slate"}>{r.keywordType}</Pill> : dash),
    });
  }
  if (showPageType) {
    cols.push({
      key: "pt",
      label: "Page type",
      sortKey: "pageType",
      cell: (r) => (r.pageType ? <Pill tone="slate">{r.pageType}</Pill> : dash),
    });
  }
  cols.push({ key: "store", label: "Store", sortKey: "store", cell: (r) => <LinkText>{r.store}</LinkText> });
  cols.push({ key: "cat", label: "Category", sortKey: "category", cell: (r) => <span className="text-foreground/80">{r.cat}</span> });
  cols.push({ key: "c", label: "Created at", sortKey: "createdAt", cell: (r) => <span className="text-muted-foreground">{r.c}</span> });
  cols.push({ key: "u", label: "Updated at", sortKey: "updatedAt", cell: (r) => <span className="text-muted-foreground">{r.u}</span> });
  cols.push({ key: "status", label: "Status", sortKey: "status", cell: (r) => <StatusCell status={r.status} /> });

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Seeds"
          trailing={
            <Select value={seedType} onValueChange={changeSeedType}>
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEED_TYPE_FILTER_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          action={{
            label: "Add seed",
            disabled: seedType === "All",
            onClick: () =>
              navigate({ to: "/seeds-api/seeds/new", search: { type: seedType as "URL" | "API" | "KEYWORD" } }),
          }}
        />
        <FilterBar search="Search by Seed description" searchValue={query} onSearchChange={setQuery}>
          <FilterChip
            label={valueFilterLabel}
            options={valueOptions}
            value={fValue}
            onChange={setFValue}
            searchable
            getLabel={(v) => (v.length > 48 ? v.slice(0, 48) + "…" : v)}
          />
          <FilterChip label="Stores" icon={Store} options={distinct(rows, (r) => r.store)} value={fStore} onChange={setFStore} />
          <FilterChip label="Categories" options={distinct(rows, (r) => r.cat)} value={fCat} onChange={setFCat} />
          {seedType !== "KEYWORD" && (
            <FilterChip label="Page types" options={PAGE_TYPE_OPTIONS} value={fPageType} onChange={setFPageType} />
          )}
          {(seedType === "KEYWORD" || seedType === "All") && (
            <FilterChip label="Keyword type" options={KEYWORD_TYPE_OPTIONS} value={fKwType} onChange={setFKwType} />
          )}
          <FilterChip label="Status" options={SEED_STATUS_OPTIONS} value={fStatus} onChange={setFStatus} />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              {cols.map((c) =>
                c.sortKey ? (
                  <SortTh key={c.key} label={c.label} sortKey={c.sortKey} sort={sort} />
                ) : (
                  <Th key={c.key}>{c.label}</Th>
                ),
              )}
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                {cols.map((c) => (
                  <Td key={c.key}>{c.cell(r)}</Td>
                ))}
                <Td>
                  <RowActionsMenu
                    id={r.id}
                    onDelete={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                    entityLabel="seed"
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={visible.length} />
      </div>
    </AppShell>
  );
}
