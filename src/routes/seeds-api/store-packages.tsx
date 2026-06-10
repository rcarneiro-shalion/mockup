import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import {
  StorePackageDetailDialog,
  type StorePackageValues,
} from "@/components/seeds/StorePackageDetailDialog";
import { AddRecordDialog, type AddFieldDef } from "@/components/seeds/AddRecordDialog";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { STORE_OPTIONS, GEOLOC_OPTIONS } from "@/lib/seedOptions";
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
  NoBadge,
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { Calendar, MoreVertical, ArrowUp, Store } from "lucide-react";

export const Route = createFileRoute("/seeds-api/store-packages")({
  head: () => ({ meta: [{ title: "Store packages — Shalion" }] }),
  component: StorePackagesPage,
});

type Row = {
  name: string;
  store: string;
  status?: string;
  geo?: string;
  isAdHoc?: boolean;
  limit?: string;
};

const INITIAL_ROWS: Row[] = [
  { name: "PKG Amazon US", store: "Amazon US", status: "Active", geo: "MANUAL", isAdHoc: false, limit: "5" },
  { name: "PKG - MAT Amazon US", store: "Amazon US", status: "Active", geo: "MANUAL", isAdHoc: false, limit: "5" },
];

function StorePackagesPage() {
  const [rows, setRows] = usePersistentState<Row[]>("seeds-api:store-packages", INITIAL_ROWS);
  const [selected, setSelected] = useState<Row | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const detailValues: StorePackageValues | null = selected
    ? {
        name: selected.name,
        store: selected.store,
        status: selected.status ?? "Active",
        geo: selected.geo ?? "MANUAL",
        isAdHoc: selected.isAdHoc ?? false,
        limit: selected.limit ?? "5",
      }
    : null;

  const addFields: AddFieldDef[] = [
    { kind: "text", label: "Name", required: true, span: 2 },
    { kind: "select", label: "Store", required: true, options: STORE_OPTIONS },
    { kind: "select", label: "Geolocation mode", value: "MANUAL", required: true, options: GEOLOC_OPTIONS },
    { kind: "checkbox", label: "Is AdHoc" },
  ];

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Store packages"
          action={{ label: "Add store package", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by Store Package name">
          <FilterChip label="Stores" icon={Store} />
          <FilterChip label="Geoloc modes" />
          <FilterChip label="Is AdHoc" />
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
              <Th>Store</Th>
              <Th>Geolocation mode</Th>
              <Th>Is AdHoc</Th>
              <Th>Created by</Th>
              <Th>Updated by</Th>
              <Th>Cr...</Th>
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.name}</LinkText></Td>
                <Td><LinkText>{r.store}</LinkText></Td>
                <Td><Pill tone="violet">{r.geo ?? "MANUAL"}</Pill></Td>
                <Td>{r.isAdHoc ? <Pill tone="green">Yes</Pill> : <NoBadge />}</Td>
                <Td><UserCell email="rcarneiro@..." /></Td>
                <Td><UserCell email="rcarneiro@..." /></Td>
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
        <Pagination total={rows.length} />
      </div>

      <AddRecordDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add new store package"
        saveLabel="Add store package"
        fields={addFields}
        onSave={(values) => {
          const newRow: Row = {
            name: (values["Name"] as string) || "Untitled",
            store: values["Store"] as string,
            status: "Active",
            geo: (values["Geolocation mode"] as string) ?? "MANUAL",
            isAdHoc: !!values["Is AdHoc"],
            limit: "5",
          };
          setRows((prev) => [...prev, newRow]);
        }}
      />

      <StorePackageDetailDialog
        open={!!selected}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        initial={detailValues}
        onSave={(values) => {
          setRows((prev) =>
            prev.map((r) =>
              r.name === selected!.name
                ? {
                    ...r,
                    name: values.name,
                    store: values.store,
                    status: values.status,
                    geo: values.geo,
                    isAdHoc: values.isAdHoc,
                    limit: values.limit,
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
