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
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { Calendar, MoreVertical, ArrowUp, Store, PlayCircle } from "lucide-react";

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
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Scrapping options"
          action={{ label: "Add scrapping option", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by Scrapping option name">
          <FilterChip label="Stores" icon={Store} />
          <FilterChip label="Extraction types" icon={PlayCircle} />
          <FilterChip label="Joints" />
          <FilterChip label="Disjoints" />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <Th>
                <span className="inline-flex items-center gap-1">
                  Name <ArrowUp className="h-3 w-3" />
                </span>
              </Th>
              <Th>Extraction type</Th>
              <Th>Stores</Th>
              <Th>Options</Th>
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelectedIdx(i)}>{r.name}</LinkText></Td>
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
                  <button className="rounded p-1 text-muted-foreground hover:bg-secondary">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={rows.length} />
      </div>

      <ScrappingOptionDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        mode="add"
        initial={null}
        onSave={(values) => setRows((prev) => [...prev, values])}
      />

      <ScrappingOptionDialog
        open={selectedIdx !== null}
        onOpenChange={(v) => { if (!v) setSelectedIdx(null); }}
        mode="edit"
        initial={selectedIdx !== null ? rows[selectedIdx] : null}
        onSave={(values) => {
          setRows((prev) => prev.map((r, i) => (i === selectedIdx ? values : r)));
          setSelectedIdx(null);
        }}
        onDelete={() => {
          setRows((prev) => prev.filter((_, i) => i !== selectedIdx));
          setSelectedIdx(null);
        }}
      />
    </AppShell>
  );
}
