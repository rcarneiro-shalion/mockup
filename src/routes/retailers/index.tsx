import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { FilterBar, TableShell, Th, Td, Pagination, LinkText } from "@/components/seeds/ListPrimitives";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { RETAILERS_KEY, INITIAL_RETAILERS, type Retailer } from "@/lib/retailers";
import { Plus, Calendar, MoreVertical, ArrowUp } from "lucide-react";

export const Route = createFileRoute("/retailers/")({
  head: () => ({ meta: [{ title: "Retailers — Shalion" }] }),
  component: RetailersListPage,
});

function RetailersListPage() {
  const [rows] = usePersistentState<Retailer[]>(RETAILERS_KEY, INITIAL_RETAILERS);
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
        <FilterBar search="Search by retailer name">
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <Th><span className="inline-flex items-center gap-1">Name <ArrowUp className="h-3 w-3" /></span></Th>
              <Th>Created at</Th>
              <Th>Updated at</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => navigate({ to: "/retailers/$retailerId", params: { retailerId: r.id } })}>{r.name}</LinkText></Td>
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
