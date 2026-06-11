import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterChip } from "@/components/seeds/FilterChip";
import { LinkText, Pagination, Th, Td, Pill, FilterBar } from "@/components/seeds/ListPrimitives";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { flag } from "@/lib/retailers";
import { readPersistedList } from "@/lib/seedOptions";
import { SEEDS_KEY, INITIAL_SEEDS, type Seed, type SeedType } from "@/lib/seeds";
import type { Client } from "@/lib/clients";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, X, LayoutGrid, Globe, Factory, Crosshair, Tag, Store, Sprout, Calendar } from "lucide-react";

const TABS = [
  { key: "data-groups", label: "Data groups", icon: LayoutGrid },
  { key: "region-systems", label: "Region systems", icon: Globe },
  { key: "manufacturers", label: "Manufacturers", icon: Factory },
  { key: "competitors", label: "Competitors", icon: Crosshair },
  { key: "seed-tags", label: "Seed tags", icon: Tag },
] as const;

const SEED_TAG_TYPES: { label: string; type: SeedType }[] = [
  { label: "Ad keyword", type: "KEYWORD" },
  { label: "Ad url", type: "URL" },
  { label: "Ad api", type: "API" },
];

export function ClientBottomTabs({
  client,
  set,
  onOpenDataGroup,
  onAddDataGroup,
}: {
  client: Client;
  set: <K extends keyof Client>(k: K, v: Client[K]) => void;
  onOpenDataGroup?: (id: string) => void;
  onAddDataGroup?: () => void;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("data-groups");

  const dataGroups = client.dataGroups ?? [];
  const regionSystems = client.regionSystems ?? [];
  const manufacturers = client.manufacturers ?? [];
  const competitors = client.competitors ?? [];

  return (
    <div>
      {/* Tab strip */}
      <div className="flex flex-wrap items-center gap-6 border-b border-border">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "relative flex items-center gap-1.5 py-3 text-sm transition-colors",
                on ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" /> {t.label}
              {on && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />}
            </button>
          );
        })}
      </div>

      {/* Seed tags has its own layout (filter bar + grid); the rest share a card */}
      {tab === "seed-tags" ? (
        <SeedTagsTab />
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          {tab === "data-groups" && (
            <CardTable
              title="Data groups"
              addLabel="Add data group"
              onAdd={onAddDataGroup}
              headers={["Name", "Dashboard Type", "Created at", "Updated at"]}
              rows={dataGroups}
              empty="No data groups yet."
              renderRow={(g) => (
                <>
                  <Td><LinkText onClick={() => onOpenDataGroup?.(g.id)}>{g.name}</LinkText></Td>
                  <Td><Pill tone="slate">{g.dashboardType}</Pill></Td>
                  <Td className="text-muted-foreground">{g.createdAt}</Td>
                  <Td className="text-muted-foreground">{g.updatedAt}</Td>
                  <Td><RowActionsMenu id={g.id} onDelete={() => set("dataGroups", dataGroups.filter((x) => x.id !== g.id))} entityLabel="data group" /></Td>
                </>
              )}
            />
          )}

          {tab === "region-systems" && (
            <CardTable
              title="Region systems"
              addLabel="Assign region system"
              headers={["Name", "Country"]}
              rows={regionSystems}
              empty="No region systems yet."
              renderRow={(rs) => (
                <>
                  <Td><LinkText>{rs.name}</LinkText></Td>
                  <Td>
                    <span className="inline-flex items-center gap-2">
                      <span>{flag(rs.country)}</span>
                      <span className="text-foreground/80">{rs.country}</span>
                    </span>
                  </Td>
                  <Td><RemoveBtn label={rs.name} onClick={() => set("regionSystems", regionSystems.filter((x) => x.id !== rs.id))} /></Td>
                </>
              )}
            />
          )}

          {tab === "manufacturers" && (
            <CardTable
              title="Manufacturers"
              addLabel="Assign manufacturer"
              headers={["Name"]}
              rows={manufacturers}
              empty="No manufacturers yet."
              renderRow={(m) => (
                <>
                  <Td><LinkText>{m.name}</LinkText></Td>
                  <Td><RemoveBtn label={m.name} onClick={() => set("manufacturers", manufacturers.filter((x) => x.id !== m.id))} /></Td>
                </>
              )}
            />
          )}

          {tab === "competitors" && (
            <CardTable
              title="Competitors"
              addLabel="Assign competitor"
              headers={["Name", "Is main competitor"]}
              rows={competitors}
              empty="No competitors yet."
              renderRow={(c) => (
                <>
                  <Td><LinkText>{c.name}</LinkText></Td>
                  <Td>
                    {c.isMain && (
                      <span className="inline-flex items-center rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-foreground/80">
                        Main competitor
                      </span>
                    )}
                  </Td>
                  <Td><RowActionsMenu id={c.id} onDelete={() => set("competitors", competitors.filter((x) => x.id !== c.id))} entityLabel="competitor" /></Td>
                </>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}

function CardTable<T extends { id: string }>({
  title,
  addLabel,
  onAdd,
  headers,
  rows,
  empty,
  renderRow,
}: {
  title: string;
  addLabel: string;
  onAdd?: () => void;
  headers: string[];
  rows: T[];
  empty: string;
  renderRow: (row: T) => React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-foreground">{title}</span>
        <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={onAdd ?? (() => toast.info(`${addLabel} — coming soon`))}>
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </Button>
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr>
              {headers.map((h) => <Th key={h}>{h}</Th>)}
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <Td className="text-muted-foreground"><span className="block py-2">{empty}</span></Td>
                {headers.slice(1).map((_, i) => <Td key={i} />)}
                <Td />
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-secondary/40">{renderRow(r)}</tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination total={rows.length} />
    </>
  );
}

function RemoveBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label={`Remove ${label}`}>
      <X className="h-4 w-4" />
    </button>
  );
}

function SeedTagsTab() {
  const [typeLabel, setTypeLabel] = useState("Ad keyword");
  const [query, setQuery] = useState("");
  const seedType = SEED_TAG_TYPES.find((t) => t.label === typeLabel)?.type ?? "KEYWORD";

  const persisted = readPersistedList<Seed>(SEEDS_KEY);
  const allSeeds = persisted.length ? persisted : INITIAL_SEEDS;
  const q = query.trim().toLowerCase();
  const rows = allSeeds.filter(
    (s) => (s.type ?? "KEYWORD") === seedType && (!q || s.d.toLowerCase().includes(q) || (s.value ?? "").toLowerCase().includes(q)),
  );
  const valueHeader = seedType === "URL" ? "Url" : seedType === "API" ? "Api origin" : "Keyword";

  return (
    <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3 px-2 pt-1">
        <span className="text-base font-semibold text-foreground">Seed tags</span>
        <Select value={typeLabel} onValueChange={setTypeLabel}>
          <SelectTrigger className="h-8 w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SEED_TAG_TYPES.map((t) => <SelectItem key={t.label} value={t.label}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-2">
        <FilterBar search="Search by description" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Ids" />
          <FilterChip label="Stores" icon={Store} />
          <FilterChip label="Jobs" />
          <FilterChip label="Boxes" />
          <FilterChip label="Category" />
          <FilterChip label="Status" />
          <FilterChip label="Keyword" icon={Sprout} />
          <FilterChip label="Keyword types" />
          <FilterChip label="Brands" />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr>
              <Th>Description</Th>
              <Th>{valueHeader}</Th>
              <Th>Keyword type</Th>
              <Th>Brand</Th>
              <Th>Store</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><Td className="text-muted-foreground"><span className="block py-2">No seed tags.</span></Td><Td /><Td /><Td /><Td /></tr>
            ) : (
              rows.slice(0, 100).map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-secondary/40">
                  <Td><LinkText>{s.d}</LinkText></Td>
                  <Td className="text-foreground/80"><span className="block max-w-[240px] truncate" title={s.value}>{s.value || "—"}</span></Td>
                  <Td>{s.keywordType ? <Pill tone={s.keywordType === "BRANDED" ? "violet" : "slate"}>{s.keywordType}</Pill> : <span className="text-muted-foreground">—</span>}</Td>
                  <Td className="text-muted-foreground">—</Td>
                  <Td><LinkText>{s.store}</LinkText></Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination total={rows.length} />
    </div>
  );
}
