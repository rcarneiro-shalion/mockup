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
} from "@/components/seeds/ListPrimitives";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { CLIENTS_KEY, INITIAL_CLIENTS, type Client } from "@/lib/clients";
import { Plus, Calendar, MoreVertical, ArrowUp } from "lucide-react";

export const Route = createFileRoute("/clients/")({
  head: () => ({ meta: [{ title: "Clients — Shalion" }] }),
  component: ClientsListPage,
});

function ClientsListPage() {
  const [clients] = usePersistentState<Client[]>(CLIENTS_KEY, INITIAL_CLIENTS);
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
              <Th>
                <span className="inline-flex items-center gap-1">
                  Name <ArrowUp className="h-3 w-3" />
                </span>
              </Th>
              <Th>Acronym</Th>
              <Th>Is test?</Th>
              <Th>Created at</Th>
              <Th>Updated at</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
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
