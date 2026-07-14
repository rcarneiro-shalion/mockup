import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import {
  SEEDS_KEY,
  INITIAL_SEEDS,
  BULK_SEEDS_EXTRA,
  KEYWORD_TYPE_OPTIONS,
  SEED_STATUS_OPTIONS,
  type Seed,
} from "@/lib/seeds";
import { PAGE_TYPE_OPTIONS } from "@/lib/seedOptions";
import { getScrapingPlans, subProjects } from "@/lib/scrapingPlans";
import { getProjects } from "@/lib/projects";
import { getClientsForProject } from "@/lib/clients";
import {
  PageHeader,
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  Pill,
  GroupedPills,
  SortTh,
  useSort,
  sortRows,
  usePagination,
  distinct,
} from "@/components/seeds/ListPrimitives";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Calendar, Store, Layers, FolderKanban, Users, Shapes, Tag, Plus } from "lucide-react";

export const Route = createFileRoute("/seeds-api/seeds/")({
  head: () => ({ meta: [{ title: "Seeds — Shalion" }] }),
  component: SeedsPage,
});

const dash = <span className="text-muted-foreground">—</span>;

function StatusCell({ status }: { status?: Seed["status"] }) {
  const active = (status ?? "Active") !== "Inactive";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80">
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-slate-400")} />
      {status ?? "Active"}
    </span>
  );
}

type Col = { key: string; label: ReactNode; sortKey?: string; cell: (r: Seed) => ReactNode };

function SeedsPage() {
  const [rows, setRows] = usePersistentState<Seed[]>(SEEDS_KEY, INITIAL_SEEDS);
  // Display = the small writable set + the read-only bulk seed corpus (deduped by id).
  // Only writable rows are editable/deletable; the bulk corpus is reference data.
  const writableIds = useMemo(() => new Set(rows.map((r) => r.id)), [rows]);
  const allRows = useMemo(() => [...rows, ...BULK_SEEDS_EXTRA.filter((s) => !writableIds.has(s.id))], [rows, writableIds]);
  const [query, setQuery] = useState("");
  const [fValue, setFValue] = useState<string[]>([]);
  const [fStore, setFStore] = useState<string[]>([]);
  const [fCat, setFCat] = useState<string[]>([]);
  const [fPageType, setFPageType] = useState<string[]>([]);
  const [fDiscoveryKey, setFDiscoveryKey] = useState<string[]>([]);
  const [fKwType, setFKwType] = useState<string[]>([]);
  const [fBrand, setFBrand] = useState<string[]>([]);
  const [fStatus, setFStatus] = useState<string[]>([]);
  const [fSub, setFSub] = useState<string[]>([]);
  const [fProject, setFProject] = useState<string[]>([]);
  const [fClient, setFClient] = useState<string[]>([]);
  const [fSeedType, setFSeedType] = useState<string[]>([]);
  const sort = useSort("seeds");
  const navigate = useNavigate();

  // Indirect relationship: a scrapingPlan holds its assigned seeds by description
  // (ScrapingPlan.seeds = seed.d). The set of seed descriptions covered by the
  // currently-picked scrapingPlans — a seed row matches if its description is in it.
  const allSubs = getScrapingPlans();
  const subSeedSet = new Set(allSubs.filter((s) => fSub.includes(s.name)).flatMap((s) => s.seeds ?? []));
  // Inverse of the relationship: seed description → the scrapingPlan name(s) it's
  // assigned to (a seed can belong to several). Drives the ScrapingPlans column.
  const subsBySeedDesc = new Map<string, string[]>();
  for (const sub of allSubs) for (const d of sub.seeds ?? []) {
    const arr = subsBySeedDesc.get(d);
    if (arr) arr.push(sub.name);
    else subsBySeedDesc.set(d, [sub.name]);
  }

  // Deeper indirect chains for the Projects / Clients filters:
  //   seed (d) → scrapingPlan (seeds[]) → project (sub.project) → client(s).
  // A scrapingPlan's project resolves to its assigned clients via the
  // client↔project relationship; cache the lookup per project name.
  const projectIdByName = new Map(getProjects().map((p) => [p.name, p.id]));
  const clientsByProjectName = new Map<string, string[]>();
  const clientsOf = (projectName: string) => {
    let c = clientsByProjectName.get(projectName);
    if (!c) {
      c = getClientsForProject(projectIdByName.get(projectName) ?? "");
      clientsByProjectName.set(projectName, c);
    }
    return c;
  };
  // Seed descriptions reachable through the scrapingPlans matching the picked
  // projects / clients — a seed row matches if its description is in the set.
  const projectSeedSet = new Set(
    allSubs.filter((s) => subProjects(s).some((p) => fProject.includes(p))).flatMap((s) => s.seeds ?? []),
  );
  const clientSeedSet = new Set(
    allSubs
      .filter((s) => subProjects(s).some((p) => clientsOf(p).some((c) => fClient.includes(c))))
      .flatMap((s) => s.seeds ?? []),
  );
  // Only projects / clients reachable through a scrapingPlan can ever match.
  const projectFilterOptions = [...new Set(allSubs.flatMap(subProjects).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const clientFilterOptions = [...new Set(allSubs.flatMap((s) => subProjects(s).flatMap(clientsOf)))].sort((a, b) => a.localeCompare(b));

  const goEdit = (r: Seed) => navigate({ to: "/seeds-api/seeds/$seedId", params: { seedId: r.id } });
  // Add seed: the type is picked from the button's menu first, then the form opens.
  const addSeed = (type: "URL" | "API" | "KEYWORD" | "PDP") =>
    navigate({ to: "/seeds-api/seeds/new", search: { type } });

  const q = query.trim().toLowerCase();
  const filtered = allRows.filter((r) =>
    (!fSeedType.length || fSeedType.includes(r.type ?? "")) &&
    (!q || r.d.toLowerCase().includes(q) || (r.value ?? "").toLowerCase().includes(q)) &&
    (!fValue.length || fValue.includes(r.value ?? "")) &&
    (!fStore.length || fStore.includes(r.store)) &&
    (!fCat.length || fCat.includes(r.cat)) &&
    (!fPageType.length || fPageType.includes(r.pageType ?? "")) &&
    (!fDiscoveryKey.length || fDiscoveryKey.includes(r.discoveryKey ?? "")) &&
    (!fKwType.length || fKwType.includes(r.keywordType ?? "")) &&
    (!fBrand.length || fBrand.includes(r.brand ?? "")) &&
    (!fStatus.length || fStatus.includes(r.status ?? "Active")) &&
    (!fSub.length || subSeedSet.has(r.d)) &&
    (!fProject.length || projectSeedSet.has(r.d)) &&
    (!fClient.length || clientSeedSet.has(r.d)),
  );

  // Searchable value filter across all seed types — KEYWORD-seed values are
  // surfaced first (the common pick), then the rest; each group stays alphabetical.
  const keywordValues = new Set(allRows.filter((r) => r.type === "KEYWORD" && r.value).map((r) => r.value as string));
  const allValues = distinct(allRows, (r) => r.value ?? "").filter(Boolean);
  const valueOptions = [
    ...allValues.filter((v) => keywordValues.has(v)),
    ...allValues.filter((v) => !keywordValues.has(v)),
  ];
  const visible = sortRows(filtered, sort, {
    description: (r) => r.d,
    value: (r) => r.value ?? "",
    keywordType: (r) => r.keywordType ?? "",
    brand: (r) => r.brand ?? "",
    pageType: (r) => r.pageType ?? "",
    discoveryKey: (r) => r.discoveryKey ?? "",
    type: (r) => r.type ?? "",
    store: (r) => r.store,
    category: (r) => r.cat,
    status: (r) => r.status ?? "Active",
    createdAt: (r) => r.c,
    updatedAt: (r) => r.u,
    scrapingPlans: (r) => (subsBySeedDesc.get(r.d) ?? []).join(", "),
  });
  const pg = usePagination(visible.length, query);

  // Every seed type is listed together, so each variant column is always shown and
  // each cell renders only the field relevant to that row's seed type ("—" otherwise).
  const cols: Col[] = [
    { key: "d", label: "Description", sortKey: "description", cell: (r) => writableIds.has(r.id) ? <LinkText onClick={() => goEdit(r)}>{r.d}</LinkText> : <span className="text-foreground/90">{r.d}</span> },
  ];
  cols.push({
    key: "type",
    label: "Seed type",
    sortKey: "type",
    // API = orange, URL = blue, Keyword = violet (outlined). KEYWORD is abbreviated
    // to "KW" with the full word on hover (title).
    cell: (r) => {
      if (!r.type) return dash;
      const tone =
        r.type === "API" ? "orange" : r.type === "URL" ? "blue" : r.type === "PDP" ? "green" : "violetOutline";
      const isKw = r.type === "KEYWORD";
      return <Pill tone={tone} title={isKw ? "Keyword" : undefined}>{isKw ? "KW" : r.type}</Pill>;
    },
  });
  cols.push({
    key: "value",
    label: "Value",
    sortKey: "value",
    cell: (r) =>
      r.value ? (
        <span className="block max-w-[160px] truncate text-foreground/80" title={r.value}>{r.value}</span>
      ) : (
        dash
      ),
  });
  cols.push({
    key: "kwt",
    label: "Keyword type",
    sortKey: "keywordType",
    cell: (r) => (r.keywordType ? <Pill tone={r.keywordType === "BRANDED" ? "violet" : "slate"}>{r.keywordType}</Pill> : dash),
  });
  cols.push({
    key: "brand",
    label: "Brand",
    sortKey: "brand",
    // Brand bonds live only on BRANDED keyword seeds; everything else shows "—".
    cell: (r) => (r.brand ? <LinkText>{r.brand}</LinkText> : dash),
  });
  cols.push({
    key: "pt",
    label: "Page type",
    sortKey: "pageType",
    cell: (r) => (r.pageType ? <Pill tone="slate">{r.pageType}</Pill> : dash),
  });
  cols.push({
    key: "dk",
    label: "Discovery key",
    sortKey: "discoveryKey",
    cell: (r) =>
      r.discoveryKey ? (
        <span className="block max-w-[180px] truncate font-mono text-xs text-foreground/80" title={r.discoveryKey}>{r.discoveryKey}</span>
      ) : (
        dash
      ),
  });
  cols.push({ key: "store", label: "Store", sortKey: "store", cell: (r) => <LinkText>{r.store}</LinkText> });
  cols.push({ key: "cat", label: "Category", sortKey: "category", cell: (r) => <span className="text-foreground/80">{r.cat}</span> });
  cols.push({
    key: "subs",
    label: "Scraping Plans",
    sortKey: "scraping plans",
    cell: (r) => <GroupedPills items={subsBySeedDesc.get(r.d) ?? []} noun="scraping plan" tone="slate" />,
  });
  cols.push({ key: "c", label: "Created at", sortKey: "createdAt", cell: (r) => <span className="text-muted-foreground">{r.c}</span> });
  cols.push({ key: "u", label: "Updated at", sortKey: "updatedAt", cell: (r) => <span className="text-muted-foreground">{r.u}</span> });
  cols.push({ key: "status", label: "Status", sortKey: "status", cell: (r) => <StatusCell status={r.status} /> });

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Seeds"
          actionSlot={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-8 gap-1.5">
                  <Plus className="h-4 w-4" />
                  Add seed
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Select seed type</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => addSeed("URL")}>
                  <Pill tone="blue">URL</Pill>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addSeed("API")}>
                  <Pill tone="orange">API</Pill>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addSeed("KEYWORD")}>
                  <Pill tone="violetOutline">Keyword</Pill>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addSeed("PDP")}>
                  <Pill tone="green">PDP</Pill>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />
        <FilterBar search="Search by Seed description" searchValue={query} onSearchChange={setQuery}>
          <FilterChip
            label="Seed type"
            icon={Shapes}
            options={["URL", "API", "KEYWORD", "PDP"]}
            value={fSeedType}
            onChange={setFSeedType}
          />
          <FilterChip
            label="Value"
            options={valueOptions}
            value={fValue}
            onChange={setFValue}
            searchable
            getLabel={(v) => (v.length > 48 ? v.slice(0, 48) + "…" : v)}
          />
          <FilterChip
            label="Scraping Plans"
            icon={Layers}
            options={allSubs.map((s) => s.name)}
            value={fSub}
            onChange={setFSub}
            searchable
          />
          <FilterChip
            label="Projects"
            icon={FolderKanban}
            options={projectFilterOptions}
            value={fProject}
            onChange={setFProject}
            searchable
          />
          <FilterChip
            label="Clients"
            icon={Users}
            options={clientFilterOptions}
            value={fClient}
            onChange={setFClient}
            searchable
          />
          <FilterChip label="Stores" icon={Store} options={distinct(allRows, (r) => r.store)} value={fStore} onChange={setFStore} />
          <FilterChip label="Categories" options={distinct(allRows, (r) => r.cat)} value={fCat} onChange={setFCat} />
          <FilterChip label="Page types" options={PAGE_TYPE_OPTIONS} value={fPageType} onChange={setFPageType} />
          <FilterChip
            label="Discovery key"
            options={distinct(allRows, (r) => r.discoveryKey ?? "").filter(Boolean)}
            value={fDiscoveryKey}
            onChange={setFDiscoveryKey}
            searchable
          />
          <FilterChip label="Keyword type" options={KEYWORD_TYPE_OPTIONS} value={fKwType} onChange={setFKwType} />
          <FilterChip
            label="Brand"
            icon={Tag}
            options={distinct(allRows, (r) => r.brand ?? "").filter(Boolean)}
            value={fBrand}
            onChange={setFBrand}
            searchable
          />
          <FilterChip label="Status" options={SEED_STATUS_OPTIONS} value={fStatus} onChange={setFStatus} />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              {cols.map((c) =>
                c.sortKey ? (
                  <SortTh key={c.key} label={c.label} sortKey={c.sortKey} sort={sort} />
                ) : (
                  <Th key={c.key}>{c.label}</Th>
                ),
              )}
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {pg.slice(visible).map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                {cols.map((c) => (
                  <Td key={c.key}>{c.cell(r)}</Td>
                ))}
                <Td>
                  {writableIds.has(r.id) && (
                    <RowActionsMenu
                      id={r.id}
                      onDelete={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                      entityLabel="seed"
                    />
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={visible.length} page={pg.page} pageSize={pg.pageSize} onPageChange={pg.setPage} onPageSizeChange={pg.setPageSize} />
      </div>
    </AppShell>
  );
}
