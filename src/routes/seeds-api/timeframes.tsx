import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { EditRecordDialog, type FieldDef } from "@/components/seeds/EditRecordDialog";
import { AddRecordDialog, type AddFieldDef } from "@/components/seeds/AddRecordDialog";
import { SEED_FREQUENCY_OPTIONS, LOCATION_FREQUENCY_OPTIONS } from "@/lib/seedOptions";
import {
  PageHeader,
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  UserCell,
  Pill,
  SortTh,
  useSort,
  sortRows,
  distinct,
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { Calendar, MoreVertical, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/seeds-api/timeframes")({
  head: () => ({ meta: [{ title: "Timeframes — Shalion" }] }),
  component: TimeframesPage,
});

type Row = {
  name: string;
  locFreq: string;
  seedFreq: string;
  group: string;
  product: string;
};

const INITIAL_ROWS: Row[] = [
  {
    name: "Dummy timeframe bc425bf...",
    locFreq: "NO_ROTATE_DAILY",
    seedFreq: "ROTATE_WEEKLY",
    group: "group-123",
    product: "product-123",
  },
];

function TimeframesPage() {
  const [rows, setRows] = usePersistentState<Row[]>("seeds-api:timeframes", INITIAL_ROWS);
  const [selected, setSelected] = useState<Row | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [fLocFreq, setFLocFreq] = useState("");
  const [fSeedFreq, setFSeedFreq] = useState("");
  const [fGroup, setFGroup] = useState("");
  const [fProduct, setFProduct] = useState("");
  const sort = useSort();
  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) =>
    (!q || r.name.toLowerCase().includes(q)) &&
    (!fLocFreq || r.locFreq === fLocFreq) &&
    (!fSeedFreq || r.seedFreq === fSeedFreq) &&
    (!fGroup || r.group === fGroup) &&
    (!fProduct || r.product === fProduct),
  );
  const sorted = sortRows(filtered, sort, { locationFrequency: (r) => r.locFreq, seedFrequency: (r) => r.seedFreq });

  const editFields: FieldDef[] = selected
    ? [
        { kind: "text", label: "Name", value: selected.name, required: true, span: 2 },
        { kind: "select", label: "Location frequency", value: selected.locFreq, required: true, options: LOCATION_FREQUENCY_OPTIONS },
        { kind: "select", label: "Seed frequency", value: selected.seedFreq, required: true, options: SEED_FREQUENCY_OPTIONS },
        { kind: "text", label: "Timeframe group", value: selected.group },
        { kind: "text", label: "Product", value: selected.product },
      ]
    : [];

  const addFields: AddFieldDef[] = [
    { kind: "text", label: "Name", required: true, span: 2 },
    { kind: "select", label: "Location frequency", required: true, options: LOCATION_FREQUENCY_OPTIONS },
    { kind: "select", label: "Seed frequency", required: true, options: SEED_FREQUENCY_OPTIONS },
    { kind: "text", label: "Timeframe group" },
    { kind: "text", label: "Product" },
  ];

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Timeframes"
          action={{ label: "Add timeframe", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by Timeframe name" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Location frequency" options={distinct(rows, (r) => r.locFreq)} value={fLocFreq} onChange={setFLocFreq} />
          <FilterChip label="Seed frequency" options={distinct(rows, (r) => r.seedFreq)} value={fSeedFreq} onChange={setFSeedFreq} />
          <FilterChip label="Jobs" icon={PlayCircle} />
          <FilterChip label="Timeframe group" options={distinct(rows, (r) => r.group)} value={fGroup} onChange={setFGroup} />
          <FilterChip label="Product" options={distinct(rows, (r) => r.product)} value={fProduct} onChange={setFProduct} />
          <FilterChip label="Status" />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Location frequency" sortKey="locationFrequency" sort={sort} />
              <SortTh label="Seed frequency" sortKey="seedFrequency" sort={sort} />
              <SortTh label="Timeframe group" sortKey="group" sort={sort} />
              <SortTh label="Product" sortKey="product" sort={sort} />
              <Th>Created by</Th>
              <Th>Updated by</Th>
              <Th>Cr...</Th>
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.name} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.name}</LinkText></Td>
                <Td><Pill tone="slate">{r.locFreq}</Pill></Td>
                <Td><Pill tone="slate">{r.seedFreq}</Pill></Td>
                <Td className="text-foreground/80">{r.group}</Td>
                <Td className="text-foreground/80">{r.product}</Td>
                <Td><UserCell email="btrainor@s..." /></Td>
                <Td><UserCell email="btrainor@s..." /></Td>
                <Td className="text-muted-foreground">20...</Td>
                <Td><Switch defaultChecked /></Td>
                <Td>
                  <button className="rounded p-1 text-muted-foreground hover:bg-secondary">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={sorted.length} />
      </div>

      <AddRecordDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add new timeframe"
        saveLabel="Add timeframe"
        fields={addFields}
        onSave={(values) => {
          const newRow: Row = {
            name: (values["Name"] as string) || "Untitled",
            locFreq: values["Location frequency"] as string,
            seedFreq: values["Seed frequency"] as string,
            group: values["Timeframe group"] as string,
            product: values["Product"] as string,
          };
          setRows((prev) => [...prev, newRow]);
        }}
      />

      <EditRecordDialog
        open={!!selected}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        title={selected?.name ?? ""}
        saveLabel="Save timeframe"
        fields={editFields}
        onSave={(values) => {
          setRows((prev) =>
            prev.map((r) =>
              r.name === selected!.name
                ? {
                    ...r,
                    name: values["Name"] as string,
                    locFreq: values["Location frequency"] as string,
                    seedFreq: values["Seed frequency"] as string,
                    group: values["Timeframe group"] as string,
                    product: values["Product"] as string,
                  }
                : r,
            ),
          );
          setSelected(null);
        }}
        onDelete={() => {
          setRows((prev) => prev.filter((r) => r.name !== selected!.name));
          setSelected(null);
        }}
      />
    </AppShell>
  );
}
