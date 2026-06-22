import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { EditRecordDialog, type FieldDef } from "@/components/seeds/EditRecordDialog";
import { AddRecordDialog, type AddFieldDef } from "@/components/seeds/AddRecordDialog";
import { getClientNames } from "@/lib/clients";
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
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/seeds-api/tags")({
  head: () => ({ meta: [{ title: "Tags — Shalion" }] }),
  component: TagsPage,
});

type Row = { name: string; client: string; c: string; u: string };

const INITIAL_ROWS: Row[] = [
  { name: "water", client: "Coca Cola", c: "2026-06-09, 10:12:03", u: "2026-06-09, 10:12:03" },
  { name: "Postry", client: "Nestle", c: "2026-04-15, 10:50:42", u: "2026-04-15, 10:50:42" },
  { name: "Coffe", client: "Nestle", c: "2026-06-09, 10:11:54", u: "2026-06-09, 10:11:54" },
  { name: "Soft Drink", client: "Pepsico", c: "2026-06-09, 10:12:21", u: "2026-06-09, 10:12:21" },
];

function TagsPage() {
  const [rows, setRows] = usePersistentState<Row[]>("seeds-api:tags", INITIAL_ROWS);
  const [selected, setSelected] = useState<Row | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const clientOptions = getClientNames();
  const [query, setQuery] = useState("");
  const [fClient, setFClient] = useState<string[]>([]);
  const sort = useSort("tags");
  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) =>
    (!q || r.name.toLowerCase().includes(q)) &&
    (!fClient.length || fClient.includes(r.client)),
  );
  const sorted = sortRows(filtered, sort, { createdAt: (r) => r.c, updatedAt: (r) => r.u });
  const pg = usePagination(sorted.length, query);

  const editFields: FieldDef[] = selected
    ? [
        { kind: "text", label: "Name", value: selected.name, required: true, span: 2 },
        { kind: "select", label: "Client", value: selected.client, required: true, options: clientOptions, searchable: true },
      ]
    : [];

  const addFields: AddFieldDef[] = [
    { kind: "text", label: "Name", required: true, span: 2 },
    { kind: "select", label: "Client", required: true, options: clientOptions, searchable: true },
  ];

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Tags"
          action={{ label: "Add tag", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by Tag name" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Client" options={distinct(rows, (r) => r.client)} value={fClient} onChange={setFClient} searchable />
          <FilterChip label="Seeds" />
          <FilterChip label="Status" />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Client" sortKey="client" sort={sort} />
              <SortTh label="Created at" sortKey="createdAt" sort={sort} />
              <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
              <Th>Created by</Th>
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {pg.slice(sorted).map((r) => (
              <tr key={r.name} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.name}</LinkText></Td>
                <Td><LinkText>{r.client}</LinkText></Td>
                <Td className="text-muted-foreground">{r.c}</Td>
                <Td className="text-muted-foreground">{r.u}</Td>
                <Td><UserCell email="rcarneiro@..." /></Td>
                <Td><Switch defaultChecked /></Td>
                <Td>
                  <RowActionsMenu
                    id={r.name}
                    onDelete={() => setRows((prev) => prev.filter((x) => x.name !== r.name))}
                    entityLabel="tag"
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
        title="Add new tag"
        saveLabel="Add tag"
        fields={addFields}
        onSave={(values) => {
          const now = new Date().toISOString().replace("T", ", ").slice(0, 19);
          const newRow: Row = {
            name: (values["Name"] as string) || "Untitled",
            client: values["Client"] as string,
            c: now,
            u: now,
          };
          setRows((prev) => [...prev, newRow]);
        }}
      />

      <EditRecordDialog
        open={!!selected}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        title={selected?.name ?? ""}
        saveLabel="Save tag"
        fields={editFields}
        onSave={(values) => {
          setRows((prev) =>
            prev.map((r) =>
              r.name === selected!.name
                ? {
                    ...r,
                    name: values["Name"] as string,
                    client: values["Client"] as string,
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
