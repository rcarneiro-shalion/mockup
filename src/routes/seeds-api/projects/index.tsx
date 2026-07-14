import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  GroupedPills,
  SortTh,
  useSort,
  sortRows,
  usePagination,
  parseListDate,
  distinct,
} from "@/components/seeds/ListPrimitives";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { PROJECTS_KEY, INITIAL_PROJECTS, BULK_PROJECTS_EXTRA, type Project } from "@/lib/projects";
import { getClientsForProject, getClientNames } from "@/lib/clients";
import { getScrapingPlans } from "@/lib/scrapingPlans";
import { cn } from "@/lib/utils";
import { Plus, Calendar, MoreHorizontal, HelpCircle } from "lucide-react";

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
  const [projects, setProjects] = usePersistentState<Project[]>(PROJECTS_KEY, INITIAL_PROJECTS);
  // Display = the writable set + the read-only live bulk overlay (deduped by name). The
  // bulk projects are reference-only (never persisted), so only writable rows get a row
  // menu — otherwise deleting a non-persisted bulk row would no-op confusingly.
  const allProjects = useMemo(() => {
    const names = new Set(projects.map((p) => p.name));
    return [...projects, ...BULK_PROJECTS_EXTRA.filter((p) => !names.has(p.name))];
  }, [projects]);
  const writableIds = useMemo(() => new Set(projects.map((p) => p.id)), [projects]);
  const [query, setQuery] = useState("");
  const [fStatus, setFStatus] = useState<string[]>([]);
  const [fBom, setFBom] = useState<string[]>([]);
  const [fClient, setFClient] = useState<string[]>([]);
  const [fScrapingPlan, setFScrapingPlan] = useState<string[]>([]);
  const sort = useSort("projects", "updatedAt", "desc");
  const navigate = useNavigate();

  const clientOptions = getClientNames();
  const scrapingPlanOptions = [
    ...new Set([
      ...getScrapingPlans().map((s) => s.name),
      ...projects.flatMap((p) => (p.assignedScrapingPlans ?? []).map((s) => s.name)),
    ]),
  ].sort();

  const q = query.trim().toLowerCase();
  const filtered = allProjects.filter((p) =>
    (!q || p.name.toLowerCase().includes(q)) &&
    (!fStatus.length || fStatus.includes(p.status)) &&
    (!fBom.length || fBom.includes(p.bom)) &&
    (!fClient.length || fClient.some((c) => getClientsForProject(p.id).includes(c))) &&
    (!fScrapingPlan.length || fScrapingPlan.some((name) => (p.assignedScrapingPlans ?? []).some((s) => s.name === name))),
  );
  const sorted = sortRows(filtered, sort, {
    clients: (p) => getClientsForProject(p.id).length,
    scrapingPlans: (p) => (p.assignedScrapingPlans ?? []).length,
    createdAt: (p) => parseListDate(p.createdAt),
    updatedAt: (p) => parseListDate(p.updatedAt),
  });
  const pg = usePagination(sorted.length, query);

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
          <FilterChip label="Scraping Plans" options={scrapingPlanOptions} value={fScrapingPlan} onChange={setFScrapingPlan} searchable />
          <FilterChip label="Status" options={["Active", "Inactive"]} value={fStatus} onChange={setFStatus} />
          <FilterChip label="BoM" options={distinct(allProjects, (p) => p.bom)} value={fBom} onChange={setFBom} />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>

        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Clients" sortKey="clients" sort={sort} />
              <SortTh label="Scraping Plans" sortKey="scraping plans" sort={sort} />
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
            {pg.slice(sorted).map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-secondary/40">
                <Td>
                  <LinkText onClick={() => navigate({ to: "/seeds-api/projects/$projectId", params: { projectId: p.id } })}>
                    {p.name}
                  </LinkText>
                </Td>
                <Td>
                  <GroupedPills
                    items={getClientsForProject(p.id)}
                    noun="client"
                    tone="green"
                    onSeeAll={() => navigate({ to: "/seeds-api/projects/$projectId", params: { projectId: p.id } })}
                  />
                </Td>
                <Td>
                  <GroupedPills
                    items={(p.assignedScrapingPlans ?? []).map((s) => s.name)}
                    noun="scraping plan"
                    tone="slate"
                    onSeeAll={() => navigate({ to: "/seeds-api/projects/$projectId", params: { projectId: p.id } })}
                  />
                </Td>
                <Td className="text-foreground/80">{p.bom || "-"}</Td>
                <Td className="text-muted-foreground">{p.createdAt}</Td>
                <Td className="text-muted-foreground">{p.updatedAt}</Td>
                <Td><UserCell email={p.createdBy} /></Td>
                <Td><UserCell email={p.updatedBy} /></Td>
                <Td><StatusPill status={p.status} /></Td>
                <Td>
                  {writableIds.has(p.id) && (
                    <RowActionsMenu id={p.id} onDelete={() => setProjects((prev) => prev.filter((x) => x.id !== p.id))} entityLabel="project" />
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={sorted.length} page={pg.page} pageSize={pg.pageSize} onPageChange={pg.setPage} onPageSizeChange={pg.setPageSize} />
      </div>
    </AppShell>
  );
}
