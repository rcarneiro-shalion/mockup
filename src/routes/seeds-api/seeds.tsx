import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { EditRecordDialog, type FieldDef } from "@/components/seeds/EditRecordDialog";
import { AddRecordDialog, type AddFieldDef } from "@/components/seeds/AddRecordDialog";
import { STORE_OPTIONS, CATEGORY_OPTIONS } from "@/lib/seedOptions";
import {
  PageHeader,
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  NoBadge,
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MoreVertical, Store } from "lucide-react";

const SEED_TYPE_FILTER_OPTIONS = ["All", "URL", "API", "KEYWORD"];

export const Route = createFileRoute("/seeds-api/seeds")({
  head: () => ({ meta: [{ title: "Seeds — Shalion" }] }),
  component: SeedsPage,
});

type Row = { d: string; store: string; cat: string; c: string; u: string };

const INITIAL_ROWS: Row[] = [
  { d: "chocolate", store: "Walmart US", cat: "Pantry > Chocolate > Choco...", c: "2025-04-25, 11:11:33", u: "2025-04-25, 11:11:33" },
  { d: "water", store: "Amazon US", cat: "Beverages > Waters > Other", c: "2026-06-08, 16:03:09", u: "2026-06-08, 16:03:09" },
  { d: "coffee", store: "Amazon US", cat: "Pantry > Coffee > Beans", c: "2026-01-30, 13:41:14", u: "2026-01-30, 13:41:14" },
  { d: "Milk", store: "Walmart US", cat: "Pantry > Coffee > Beans", c: "2026-01-30, 13:42:59", u: "2026-06-09, 10:00:00" },
  { d: "sample of keyword", store: "Walmart Mismo Dia MX", cat: "Beauty > Hair Care > Sham...", c: "2026-04-27, 12:43:10", u: "2026-04-27, 12:43:10" },
];

function SeedsPage() {
  const [rows, setRows] = usePersistentState<Row[]>("seeds-api:seeds", INITIAL_ROWS);
  const [selected, setSelected] = useState<Row | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [seedType, setSeedType] = useState("All");

  const editFields: FieldDef[] = selected
    ? [
        { kind: "text", label: "Description", value: selected.d, required: true, span: 2 },
        { kind: "select", label: "Store", value: selected.store, required: true, options: STORE_OPTIONS },
        { kind: "select", label: "Category", value: selected.cat, required: true, options: CATEGORY_OPTIONS },
        { kind: "checkbox", label: "Is QA candidate" },
      ]
    : [];

  const addFields: AddFieldDef[] = [
    { kind: "text", label: "Description", required: true, span: 2 },
    { kind: "select", label: "Store", required: true, options: STORE_OPTIONS },
    { kind: "select", label: "Category", required: true, options: CATEGORY_OPTIONS },
    { kind: "checkbox", label: "Is QA candidate" },
  ];

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Seeds"
          trailing={
            <Select value={seedType} onValueChange={setSeedType}>
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
          action={{ label: "Add seed", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by Seed description">
          <FilterChip label="Ids" />
          <FilterChip label="Stores" icon={Store} />
          <FilterChip label="Store packages" />
          <FilterChip label="Categories" />
          <FilterChip label="Status" />
          <FilterChip label="Is QA candidate" />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <Th>Description</Th>
              <Th>Store</Th>
              <Th>Category</Th>
              <Th>Is QA candidate</Th>
              <Th>Created at</Th>
              <Th>Updated at</Th>
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.d} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.d}</LinkText></Td>
                <Td><LinkText>{r.store}</LinkText></Td>
                <Td className="text-foreground/80">{r.cat}</Td>
                <Td><NoBadge /></Td>
                <Td className="text-muted-foreground">{r.c}</Td>
                <Td className="text-muted-foreground">{r.u}</Td>
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
        <Pagination total={rows.length} />
      </div>

      <AddRecordDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add new seed"
        saveLabel="Add seed"
        fields={addFields}
        onSave={(values) => {
          const now = new Date().toISOString().replace("T", ", ").slice(0, 19);
          const newRow: Row = {
            d: (values["Description"] as string) || "Untitled",
            store: values["Store"] as string,
            cat: values["Category"] as string,
            c: now,
            u: now,
          };
          setRows((prev) => [...prev, newRow]);
        }}
      />

      <EditRecordDialog
        open={!!selected}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        title={selected?.d ?? ""}
        saveLabel="Save seed"
        fields={editFields}
        onSave={(values) => {
          setRows((prev) =>
            prev.map((r) =>
              r.d === selected!.d
                ? {
                    ...r,
                    d: values["Description"] as string,
                    store: values["Store"] as string,
                    cat: values["Category"] as string,
                  }
                : r,
            ),
          );
          setSelected(null);
        }}
        onDelete={() => {
          setRows((prev) => prev.filter((r) => r.d !== selected!.d));
          setSelected(null);
        }}
      />
    </AppShell>
  );
}
