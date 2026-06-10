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
  FREQUENCY_OPTIONS,
  LOCATION_SET_OPTIONS,
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
  Pill,
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { Calendar, MoreVertical, ArrowUp, Store, Sprout } from "lucide-react";

export const Route = createFileRoute("/seeds-api/stuff")({
  head: () => ({ meta: [{ title: "Stuff — Shalion" }] }),
  component: StuffPage,
});

// "Stuff" is a temporary placeholder name (TBD) for the job-like hub entity that
// ties a Project to a Seed, a Scrapping option, and a Location SET, and carries
// the client-oriented options (geoloc, frequency).
type Row = {
  name: string;
  project: string;
  store: string;
  seed: string;
  scrappingOption: string;
  locationSet: string;
  geo: string;
  frequency: string;
};

const PROJECT_OPTIONS = [
  "Coca Cola — US Beverages",
  "Nestlé — Coffee",
  "Pepsico — Snacks",
];

const INITIAL_ROWS: Row[] = [
  {
    name: "ME_KW_WATER — Amazon US",
    project: "Coca Cola — US Beverages",
    store: "Amazon US",
    seed: "water",
    scrappingOption: "ME_KW_WATER — Amazon US",
    locationSet: "Amazon US — All locations",
    geo: "INHERITED",
    frequency: "NO_ROTATE_DAILY",
  },
  {
    name: "PDP_BEAM_US — Amazon US",
    project: "Nestlé — Coffee",
    store: "Amazon US",
    seed: "coffee",
    scrappingOption: "PDP_BEAM_US — Amazon US",
    locationSet: "Walmart East Coast — 50 locations",
    geo: "INHERITED + MANUAL",
    frequency: "ROTATE_WEEKLY",
  },
];

const STUFF_GEOLOC_OPTIONS = ["INHERITED", "INHERITED + MANUAL", ...GEOLOC_OPTIONS, "VIRTUAL STORE"];

function StuffPage() {
  const [rows, setRows] = usePersistentState<Row[]>("seeds-api:stuff", INITIAL_ROWS);
  const [selected, setSelected] = useState<Row | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const seedOptions = readPersistedList<{ d: string }>("seeds-api:seeds").map((s) => s.d);
  const scrappingOptionNames = readPersistedList<{ name: string }>(
    "seeds-api:scrapping-options",
  ).map((s) => s.name);

  const buildFields = (r: Partial<Row>): (FieldDef | AddFieldDef)[] => [
    { kind: "text", label: "Name", value: r.name ?? "", required: true, span: 2 },
    { kind: "select", label: "Project", value: r.project ?? "", required: true, options: PROJECT_OPTIONS },
    { kind: "select", label: "Store", value: r.store ?? "", required: true, options: STORE_OPTIONS },
    // References (entities map: Stuff → Seed / Scrapping option / Location SET)
    { kind: "select", label: "Seed", value: r.seed ?? "", required: true, options: seedOptions },
    { kind: "select", label: "Scrapping option", value: r.scrappingOption ?? "", required: true, options: scrappingOptionNames },
    { kind: "select", label: "Location SET", value: r.locationSet ?? "", options: LOCATION_SET_OPTIONS },
    // Client-oriented options
    { kind: "select", label: "Geolocation mode", value: r.geo ?? "INHERITED", options: STUFF_GEOLOC_OPTIONS },
    { kind: "select", label: "Frequency", value: r.frequency ?? "NO_ROTATE_DAILY", options: FREQUENCY_OPTIONS },
  ];

  const toRow = (values: Record<string, string | boolean>, fallback?: Row): Row => ({
    name: (values["Name"] as string) || fallback?.name || "Untitled",
    project: values["Project"] as string,
    store: values["Store"] as string,
    seed: values["Seed"] as string,
    scrappingOption: values["Scrapping option"] as string,
    locationSet: values["Location SET"] as string,
    geo: values["Geolocation mode"] as string,
    frequency: values["Frequency"] as string,
  });

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Stuff"
          trailing={
            <span className="rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground">
              placeholder name
            </span>
          }
          action={{ label: "Add stuff", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by name">
          <FilterChip label="Projects" />
          <FilterChip label="Stores" icon={Store} />
          <FilterChip label="Seeds" icon={Sprout} />
          <FilterChip label="Scrapping options" />
          <FilterChip label="Geoloc modes" />
          <FilterChip label="Created at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <Th>
                <span className="inline-flex items-center gap-1">
                  Name <ArrowUp className="h-3 w-3" />
                </span>
              </Th>
              <Th>Project</Th>
              <Th>Seed</Th>
              <Th>Scrapping option</Th>
              <Th>Location SET</Th>
              <Th>Geoloc</Th>
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelected(r)}>{r.name}</LinkText></Td>
                <Td className="text-foreground/80">{r.project}</Td>
                <Td><LinkText>{r.seed}</LinkText></Td>
                <Td><LinkText>{r.scrappingOption}</LinkText></Td>
                <Td className="text-foreground/80">{r.locationSet}</Td>
                <Td><Pill tone="violet">{r.geo}</Pill></Td>
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
        title="Add new stuff"
        saveLabel="Add stuff"
        fields={buildFields({}) as AddFieldDef[]}
        onSave={(values) => setRows((prev) => [...prev, toRow(values)])}
      />

      <EditRecordDialog
        open={!!selected}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        title={selected?.name ?? ""}
        saveLabel="Save stuff"
        fields={(selected ? buildFields(selected) : []) as FieldDef[]}
        onSave={(values) => {
          setRows((prev) =>
            prev.map((r) => (r.name === selected!.name ? toRow(values, r) : r)),
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
