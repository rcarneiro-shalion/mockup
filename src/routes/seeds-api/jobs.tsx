import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { EditRecordDialog, type FieldDef } from "@/components/seeds/EditRecordDialog";
import { AddRecordDialog, type AddFieldDef } from "@/components/seeds/AddRecordDialog";
import {
  STORE_OPTIONS,
  GEOLOC_OPTIONS,
  BUSINESS_UNIT_OPTIONS,
  EXTRACTION_TYPE_OPTIONS,
  readPersistedList,
} from "@/lib/seedOptions";
import {
  PageHeader,
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  NoBadge,
  Pill,
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { Calendar, MoreVertical, ArrowUp, Store, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/seeds-api/jobs")({
  head: () => ({ meta: [{ title: "Jobs — Shalion" }] }),
  component: JobsPage,
});

type Row = {
  name: string;
  store: string;
  pkg: string;
  type: string;
  typeTone: "amber" | "slate";
  geo: string;
  geoTone: "violet" | "amber";
  bu: string;
};

const INITIAL_ROWS: Row[] = [
  { name: "Alejo", store: "Amazon US", pkg: "PKG - MAT Amazon US", type: "DIGITAL_SHELF_PDP", typeTone: "slate", geo: "MANUAL", geoTone: "violet", bu: "CMI" },
  { name: "ME_KW_WATER - Amazon US", store: "Amazon US", pkg: "PKG Amazon US", type: "MEDIA", typeTone: "slate", geo: "MANUAL", geoTone: "violet", bu: "CMI" },
  { name: "PDP_BEAM_US_Amazon US", store: "Amazon US", pkg: "PKG Amazon US", type: "DIGITAL_SHELF_PDP", typeTone: "slate", geo: "VIRTUAL STORE", geoTone: "amber", bu: "DSM" },
  { name: "PLP_GEO_BEAM_US_Amazo...", store: "Amazon US", pkg: "PKG Amazon US", type: "DIGITAL_SHELF_PLP", typeTone: "slate", geo: "MANUAL", geoTone: "violet", bu: "DSM" },
  { name: "PLP - MAT- Amazon US", store: "Amazon US", pkg: "PKG - MAT Amazon US", type: "DIGITAL_SHELF_PLP", typeTone: "slate", geo: "MANUAL", geoTone: "violet", bu: "DSM" },
  { name: "SA_COCA_US_Amazon US", store: "Amazon US", pkg: "PKG Amazon US", type: "DIGITAL_SHELF_PDP", typeTone: "slate", geo: "MANUAL", geoTone: "violet", bu: "DSM" },
];

function JobsPage() {
  const [rows, setRows] = usePersistentState<Row[]>("seeds-api:jobs", INITIAL_ROWS);
  const [selected, setSelected] = useState<Row | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const storePackageOptions = readPersistedList<{ name: string }>(
    "seeds-api:store-packages",
  ).map((p) => p.name);
  const destinationJobOptions = rows.map((r) => r.name);

  const editFields: FieldDef[] = selected
    ? [
        { kind: "text", label: "Name", value: selected.name, required: true, span: 2 },
        { kind: "select", label: "Store", value: selected.store, required: true, options: STORE_OPTIONS },
        { kind: "select", label: "Store package", value: selected.pkg, required: true, options: storePackageOptions },
        { kind: "select", label: "Extraction type", value: selected.type, required: true, options: EXTRACTION_TYPE_OPTIONS },
        { kind: "select", label: "Geolocation mode", value: selected.geo, required: true, options: GEOLOC_OPTIONS },
        { kind: "select", label: "Business unit", value: selected.bu, options: BUSINESS_UNIT_OPTIONS },
        { kind: "select", label: "Destination job", value: "", options: destinationJobOptions.filter((n) => n !== selected.name) },
        { kind: "checkbox", label: "Has metadata" },
      ]
    : [];

  const addFields: AddFieldDef[] = [
    { kind: "text", label: "Name", required: true, span: 2 },
    { kind: "select", label: "Store", required: true, options: STORE_OPTIONS },
    { kind: "select", label: "Store package", required: true, options: storePackageOptions },
    { kind: "select", label: "Extraction type", required: true, options: EXTRACTION_TYPE_OPTIONS },
    { kind: "select", label: "Geolocation mode", required: true, options: GEOLOC_OPTIONS },
    { kind: "select", label: "Business unit", options: BUSINESS_UNIT_OPTIONS },
    { kind: "select", label: "Destination job", options: destinationJobOptions },
    { kind: "checkbox", label: "Has metadata" },
  ];

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Jobs"
          action={{ label: "Add job", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by Job name">
          <FilterChip label="Stores" icon={Store} />
          <FilterChip label="Store packages" />
          <FilterChip label="Extraction types" />
          <FilterChip label="Geoloc modes" />
          <FilterChip label="Business units" />
          <FilterChip label="Locations" />
          <FilterChip label="Timeframes" icon={PlayCircle} />
          <FilterChip label="Has metadata" />
          <FilterChip label="Has to extract reviews" />
          <FilterChip label="Has to extract marketplace" />
          <FilterChip label="Max pages" />
          <FilterChip label="Status" />
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
              <Th>Store package</Th>
              <Th>Extraction type</Th>
              <Th>Geolocation mode</Th>
              <Th>Business unit</Th>
              <Th>Has met...</Th>
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.name}</LinkText></Td>
                <Td><LinkText>{r.store}</LinkText></Td>
                <Td><LinkText>{r.pkg}</LinkText></Td>
                <Td><Pill tone={r.typeTone}>{r.type}</Pill></Td>
                <Td><Pill tone={r.geoTone}>{r.geo}</Pill></Td>
                <Td className="text-foreground/80">{r.bu}</Td>
                <Td><NoBadge /></Td>
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
        title="Add new job"
        saveLabel="Add job"
        fields={addFields}
        onSave={(values) => {
          const newRow: Row = {
            name: (values["Name"] as string) || "Untitled",
            store: values["Store"] as string,
            pkg: values["Store package"] as string,
            type: values["Extraction type"] as string,
            typeTone: "slate",
            geo: values["Geolocation mode"] as string,
            geoTone: "violet",
            bu: values["Business unit"] as string,
          };
          setRows((prev) => [...prev, newRow]);
        }}
      />

      <EditRecordDialog
        open={!!selected}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        title={selected?.name ?? ""}
        saveLabel="Save job"
        fields={editFields}
        onSave={(values) => {
          setRows((prev) =>
            prev.map((r) =>
              r.name === selected!.name
                ? {
                    ...r,
                    name: values["Name"] as string,
                    store: values["Store"] as string,
                    pkg: values["Store package"] as string,
                    type: values["Extraction type"] as string,
                    geo: values["Geolocation mode"] as string,
                    bu: values["Business unit"] as string,
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
