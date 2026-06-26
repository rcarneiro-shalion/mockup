import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import {
  ScrappingOptionDialog,
  type ScrappingOptionValues,
} from "@/components/seeds/ScrappingOptionDialog";
import { SCRAPPING_OPTIONS_KEY, INITIAL_SCRAPPING_OPTIONS } from "@/lib/scrappingOptions";
import {
  PageHeader,
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  Pill,
  GroupedPills,
  SortTh,
  useSort,
  sortRows,
  usePagination,
  parseListDate,
  distinct,
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { getSubscriptions } from "@/lib/subscriptions";
import { nowStamp } from "@/lib/clients";
import { Calendar, Layers, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/seeds-api/scrapping-options")({
  // `?edit=<name>` deep-links straight into a scrapping option's edit dialog
  // (options are keyed by name). Used by the Value Stream Map cards.
  validateSearch: (search: Record<string, unknown>): { edit?: string } => ({
    edit: typeof search.edit === "string" ? search.edit : undefined,
  }),
  head: () => ({ meta: [{ title: "Scraping options — Shalion" }] }),
  component: ScrappingOptionsPage,
});

function summaryPills(r: ScrappingOptionValues) {
  const pills: { label: string; tone: "blue" | "amber" }[] = [];
  if (r.multivariants) pills.push({ label: "Multivariants", tone: "blue" });
  if (r.pagination) pills.push({ label: `max_page ${r.maxPage || "—"}`, tone: "blue" });
  if (r.limitedDiscovery) pills.push({ label: `max_rank ${r.maxRank || "—"}`, tone: "blue" });
  if (r.modalities) for (const m of r.modalityValues ?? []) pills.push({ label: m, tone: "amber" });
  if (r.sorting) pills.push({ label: `?sort=${r.sort}`, tone: "amber" });
  return pills;
}

function ScrappingOptionsPage() {
  const [rows, setRows] = usePersistentState<ScrappingOptionValues[]>(
    SCRAPPING_OPTIONS_KEY,
    INITIAL_SCRAPPING_OPTIONS,
  );
  const [selected, setSelected] = useState<ScrappingOptionValues | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [fExtraction, setFExtraction] = useState<string[]>([]);
  const [fSub, setFSub] = useState<string[]>([]);
  const [fJoints, setFJoints] = useState<string[]>([]);
  const [fDisjoints, setFDisjoints] = useState<string[]>([]);
  const sort = useSort("scrapping-options", "updatedAt", "desc");
  const navigate = useNavigate();

  // Open the edit dialog when arriving with ?edit=<name>, then strip the param.
  const { edit } = Route.useSearch();
  useEffect(() => {
    if (!edit) return;
    const match = rows.find((r) => r.name === edit);
    if (match) setSelected(match);
    navigate({ to: "/seeds-api/scrapping-options", search: {}, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  // Indirect relationship: a subscription references its scrapping option by name
  // (Subscription.scrappingOption). Build the inverse — option name → subscription
  // name(s) — for the column, plus the set of option names covered by the selected
  // subscriptions for the filter.
  const allSubs = getSubscriptions();
  const subsByOption = new Map<string, string[]>();
  for (const s of allSubs) {
    const opt = s.scrappingOption;
    if (!opt) continue;
    const arr = subsByOption.get(opt);
    if (arr) arr.push(s.name);
    else subsByOption.set(opt, [s.name]);
  }
  const optionNamesForSelectedSubs = new Set(
    allSubs.filter((s) => fSub.includes(s.name)).map((s) => s.scrappingOption).filter(Boolean),
  );

  // Joints (conjuntos) and Disjoints (disjuntos) are each a theme with sub-items;
  // the filters select sub-items and a row matches if it has any selected one on.
  const jointFlags = (r: ScrappingOptionValues): Record<string, boolean> => ({
    Multivariants: r.multivariants,
    Pagination: r.pagination,
    "Limited discovery": r.limitedDiscovery,
  });
  const disjointFlags = (r: ScrappingOptionValues): Record<string, boolean> => ({
    Modalities: r.modalities,
    Sorting: r.sorting,
  });

  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) =>
    (!q || r.name.toLowerCase().includes(q)) &&
    (!fExtraction.length || fExtraction.includes(r.extractionType)) &&
    (!fSub.length || optionNamesForSelectedSubs.has(r.name)) &&
    (!fJoints.length || fJoints.some((j) => jointFlags(r)[j])) &&
    (!fDisjoints.length || fDisjoints.some((d) => disjointFlags(r)[d])),
  );
  const sorted = sortRows(filtered, sort, {
    options: (r) => summaryPills(r).length,
    subscriptions: (r) => (subsByOption.get(r.name) ?? []).join(", "),
    createdAt: (r) => parseListDate(r.createdAt),
    updatedAt: (r) => parseListDate(r.updatedAt),
  });
  const pg = usePagination(sorted.length, query);

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Scraping options"
          action={{ label: "Add scraping option", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by Scraping option name" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Extraction types" icon={PlayCircle} options={distinct(rows, (r) => r.extractionType)} value={fExtraction} onChange={setFExtraction} />
          <FilterChip label="Subscriptions" icon={Layers} options={allSubs.map((s) => s.name)} value={fSub} onChange={setFSub} searchable />
          <FilterChip label="Joints" options={["Multivariants", "Pagination", "Limited discovery"]} value={fJoints} onChange={setFJoints} />
          <FilterChip label="Disjoints" options={["Modalities", "Sorting"]} value={fDisjoints} onChange={setFDisjoints} />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Extraction type" sortKey="extractionType" sort={sort} />
              <SortTh label="Frequency" sortKey="frequency" sort={sort} />
              <SortTh label="Options" sortKey="options" sort={sort} />
              <SortTh label="Subscriptions" sortKey="subscriptions" sort={sort} />
              <SortTh label="Created at" sortKey="createdAt" sort={sort} />
              <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {pg.slice(sorted).map((r, i) => {
              const subNames = subsByOption.get(r.name) ?? [];
              return (
              <tr key={i} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.name}</LinkText></Td>
                <Td><Pill tone="slate">{r.extractionType}</Pill></Td>
                <Td>{r.frequency ? <Pill tone="slate">{r.frequency === "Custom" ? `Custom · ${r.customDays || "?"}d · ${r.customTimesPerDay || "1x"}` : r.frequency}</Pill> : <span className="text-muted-foreground">—</span>}</Td>
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
                <Td><GroupedPills items={subNames} noun="subscription" tone="slate" /></Td>
                <Td className="whitespace-nowrap text-muted-foreground">{r.createdAt || "—"}</Td>
                <Td className="whitespace-nowrap text-muted-foreground">{r.updatedAt || "—"}</Td>
                <Td><Switch defaultChecked={r.status === "Active"} /></Td>
                <Td>
                  <RowActionsMenu
                    id={r.name}
                    onDelete={() => setRows((prev) => prev.filter((x) => x !== r))}
                    entityLabel="scraping option"
                  />
                </Td>
              </tr>
              );
            })}
          </tbody>
        </TableShell>
        <Pagination total={sorted.length} page={pg.page} pageSize={pg.pageSize} onPageChange={pg.setPage} onPageSizeChange={pg.setPageSize} />
      </div>

      <ScrappingOptionDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        mode="add"
        initial={null}
        onSave={(values) => setRows((prev) => [...prev, { ...values, createdAt: nowStamp(), updatedAt: nowStamp() }])}
      />

      <ScrappingOptionDialog
        open={selected !== null}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        mode="edit"
        initial={selected}
        onSave={(values) => {
          setRows((prev) => prev.map((r) => (r === selected ? { ...values, updatedAt: nowStamp() } : r)));
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
