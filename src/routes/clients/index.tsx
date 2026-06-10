import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import {
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  Pill,
  SortTh,
  useSort,
  sortRows,
} from "@/components/seeds/ListPrimitives";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { CLIENTS_KEY, INITIAL_CLIENTS, type Client } from "@/lib/clients";
import { Plus, Calendar, MoreVertical } from "lucide-react";

export const Route = createFileRoute("/clients/")({
  head: () => ({ meta: [{ title: "Clients — Shalion" }] }),
  component: ClientsListPage,
});

function ClientsListPage() {
  const [clients] = usePersistentState<Client[]>(CLIENTS_KEY, INITIAL_CLIENTS);
  const sort = useSort();
  const sorted = sortRows(clients, sort);
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">Clients</h1>
          <Button asChild size="sm" className="h-8 gap-1.5">
            <Link to="/clients/new">
              <Plus className="h-4 w-4" />
              Add client
            </Link>
          </Button>
        </div>

        <FilterBar search="Search by client name">
          <FilterChip label="Acronym" />
          <FilterChip label="Is test" />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>

        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Acronym" sortKey="acronym" sort={sort} />
              <SortTh label="Is test?" sortKey="isTest" sort={sort} />
              <SortTh label="Created at" sortKey="createdAt" sort={sort} />
              <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-secondary/40">
                <Td>
                  <LinkText onClick={() => navigate({ to: "/clients/$clientId", params: { clientId: c.id } })}>
                    {c.name}
                  </LinkText>
                </Td>
                <Td className="text-foreground/80">{c.acronym}</Td>
                <Td>
                  <Pill tone={c.isTest ? "amber" : "slate"}>{c.isTest ? "TRUE" : "FALSE"}</Pill>
                </Td>
                <Td className="text-muted-foreground">{c.createdAt}</Td>
                <Td className="text-muted-foreground">{c.updatedAt}</Td>
                <Td>
                  <button className="rounded p-1 text-muted-foreground hover:bg-secondary">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={clients.length} />
      </div>
    </AppShell>
  );
}
