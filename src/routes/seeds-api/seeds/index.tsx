import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { EditRecordDialog, type FieldDef } from "@/components/seeds/EditRecordDialog";
import { STORE_OPTIONS, CATEGORY_OPTIONS } from "@/lib/seedOptions";
import { SEEDS_KEY, INITIAL_SEEDS, KEYWORD_TYPE_OPTIONS, type Seed } from "@/lib/seeds";
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
  const [query, setQuery] = useState("");
  const [fStore, setFStore] = useState("");
  const [fCat, setFCat] = useState("");
  const [fKwType, setFKwType] = useState("");
  const sort = useSort();
  const navigate = useNavigate();

  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) =>
    (seedType === "All" || (r.type ?? "") === seedType) &&
    (!q || r.d.toLowerCase().includes(q) || (r.value ?? "").toLowerCase().includes(q)) &&
    (!fStore || r.store === fStore) &&
    (!fCat || r.cat === fCat) &&
    (!fKwType || r.keywordType === fKwType),
  );
  const visible = sortRows(filtered, sort, {
    description: (r) => r.d,
    keyword: (r) => r.value ?? "",
    keywordType: (r) => r.keywordType ?? "",
    type: (r) => r.type ?? "",
    category: (r) => r.cat,
    createdAt: (r) => r.c,
    updatedAt: (r) => r.u,
  });

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
        <FilterBar search="Search by Seed description" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Ids" />
          <FilterChip label="Stores" icon={Store} options={distinct(rows, (r) => r.store)} value={fStore} onChange={setFStore} />
          <FilterChip label="Categories" options={distinct(rows, (r) => r.cat)} value={fCat} onChange={setFCat} />
          <FilterChip label="Keyword type" options={KEYWORD_TYPE_OPTIONS} value={fKwType} onChange={setFKwType} />
          <FilterChip label="Status" />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Description" sortKey="description" sort={sort} />
              <SortTh label="Keyword" sortKey="keyword" sort={sort} />
              <SortTh label="Keyword type" sortKey="keywordType" sort={sort} />
              <SortTh label="Seed type" sortKey="type" sort={sort} />
              <SortTh label="Store" sortKey="store" sort={sort} />
              <SortTh label="Category" sortKey="category" sort={sort} />
              <SortTh label="Created at" sortKey="createdAt" sort={sort} />
              <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.d}</LinkText></Td>
                <Td className="text-foreground/80">{r.value ? r.value : <span className="text-muted-foreground">—</span>}</Td>
                <Td>{r.keywordType ? <Pill tone={r.keywordType === "BRANDED" ? "violet" : "slate"}>{r.keywordType}</Pill> : <span className="text-muted-foreground">—</span>}</Td>
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
