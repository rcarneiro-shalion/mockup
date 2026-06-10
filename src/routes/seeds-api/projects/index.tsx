import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import {
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  UserCell,
  Pill,
  SortTh,
  useSort,
  sortRows,
  distinct,
} from "@/components/seeds/ListPrimitives";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { PROJECTS_KEY, INITIAL_PROJECTS, type Project } from "@/lib/projects";
import { getClientsForProject, getClientNames } from "@/lib/clients";
import { getSubscriptions } from "@/lib/subscriptions";
import { cn } from "@/lib/utils";
import { Plus, Calendar, MoreVertical, MoreHorizontal, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/seeds-api/projects/")({
  head: () => ({ meta: [{ title: "Projects — Shalion" }] }),
  component: ProjectsListPage,
});

function StatusPill({ status }: { status: Project["status"] }) {
  const active = status === "Active";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80">
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-slate-400")} />
      {status}
    </span>
  );
}

function ProjectsListPage() {
  const [projects] = usePersistentState<Project[]>(PROJECTS_KEY, INITIAL_PROJECTS);
  const [query, setQuery] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fBom, setFBom] = useState("");
  const [fClient, setFClient] = useState("");
  const [fSubscription, setFSubscription] = useState("");
  const sort = useSort();
  const navigate = useNavigate();

  const clientOptions = getClientNames();
  const subscriptionOptions = [
    ...new Set([
      ...getSubscriptions().map((s) => s.name),
      ...projects.flatMap((p) => (p.assignedSubscriptions ?? []).map((s) => s.name)),
    ]),
  ].sort();

  const q = query.trim().toLowerCase();
  const filtered = projects.filter((p) =>
    (!q || p.name.toLowerCase().includes(q)) &&
    (!fStatus || p.status === fStatus) &&
    (!fBom || p.bom === fBom) &&
    (!fClient || getClientsForProject(p.id).includes(fClient)) &&
    (!fSubscription || (p.assignedSubscriptions ?? []).some((s) => s.name === fSubscription)),
  );
  const sorted = sortRows(filtered, sort, {
    clients: (p) => getClientsForProject(p.id).length,
    subscriptions: (p) => (p.assignedSubscriptions ?? []).length,
  });

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">Projects</h1>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-secondary" aria-label="More options">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <Button asChild size="sm" className="h-8 gap-1.5">
              <Link to="/seeds-api/projects/new">
                <Plus className="h-4 w-4" />
                New project
              </Link>
            </Button>
          </div>
        </div>

        <FilterBar search="Search by project name" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Clients" options={clientOptions} value={fClient} onChange={setFClient} searchable />
          <FilterChip label="Subscriptions" options={subscriptionOptions} value={fSubscription} onChange={setFSubscription} searchable />
          <FilterChip label="Status" options={["Active", "Inactive"]} value={fStatus} onChange={setFStatus} />
          <FilterChip label="BoM" options={distinct(projects, (p) => p.bom)} value={fBom} onChange={setFBom} />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>

        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Clients" sortKey="clients" sort={sort} />
              <SortTh label="Subscriptions" sortKey="subscriptions" sort={sort} />
              <SortTh label={<span className="inline-flex items-center gap-1">BoM <HelpCircle className="h-3 w-3" /></span>} sortKey="bom" sort={sort} />
              <SortTh label="Created at" sortKey="createdAt" sort={sort} />
              <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
              <SortTh label="Created by" sortKey="createdBy" sort={sort} />
              <SortTh label="Updated by" sortKey="updatedBy" sort={sort} />
              <SortTh label="Status" sortKey="status" sort={sort} />
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <Td className="text-muted-foreground">
                  <span className="block py-2">No projects match “{query}”.</span>
                </Td>
                <Td /><Td /><Td /><Td /><Td /><Td /><Td /><Td /><Td />
              </tr>
            )}
            {sorted.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-secondary/40">
                <Td>
                  <LinkText onClick={() => navigate({ to: "/seeds-api/projects/$projectId", params: { projectId: p.id } })}>
                    {p.name}
                  </LinkText>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {getClientsForProject(p.id).length ? (
                      getClientsForProject(p.id).map((c) => <Pill key={c} tone="green">{c}</Pill>)
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {(p.assignedSubscriptions ?? []).length ? (
                      (p.assignedSubscriptions ?? []).map((s) => <Pill key={s.id} tone="slate">{s.name}</Pill>)
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </Td>
                <Td className="text-foreground/80">{p.bom || "-"}</Td>
                <Td className="text-muted-foreground">{p.createdAt}</Td>
                <Td className="text-muted-foreground">{p.updatedAt}</Td>
                <Td><UserCell email={p.createdBy} /></Td>
                <Td><UserCell email={p.updatedBy} /></Td>
                <Td><StatusPill status={p.status} /></Td>
                <Td>
                  <button className="rounded p-1 text-muted-foreground hover:bg-secondary">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={filtered.length} />
      </div>
    </AppShell>
  );
}
