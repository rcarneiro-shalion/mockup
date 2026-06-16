import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import {
  ScrappingOptionDialog,
  EMPTY_SCRAPPING_OPTION,
  type ScrappingOptionValues,
} from "@/components/seeds/ScrappingOptionDialog";
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
import { Switch } from "@/components/ui/switch";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Calendar, Store, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/seeds-api/scrapping-options")({
  head: () => ({ meta: [{ title: "Scrapping options — Shalion" }] }),
  component: ScrappingOptionsPage,
});

const INITIAL_ROWS: ScrappingOptionValues[] = [
  {
    ...EMPTY_SCRAPPING_OPTION,
    name: "ME_KW_WATER — Amazon US",
    extractionType: "MEDIA",
    stores: ["Amazon US"],
    multivariants: true,
  },
  {
    ...EMPTY_SCRAPPING_OPTION,
    name: "PDP_BEAM_US — Amazon US",
    extractionType: "DIGITAL_SHELF_PDP",
    stores: ["Amazon US"],
    pagination: true,
    maxPage: "10",
    sorting: true,
    sort: "best_seller",
  },
];

function summaryPills(r: ScrappingOptionValues) {
  const pills: { label: string; tone: "blue" | "amber" }[] = [];
  if (r.multivariants) pills.push({ label: "Multivariants", tone: "blue" });
  if (r.pagination) pills.push({ label: `max_page ${r.maxPage || "—"}`, tone: "blue" });
  if (r.limitedDiscovery) pills.push({ label: `max_rank ${r.maxRank || "—"}`, tone: "blue" });
  if (r.modalities) pills.push({ label: r.modality, tone: "amber" });
  if (r.sorting) pills.push({ label: `?sort=${r.sort}`, tone: "amber" });
  return pills;
}

function ScrappingOptionsPage() {
  const [rows, setRows] = usePersistentState<ScrappingOptionValues[]>(
    "seeds-api:scrapping-options",
    INITIAL_ROWS,
  );
  const [selected, setSelected] = useState<ScrappingOptionValues | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [fStore, setFStore] = useState<string[]>([]);
  const [fExtraction, setFExtraction] = useState<string[]>([]);
  const sort = useSort("scrapping-options");

  const q = query.trim().toLowerCase();
  const storeOptions = [...new Set(rows.flatMap((r) => r.stores ?? []))].sort();
  const filtered = rows.filter((r) =>
    (!q || r.name.toLowerCase().includes(q)) &&
    (!fStore.length || (r.stores ?? []).some((s) => fStore.includes(s))) &&
    (!fExtraction.length || fExtraction.includes(r.extractionType)),
  );
  const sorted = sortRows(filtered, sort, {
    stores: (r) => (r.stores ?? []).join(", "),
    options: (r) => summaryPills(r).length,
  });

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Scrapping options"
          action={{ label: "Add scrapping option", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by Scrapping option name" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Stores" icon={Store} options={storeOptions} value={fStore} onChange={setFStore} />
          <FilterChip label="Extraction types" icon={PlayCircle} options={distinct(rows, (r) => r.extractionType)} value={fExtraction} onChange={setFExtraction} />
          <FilterChip label="Joints" />
          <FilterChip label="Disjoints" />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Extraction type" sortKey="extractionType" sort={sort} />
              <SortTh label="Stores" sortKey="stores" sort={sort} />
              <SortTh label="Options" sortKey="options" sort={sort} />
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.name}</LinkText></Td>
                <Td><Pill tone="slate">{r.extractionType}</Pill></Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {(r.stores ?? []).length ? (
                      (r.stores ?? []).map((s) => <Pill key={s} tone="green">{s}</Pill>)
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {summaryPills(r).length ? (
                      summaryPills(r).map((p, j) => (
                        <Pill key={j} tone={p.tone}>{p.label}</Pill>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No options</span>
                    )}
                  </div>
                </Td>
                <Td><Switch defaultChecked={r.status === "Active"} /></Td>
                <Td>
                  <RowActionsMenu
                    id={r.name}
                    onDelete={() => setRows((prev) => prev.filter((x) => x !== r))}
                    entityLabel="scrapping option"
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={sorted.length} />
      </div>

      <ScrappingOptionDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        mode="add"
        initial={null}
        onSave={(values) => setRows((prev) => [...prev, values])}
      />

      <ScrappingOptionDialog
        open={selected !== null}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        mode="edit"
        initial={selected}
        onSave={(values) => {
          setRows((prev) => prev.map((r) => (r === selected ? values : r)));
          setSelected(null);
        }}
        onDelete={() => {
          setRows((prev) => prev.filter((r) => r !== selected));
          setSelected(null);
        }}
      />
    </AppShell>
  );
}
