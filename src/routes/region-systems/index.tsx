import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { FilterBar, TableShell, Th, Td, Pagination, LinkText } from "@/components/seeds/ListPrimitives";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { REGION_SYSTEMS_KEY, INITIAL_REGION_SYSTEMS, flag, type RegionSystem } from "@/lib/retailers";
import { Plus, Calendar, MoreVertical, Flag } from "lucide-react";

export const Route = createFileRoute("/region-systems/")({
  head: () => ({ meta: [{ title: "Region systems — Shalion" }] }),
  component: RegionSystemsListPage,
});

function RegionSystemsListPage() {
  const [rows] = usePersistentState<RegionSystem[]>(REGION_SYSTEMS_KEY, INITIAL_REGION_SYSTEMS);
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
        <FilterBar search="Search by region system name">
          <FilterChip label="Countries" icon={Flag} />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <Th>Name</Th>
              <Th>Country</Th>
              <Th>Created at</Th>
              <Th>Updated at</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => navigate({ to: "/region-systems/$regionId", params: { regionId: r.id } })}>{r.name}</LinkText></Td>
                <Td className="text-foreground/80"><span className="mr-1.5">{flag(r.country)}</span>{r.country}</Td>
                <Td className="text-muted-foreground">{r.createdAt}</Td>
                <Td className="text-muted-foreground">{r.updatedAt}</Td>
                <Td><button className="rounded p-1 text-muted-foreground hover:bg-secondary"><MoreVertical className="h-4 w-4" /></button></Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={rows.length} />
      </div>
    </AppShell>
  );
}
