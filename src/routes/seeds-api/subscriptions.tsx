import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  parseListDate,
  distinct,
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Calendar, Store, Sprout } from "lucide-react";
import {
  SUBSCRIPTIONS_KEY,
  INITIAL_SUBSCRIPTIONS,
  BUSINESS_UNITS,
  SUBSCRIPTION_GEOLOC_OPTIONS,
  type Subscription,
} from "@/lib/subscriptions";
import { nowStamp } from "@/lib/clients";
import { getClientNames, getClientsForProject } from "@/lib/clients";
import { getProjects } from "@/lib/projects";

export const Route = createFileRoute("/seeds-api/subscriptions")({
  // `?edit=<id>` deep-links straight into a subscription's edit dialog (used by
  // the Value Stream Map cards).
  validateSearch: (search: Record<string, unknown>): { edit?: string } => ({
    edit: typeof search.edit === "string" ? search.edit : undefined,
  }),
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
  const [fBu, setFBu] = useState<string[]>([]);
  const sort = useSort("subscriptions", "updatedAt", "desc");
  const navigate = useNavigate();

  // Open the edit dialog when arriving with ?edit=<id>, then strip the param so
  // closing the dialog doesn't immediately reopen it.
  const { edit } = Route.useSearch();
  useEffect(() => {
    if (!edit) return;
    if (rows.some((r) => r.id === edit)) setSelectedId(edit);
    navigate({ to: "/seeds-api/subscriptions", search: {}, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

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
    (!fGeo.length || fGeo.includes(r.geo)) &&
    (!fBu.length || fBu.includes(r.businessUnit ?? "")),
  );
  const sorted = sortRows(filtered, sort, {
    seeds: (r) => (r.seeds ?? []).length,
    clients: (r) => clientsForSub(r).join(", "),
    createdAt: (r) => parseListDate(r.createdAt),
    updatedAt: (r) => parseListDate(r.updatedAt),
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
          <FilterChip label="Projects" options={distinct(rows, (r) => r.project)} value={fProject} onChange={setFProject} searchable />
          <FilterChip label="Stores" icon={Store} options={distinct(rows, (r) => r.store)} value={fStore} onChange={setFStore} />
          <FilterChip label="Seeds" icon={Sprout} options={seedOptions} value={fSeed} onChange={setFSeed} searchable />
          <FilterChip label="Scrapping options" options={distinct(rows, (r) => r.scrappingOption)} value={fScrap} onChange={setFScrap} searchable />
          <FilterChip label="Geoloc modes" options={SUBSCRIPTION_GEOLOC_OPTIONS} value={fGeo} onChange={setFGeo} />
          <FilterChip label="Business units" options={BUSINESS_UNITS} value={fBu} onChange={setFBu} />
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
              <SortTh label="Business unit" sortKey="businessUnit" sort={sort} />
              <SortTh label="Frequency" sortKey="frequency" sort={sort} />
              <SortTh label="Rotation" sortKey="rotation" sort={sort} />
              <SortTh label="Created at" sortKey="createdAt" sort={sort} />
              <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
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
                  <SeedsCell seeds={r.seeds ?? []} onSeeAll={() => setSelectedId(r.id)} />
                </Td>
                <Td><LinkText>{r.scrappingOption}</LinkText></Td>
                <Td><Pill tone="violet">{r.geo}</Pill></Td>
                <Td>{r.businessUnit ? <Pill tone="blue">{r.businessUnit}</Pill> : <span className="text-muted-foreground">—</span>}</Td>
                <Td>{r.frequency ? <Pill tone="slate">{r.frequency}</Pill> : <span className="text-muted-foreground">—</span>}</Td>
                <Td>{r.rotation ? <Pill tone="slate">{r.rotation}</Pill> : <span className="text-muted-foreground">—</span>}</Td>
                <Td className="whitespace-nowrap text-muted-foreground">{r.createdAt || "—"}</Td>
                <Td className="whitespace-nowrap text-muted-foreground">{r.updatedAt || "—"}</Td>
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
        onSave={(values) => setRows((prev) => [...prev, { ...values, createdAt: nowStamp(), updatedAt: nowStamp() }])}
      />

      <SubscriptionDialog
        open={selectedId !== null}
        onOpenChange={(v) => { if (!v) setSelectedId(null); }}
        mode="edit"
        initial={selected}
        onSave={(values) => {
          setRows((prev) => prev.map((r) => (r.id === selectedId ? { ...values, updatedAt: nowStamp() } : r)));
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

/**
 * Seeds column: up to 3 seeds show as pills; 4+ collapse to a "N seeds" count with
 * a hover card listing them (capped at 20, "…" beyond) and a "See all" link that
 * opens the subscription's edit dialog (where the Assigned seeds section lives).
 */
const SEEDS_INLINE_MAX = 3;
const SEEDS_TOOLTIP_MAX = 20;

function SeedsCell({ seeds, onSeeAll }: { seeds: string[]; onSeeAll: () => void }) {
  if (!seeds.length) return <span className="text-muted-foreground">—</span>;
  if (seeds.length <= SEEDS_INLINE_MAX) {
    return (
      <div className="flex flex-wrap gap-1">
        {seeds.map((s) => (
          <Pill key={s} tone="green">{s}</Pill>
        ))}
      </div>
    );
  }
  const shown = seeds.slice(0, SEEDS_TOOLTIP_MAX);
  const hidden = seeds.length - shown.length;
  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          onClick={onSeeAll}
          className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
        >
          <Sprout className="h-3 w-3" /> {seeds.length} seeds
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-72 p-3">
        <div className="mb-2 text-xs font-semibold text-foreground">Seeds ({seeds.length})</div>
        <div className="flex flex-wrap gap-1">
          {shown.map((s) => (
            <Pill key={s} tone="green">{s}</Pill>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs">
          {hidden > 0 && <span className="text-muted-foreground">…+{hidden} more</span>}
          <button
            type="button"
            onClick={onSeeAll}
            className="ml-auto font-medium text-[var(--sidebar-active-fg)] hover:underline"
          >
            See all
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
