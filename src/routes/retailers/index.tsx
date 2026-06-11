import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { FilterBar, TableShell, Th, Td, Pagination, LinkText, SortTh, useSort, sortRows } from "@/components/seeds/ListPrimitives";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { RETAILERS_KEY, INITIAL_RETAILERS, deriveStoreRetailers, type Retailer } from "@/lib/retailers";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Plus, Calendar } from "lucide-react";

export const Route = createFileRoute("/retailers/")({
  head: () => ({ meta: [{ title: "Retailers — Shalion" }] }),
  component: RetailersListPage,
});

function RetailersListPage() {
  const [persisted, setPersisted] = usePersistentState<Retailer[]>(RETAILERS_KEY, INITIAL_RETAILERS);
  const rows = [...persisted, ...deriveStoreRetailers(persisted)];
  const [query, setQuery] = useState("");
  const sort = useSort();
  const q = query.trim().toLowerCase();
  const filtered = q ? rows.filter((r) => r.name.toLowerCase().includes(q)) : rows;
  const sorted = sortRows(filtered, sort);
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">Retailers</h1>
          <Button asChild size="sm" className="h-8 gap-1.5">
            <Link to="/retailers/new"><Plus className="h-4 w-4" /> New retailer</Link>
          </Button>
        </div>
        <FilterBar search="Search by retailer name" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Created at" sortKey="createdAt" sort={sort} />
              <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => navigate({ to: "/retailers/$retailerId", params: { retailerId: r.id } })}>{r.name}</LinkText></Td>
                <Td className="text-muted-foreground">{r.createdAt}</Td>
                <Td className="text-muted-foreground">{r.updatedAt}</Td>
                <Td><RowActionsMenu id={r.id} onDelete={() => setPersisted((prev) => prev.filter((y) => y.id !== r.id))} entityLabel="retailer" /></Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={sorted.length} />
      </div>
    </AppShell>
  );
}
