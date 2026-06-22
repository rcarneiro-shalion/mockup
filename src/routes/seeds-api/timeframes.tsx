import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { EditRecordDialog, type FieldDef } from "@/components/seeds/EditRecordDialog";
import { AddRecordDialog, type AddFieldDef } from "@/components/seeds/AddRecordDialog";
import {
  PageHeader,
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  UserCell,
  SortTh,
  useSort,
  sortRows,
  usePagination,
  distinct,
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Calendar, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/seeds-api/timeframes")({
  head: () => ({ meta: [{ title: "TaskGroup — Shalion" }] }),
  component: TimeframesPage,
});

type Row = {
  name: string;
  group: string;
  product: string;
};

const INITIAL_ROWS: Row[] = [
  {
    name: "Dummy task group bc425bf...",
    group: "group-123",
    product: "product-123",
  },
];

function TimeframesPage() {
  const [rows, setRows] = usePersistentState<Row[]>("seeds-api:timeframes", INITIAL_ROWS);
  const [selected, setSelected] = useState<Row | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [fGroup, setFGroup] = useState<string[]>([]);
  const [fProduct, setFProduct] = useState<string[]>([]);
  const sort = useSort("timeframes");
  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) =>
    (!q || r.name.toLowerCase().includes(q)) &&
    (!fGroup.length || fGroup.includes(r.group)) &&
    (!fProduct.length || fProduct.includes(r.product)),
  );
  const sorted = sortRows(filtered, sort, {});
  const pg = usePagination(sorted.length, query);

  const editFields: FieldDef[] = selected
    ? [
        { kind: "text", label: "Name", value: selected.name, required: true, span: 2 },
        { kind: "text", label: "Group", value: selected.group },
        { kind: "text", label: "Product", value: selected.product },
      ]
    : [];

  const addFields: AddFieldDef[] = [
    { kind: "text", label: "Name", required: true, span: 2 },
    { kind: "text", label: "Group" },
    { kind: "text", label: "Product" },
  ];

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="TaskGroup"
          action={{ label: "Add task group", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by TaskGroup name" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Group" options={distinct(rows, (r) => r.group)} value={fGroup} onChange={setFGroup} />
          <FilterChip label="Products" options={distinct(rows, (r) => r.product)} value={fProduct} onChange={setFProduct} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Group" sortKey="group" sort={sort} />
              <SortTh label="Product" sortKey="product" sort={sort} />
              <Th>Created by</Th>
              <Th>Updated by</Th>
              <Th>Cr...</Th>
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {pg.slice(sorted).map((r) => (
              <tr key={r.name} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.name}</LinkText></Td>
                <Td className="text-foreground/80">{r.group}</Td>
                <Td className="text-foreground/80">{r.product}</Td>
                <Td><UserCell email="btrainor@s..." /></Td>
                <Td><UserCell email="btrainor@s..." /></Td>
                <Td className="text-muted-foreground">20...</Td>
                <Td><Switch defaultChecked /></Td>
                <Td>
                  <RowActionsMenu
                    id={r.name}
                    onDelete={() => setRows((prev) => prev.filter((x) => x.name !== r.name))}
                    entityLabel="task group"
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={sorted.length} page={pg.page} pageSize={pg.pageSize} onPageChange={pg.setPage} onPageSizeChange={pg.setPageSize} />
      </div>

      <AddRecordDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add new task group"
        saveLabel="Add task group"
        fields={addFields}
        onSave={(values) => {
          const newRow: Row = {
            name: (values["Name"] as string) || "Untitled",
            group: values["Group"] as string,
            product: values["Product"] as string,
          };
          setRows((prev) => [...prev, newRow]);
        }}
      />

      <EditRecordDialog
        open={!!selected}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        title={selected?.name ?? ""}
        saveLabel="Save task group"
        fields={editFields}
        onSave={(values) => {
          setRows((prev) =>
            prev.map((r) =>
              r.name === selected!.name
                ? {
                    ...r,
                    name: values["Name"] as string,
                    group: values["Group"] as string,
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
