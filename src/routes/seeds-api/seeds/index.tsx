import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { EditRecordDialog, type FieldDef } from "@/components/seeds/EditRecordDialog";
import { STORE_OPTIONS, CATEGORY_OPTIONS } from "@/lib/seedOptions";
import { SEEDS_KEY, INITIAL_SEEDS, type Seed } from "@/lib/seeds";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MoreVertical, Store } from "lucide-react";

const SEED_TYPE_FILTER_OPTIONS = ["All", "URL", "API", "KEYWORD"];

export const Route = createFileRoute("/seeds-api/seeds/")({
  head: () => ({ meta: [{ title: "Seeds — Shalion" }] }),
  component: SeedsPage,
});

function SeedsPage() {
  const [rows, setRows] = usePersistentState<Seed[]>(SEEDS_KEY, INITIAL_SEEDS);
  const [selected, setSelected] = useState<Seed | null>(null);
  const [seedType, setSeedType] = useState("All");
  const navigate = useNavigate();

  const visible = seedType === "All" ? rows : rows.filter((r) => (r.type ?? "") === seedType);

  const editFields: FieldDef[] = selected
    ? [
        { kind: "text", label: "Description", value: selected.d, required: true, span: 2 },
        { kind: "select", label: "Store", value: selected.store, required: true, options: STORE_OPTIONS },
        { kind: "select", label: "Category", value: selected.cat, required: true, options: CATEGORY_OPTIONS },
      ]
    : [];

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
          action={{
            label: "Add seed",
            disabled: seedType === "All",
            onClick: () =>
              navigate({ to: "/seeds-api/seeds/new", search: { type: seedType as "URL" | "API" | "KEYWORD" } }),
          }}
        />
        <FilterBar search="Search by Seed description">
          <FilterChip label="Ids" />
          <FilterChip label="Stores" icon={Store} />
          <FilterChip label="Categories" />
          <FilterChip label="Status" />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <Th>Description</Th>
              <Th>Seed type</Th>
              <Th>Store</Th>
              <Th>Category</Th>
              <Th>Created at</Th>
              <Th>Updated at</Th>
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.d}</LinkText></Td>
                <Td>{r.type ? <Pill tone="blue">{r.type}</Pill> : <span className="text-muted-foreground">—</span>}</Td>
                <Td><LinkText>{r.store}</LinkText></Td>
                <Td className="text-foreground/80">{r.cat}</Td>
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
        <Pagination total={visible.length} />
      </div>

      <EditRecordDialog
        open={!!selected}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        title={selected?.d ?? ""}
        saveLabel="Save seed"
        fields={editFields}
        onSave={(values) => {
          setRows((prev) =>
            prev.map((r) =>
              r.id === selected!.id
                ? { ...r, d: values["Description"] as string, store: values["Store"] as string, cat: values["Category"] as string }
                : r,
            ),
          );
          setSelected(null);
        }}
        onDelete={() => {
          setRows((prev) => prev.filter((r) => r.id !== selected!.id));
          setSelected(null);
        }}
      />
    </AppShell>
  );
}
