import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { FilterBar, TableShell, Th, Td, Pagination, LinkText, SortTh, useSort, sortRows } from "@/components/seeds/ListPrimitives";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { LOCATION_CATALOGS_KEY, INITIAL_LOCATION_CATALOGS, flag, COUNTRY_OPTIONS, countryLabel, type LocationCatalog } from "@/lib/retailers";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Plus, Calendar, Flag } from "lucide-react";

export const Route = createFileRoute("/location-catalogs/")({
  head: () => ({ meta: [{ title: "Location Catalog — Shalion" }] }),
  component: LocationCatalogsListPage,
});

function LocationCatalogsListPage() {
  const [rows, setRows] = usePersistentState<LocationCatalog[]>(LOCATION_CATALOGS_KEY, INITIAL_LOCATION_CATALOGS);
  const [query, setQuery] = useState("");
  const [fCountry, setFCountry] = useState<string[]>([]);
  const sort = useSort("location-catalogs");
  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) =>
    (!q || r.name.toLowerCase().includes(q)) &&
    (!fCountry.length || fCountry.includes(r.country)),
  );
  const sorted = sortRows(filtered, sort, { sets: (r) => (r.sets ?? []).length });
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">Location Catalog</h1>
          <Button asChild size="sm" className="h-8 gap-1.5">
            <Link to="/location-catalogs/new"><Plus className="h-4 w-4" /> New location catalog</Link>
          </Button>
        </div>
        <FilterBar search="Search by catalog name" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Countries" icon={Flag} options={COUNTRY_OPTIONS} getLabel={countryLabel} value={fCountry} onChange={setFCountry} />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Country" sortKey="country" sort={sort} />
              <SortTh label="Location sets" sortKey="sets" sort={sort} />
              <SortTh label="Created at" sortKey="createdAt" sort={sort} />
              <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => navigate({ to: "/location-catalogs/$catalogId", params: { catalogId: r.id } })}>{r.name}</LinkText></Td>
                <Td className="text-foreground/80"><span className="mr-1.5">{flag(r.country)}</span>{r.country}</Td>
                <Td className="tabular-nums text-foreground/70">{(r.sets ?? []).length}</Td>
                <Td className="text-muted-foreground">{r.createdAt}</Td>
                <Td className="text-muted-foreground">{r.updatedAt}</Td>
                <Td><RowActionsMenu id={r.id} onDelete={() => setRows((prev) => prev.filter((y) => y.id !== r.id))} entityLabel="location catalog" /></Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={sorted.length} />
      </div>
    </AppShell>
  );
}
