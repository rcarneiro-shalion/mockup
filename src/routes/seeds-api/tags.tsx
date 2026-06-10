import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { EditRecordDialog, type FieldDef } from "@/components/seeds/EditRecordDialog";
import { AddRecordDialog, type AddFieldDef } from "@/components/seeds/AddRecordDialog";
import { CLIENT_OPTIONS } from "@/lib/seedOptions";
import {
  PageHeader,
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  UserCell,
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { Calendar, MoreVertical } from "lucide-react";

export const Route = createFileRoute("/seeds-api/tags")({
  head: () => ({ meta: [{ title: "Tags — Shalion" }] }),
  component: TagsPage,
});

type Row = { name: string; client: string; parent: string; c: string; u: string };

const INITIAL_ROWS: Row[] = [
  { name: "water", client: "Coca Cola", parent: "-", c: "2026-06-09, 10:12:03", u: "2026-06-09, 10:12:03" },
  { name: "Postry", client: "Nestle", parent: "-", c: "2026-04-15, 10:50:42", u: "2026-04-15, 10:50:42" },
  { name: "Coffe", client: "Nestle", parent: "-", c: "2026-06-09, 10:11:54", u: "2026-06-09, 10:11:54" },
  { name: "Soft Drink", client: "Pepsico", parent: "-", c: "2026-06-09, 10:12:21", u: "2026-06-09, 10:12:21" },
];

function TagsPage() {
  const [rows, setRows] = usePersistentState<Row[]>("seeds-api:tags", INITIAL_ROWS);
  const [selected, setSelected] = useState<Row | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const editFields: FieldDef[] = selected
    ? [
        { kind: "text", label: "Name", value: selected.name, required: true, span: 2 },
        { kind: "select", label: "Client", value: selected.client, required: true, options: CLIENT_OPTIONS },
        { kind: "select", label: "Parent tag", value: selected.parent, muted: true },
      ]
    : [];

  const addFields: AddFieldDef[] = [
    { kind: "text", label: "Name", required: true, span: 2 },
    { kind: "select", label: "Client", required: true, options: CLIENT_OPTIONS },
    { kind: "select", label: "Parent tag", muted: true },
  ];

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Tags"
          action={{ label: "Add tag", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by Tag name">
          <FilterChip label="Client" />
          <FilterChip label="Seeds" />
          <FilterChip label="Status" />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <Th>Name</Th>
              <Th>Client</Th>
              <Th>Parent</Th>
              <Th>Created at</Th>
              <Th>Updated at</Th>
              <Th>Created by</Th>
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.name}</LinkText></Td>
                <Td><LinkText>{r.client}</LinkText></Td>
                <Td className="text-muted-foreground">{r.parent}</Td>
                <Td className="text-muted-foreground">{r.c}</Td>
                <Td className="text-muted-foreground">{r.u}</Td>
                <Td><UserCell email="rcarneiro@..." /></Td>
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
        title="Add new tag"
        saveLabel="Add tag"
        fields={addFields}
        onSave={(values) => {
          const now = new Date().toISOString().replace("T", ", ").slice(0, 19);
          const newRow: Row = {
            name: (values["Name"] as string) || "Untitled",
            client: values["Client"] as string,
            parent: (values["Parent tag"] as string) || "-",
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
                    parent: values["Parent tag"] as string,
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
