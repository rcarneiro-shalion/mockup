import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { SubscriptionDialog } from "@/components/seeds/SubscriptionDialog";
import {
  PageHeader,
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
  distinct,
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Calendar, Store, Sprout } from "lucide-react";
import {
  SUBSCRIPTIONS_KEY,
  INITIAL_SUBSCRIPTIONS,
  type Subscription,
} from "@/lib/subscriptions";
import { getClientNames, getClientsForProject } from "@/lib/clients";
import { getProjects } from "@/lib/projects";

export const Route = createFileRoute("/seeds-api/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions — Shalion" }] }),
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  const [rows, setRows] = usePersistentState<Subscription[]>(SUBSCRIPTIONS_KEY, INITIAL_SUBSCRIPTIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [fClient, setFClient] = useState<string[]>([]);
  const [fProject, setFProject] = useState<string[]>([]);
  const [fStore, setFStore] = useState<string[]>([]);
  const [fSeed, setFSeed] = useState<string[]>([]);
  const [fScrap, setFScrap] = useState<string[]>([]);
  const [fGeo, setFGeo] = useState<string[]>([]);
  const sort = useSort("subscriptions");
  const navigate = useNavigate();

  const q = query.trim().toLowerCase();
  const seedOptions = [...new Set(rows.flatMap((r) => r.seeds ?? []))].sort();
  // subscription → project → client(s)
  const projectIdByName = new Map(getProjects().map((p) => [p.name, p.id]));
  const clientsForSub = (sub: Subscription) => getClientsForProject(projectIdByName.get(sub.project) ?? "");
  const filtered = rows.filter((r) =>
    (!q || r.name.toLowerCase().includes(q)) &&
    (!fClient.length || fClient.some((c) => clientsForSub(r).includes(c))) &&
    (!fProject.length || fProject.includes(r.project)) &&
    (!fStore.length || fStore.includes(r.store)) &&
    (!fSeed.length || (r.seeds ?? []).some((s) => fSeed.includes(s))) &&
    (!fScrap.length || fScrap.includes(r.scrappingOption)) &&
    (!fGeo.length || fGeo.includes(r.geo)),
  );
  const sorted = sortRows(filtered, sort, {
    seeds: (r) => (r.seeds ?? []).length,
    clients: (r) => clientsForSub(r).join(", "),
  });
  const selected = rows.find((r) => r.id === selectedId) ?? null;

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Subscriptions"
          action={{ label: "Add subscription", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by name" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Clients" options={getClientNames()} value={fClient} onChange={setFClient} searchable />
          <FilterChip label="Projects" options={distinct(rows, (r) => r.project)} value={fProject} onChange={setFProject} />
          <FilterChip label="Stores" icon={Store} options={distinct(rows, (r) => r.store)} value={fStore} onChange={setFStore} />
          <FilterChip label="Seeds" icon={Sprout} options={seedOptions} value={fSeed} onChange={setFSeed} />
          <FilterChip label="Scrapping options" options={distinct(rows, (r) => r.scrappingOption)} value={fScrap} onChange={setFScrap} />
          <FilterChip label="Geoloc modes" options={distinct(rows, (r) => r.geo)} value={fGeo} onChange={setFGeo} />
          <FilterChip label="Created at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Project" sortKey="project" sort={sort} />
              <SortTh label="Clients" sortKey="clients" sort={sort} />
              <SortTh label="Seeds" sortKey="seeds" sort={sort} />
              <SortTh label="Scrapping option" sortKey="scrappingOption" sort={sort} />
              <SortTh label="Geoloc" sortKey="geo" sort={sort} />
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelectedId(r.id)}>{r.name}</LinkText></Td>
                <Td>
                  {projectIdByName.get(r.project) ? (
                    <LinkText
                      onClick={() =>
                        navigate({
                          to: "/seeds-api/projects/$projectId",
                          params: { projectId: projectIdByName.get(r.project)! },
                        })
                      }
                    >
                      {r.project}
                    </LinkText>
                  ) : (
                    <span className="text-foreground/80">{r.project}</span>
                  )}
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {clientsForSub(r).length ? (
                      clientsForSub(r).map((c) => <Pill key={c} tone="green">{c}</Pill>)
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {(r.seeds ?? []).length ? (
                      (r.seeds ?? []).map((s) => <Pill key={s} tone="green">{s}</Pill>)
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </Td>
                <Td><LinkText>{r.scrappingOption}</LinkText></Td>
                <Td><Pill tone="violet">{r.geo}</Pill></Td>
                <Td><Switch defaultChecked /></Td>
                <Td>
                  <RowActionsMenu
                    id={r.id}
                    onDelete={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                    entityLabel="subscription"
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={sorted.length} />
      </div>

      <SubscriptionDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        mode="add"
        initial={null}
        onSave={(values) => setRows((prev) => [...prev, values])}
      />

      <SubscriptionDialog
        open={selectedId !== null}
        onOpenChange={(v) => { if (!v) setSelectedId(null); }}
        mode="edit"
        initial={selected}
        onSave={(values) => {
          setRows((prev) => prev.map((r) => (r.id === selectedId ? values : r)));
          setSelectedId(null);
        }}
        onDelete={() => {
          setRows((prev) => prev.filter((r) => r.id !== selectedId));
          setSelectedId(null);
        }}
      />
    </AppShell>
  );
}
