import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { FilterBar, TableShell, Th, Td, Pagination, LinkText, SortTh, useSort, sortRows } from "@/components/seeds/ListPrimitives";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { REGION_SYSTEMS_KEY, INITIAL_REGION_SYSTEMS, flag, COUNTRY_OPTIONS, countryLabel, type RegionSystem } from "@/lib/retailers";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Plus, Calendar, Flag } from "lucide-react";

export const Route = createFileRoute("/region-systems/")({
  head: () => ({ meta: [{ title: "Region systems — Shalion" }] }),
  component: RegionSystemsListPage,
});

function RegionSystemsListPage() {
  const [rows, setRows] = usePersistentState<RegionSystem[]>(REGION_SYSTEMS_KEY, INITIAL_REGION_SYSTEMS);
  const [query, setQuery] = useState("");
  const [fCountry, setFCountry] = useState<string[]>([]);
  const sort = useSort("region-systems");
  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) =>
    (!q || r.name.toLowerCase().includes(q)) &&
    (!fCountry.length || fCountry.includes(r.country)),
  );
  const sorted = sortRows(filtered, sort);
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">Region systems</h1>
          <Button asChild size="sm" className="h-8 gap-1.5">
            <Link to="/region-systems/new"><Plus className="h-4 w-4" /> New region system</Link>
          </Button>
        </div>
        <FilterBar search="Search by region system name" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Countries" icon={Flag} options={COUNTRY_OPTIONS} getLabel={countryLabel} value={fCountry} onChange={setFCountry} />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Country" sortKey="country" sort={sort} />
              <SortTh label="Created at" sortKey="createdAt" sort={sort} />
              <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => navigate({ to: "/region-systems/$regionId", params: { regionId: r.id } })}>{r.name}</LinkText></Td>
                <Td className="text-foreground/80"><span className="mr-1.5">{flag(r.country)}</span>{r.country}</Td>
                <Td className="text-muted-foreground">{r.createdAt}</Td>
                <Td className="text-muted-foreground">{r.updatedAt}</Td>
                <Td><RowActionsMenu id={r.id} onDelete={() => setRows((prev) => prev.filter((y) => y.id !== r.id))} entityLabel="region system" /></Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={sorted.length} />
      </div>
    </AppShell>
  );
}
