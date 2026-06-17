import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { Pill } from "@/components/seeds/ListPrimitives";
import { getClients } from "@/lib/clients";
import { getProjects } from "@/lib/projects";
import { getSubscriptions } from "@/lib/subscriptions";
import { readPersistedList } from "@/lib/seedOptions";
import type { ScrappingOptionValues } from "@/components/seeds/ScrappingOptionDialog";
import { cn } from "@/lib/utils";
import { Users, FolderKanban, Layers, PlayCircle, RotateCcw, Sprout, Repeat, CalendarClock, Calculator } from "lucide-react";

export const Route = createFileRoute("/seeds-api/planner")({
  head: () => ({ meta: [{ title: "Planner View — Shalion" }] }),
  component: PlannerPage,
});

// Placeholder location-set volume — the real per-store location count is TBD.
const LOC_VOLUME_TBD = 10;

// ---- Graph model -----------------------------------------------------------

type NodeKind = "client" | "project" | "subscription" | "scrap";
type GNode = {
  key: string;
  kind: NodeKind;
  title: string;
  go: () => void;
  body: ReactNode;
};

function scrapSummary(o: ScrappingOptionValues): string {
  const parts: string[] = [];
  if (o.multivariants) parts.push("Multivariants");
  if (o.pagination) parts.push(`max_page ${o.maxPage || "—"}`);
  if (o.limitedDiscovery) parts.push(`max_rank ${o.maxRank || "—"}`);
  if (o.modalities && (o.modalityValues ?? []).length) parts.push((o.modalityValues ?? []).join("/"));
  if (o.sorting) parts.push(`?sort=${o.sort}`);
  return parts.join(", ");
}

function PlannerPage() {
  const navigate = useNavigate();

  // Read once on mount — stable references keep the memoised graph + the connector
  // measurement effect from re-running every render (which would loop infinitely).
  const clients = useMemo(() => getClients(), []);
  const projects = useMemo(() => getProjects(), []);
  const subs = useMemo(() => getSubscriptions(), []);
  const scraps = useMemo(() => readPersistedList<ScrappingOptionValues>("seeds-api:scrapping-options"), []);

  // The planner is anchored on configured pipelines: a subscription ties a project
  // to a scrapping option, so the base view = everything reachable from a subscription.
  const projectByName = new Map(projects.map((p) => [p.name, p]));
  const projectById = new Map(projects.map((p) => [p.id, p]));
  const scrapByName = new Map(scraps.map((s) => [s.name, s]));

  const subProjectNames = new Set(subs.map((s) => s.project));
  const baseProjects = projects.filter((p) => subProjectNames.has(p.name));
  const baseProjectIds = new Set(baseProjects.map((p) => p.id));
  const baseClients = clients.filter((c) => (c.assignedProjects ?? []).some((ap) => baseProjectIds.has(ap.projectId)));
  const usedScrapNames = new Set(subs.map((s) => s.scrappingOption));
  const baseScraps = scraps.filter((o) => usedScrapNames.has(o.name));

  // Filters
  const [fClient, setFClient] = useState<string[]>([]);
  const [fProject, setFProject] = useState<string[]>([]);
  const [fSub, setFSub] = useState<string[]>([]);
  const [fSeed, setFSeed] = useState<string[]>([]);
  const [fScrap, setFScrap] = useState<string[]>([]);
  const [fExtraction, setFExtraction] = useState<string[]>([]);
  const hasFilter = fClient.length + fProject.length + fSub.length + fSeed.length + fScrap.length + fExtraction.length > 0;
  const resetFilters = () => { setFClient([]); setFProject([]); setFSub([]); setFSeed([]); setFScrap([]); setFExtraction([]); };

  // Filter option lists
  const seedOptions = [...new Set(subs.flatMap((s) => s.seeds ?? []))].sort((a, b) => a.localeCompare(b));
  const extractionOptions = [...new Set(baseScraps.map((o) => o.extractionType))].sort();

  // Build nodes + edges over the base set.
  const { nodes, edges, byKind } = useMemo(() => {
    const nodes = new Map<string, GNode>();
    const subsCountByProject = new Map<string, number>();
    for (const s of subs) subsCountByProject.set(s.project, (subsCountByProject.get(s.project) ?? 0) + 1);

    for (const c of baseClients) {
      const n = (c.assignedProjects ?? []).filter((ap) => baseProjectIds.has(ap.projectId)).length;
      nodes.set(`c:${c.id}`, {
        key: `c:${c.id}`, kind: "client", title: c.name,
        go: () => navigate({ to: "/clients/$clientId", params: { clientId: c.id } }),
        body: <InfoLine icon={FolderKanban}>{n} project{n === 1 ? "" : "s"}</InfoLine>,
      });
    }
    for (const p of baseProjects) {
      const n = subsCountByProject.get(p.name) ?? 0;
      nodes.set(`p:${p.id}`, {
        key: `p:${p.id}`, kind: "project", title: p.name,
        go: () => navigate({ to: "/seeds-api/projects/$projectId", params: { projectId: p.id } }),
        body: (
          <>
            <InfoLine icon={Layers}>{n} subscription{n === 1 ? "" : "s"}</InfoLine>
            {p.bom && <InfoLine>BoM {p.bom}</InfoLine>}
          </>
        ),
      });
    }
    for (const s of subs) {
      const o = scrapByName.get(s.scrappingOption);
      nodes.set(`s:${s.id}`, {
        key: `s:${s.id}`, kind: "subscription", title: s.name,
        go: () => navigate({ to: "/seeds-api/subscriptions" }),
        body: (
          <div className="space-y-1">
            <InfoLine icon={Sprout}>{(s.seeds ?? []).length} seed{(s.seeds ?? []).length === 1 ? "" : "s"}</InfoLine>
            <div className="flex flex-wrap gap-1">
              {s.frequency && <Pill tone="slate"><CalendarClock className="mr-1 h-3 w-3" />{s.frequency}</Pill>}
              {s.rotation && <Pill tone="slate"><Repeat className="mr-1 h-3 w-3" />{s.rotation}</Pill>}
              {s.geo && s.geo !== "NONE" && <Pill tone="blue">{s.geo}</Pill>}
            </div>
            {o && <InfoLine icon={PlayCircle}>{o.extractionType}</InfoLine>}
            {s.destinationOption && <InfoLine>→ dest: {s.destinationOption}</InfoLine>}
          </div>
        ),
      });
    }
    for (const o of baseScraps) {
      const sum = scrapSummary(o);
      nodes.set(`o:${o.name}`, {
        key: `o:${o.name}`, kind: "scrap", title: o.name,
        go: () => navigate({ to: "/seeds-api/scrapping-options" }),
        body: (
          <div className="space-y-1">
            <Pill tone="amber">{o.extractionType}</Pill>
            {(o.timeframes ?? []).length > 0 && <InfoLine icon={CalendarClock}>{(o.timeframes ?? []).join(", ")}</InfoLine>}
            {sum && <InfoLine>{sum}</InfoLine>}
          </div>
        ),
      });
    }

    const edges: { source: string; target: string }[] = [];
    for (const c of baseClients)
      for (const ap of c.assignedProjects ?? [])
        if (nodes.has(`p:${ap.projectId}`)) edges.push({ source: `c:${c.id}`, target: `p:${ap.projectId}` });
    for (const s of subs) {
      const p = projectByName.get(s.project);
      if (p && nodes.has(`p:${p.id}`)) edges.push({ source: `p:${p.id}`, target: `s:${s.id}` });
      if (scrapByName.has(s.scrappingOption)) edges.push({ source: `s:${s.id}`, target: `o:${s.scrappingOption}` });
    }

    const byKind = (k: NodeKind) => [...nodes.values()].filter((n) => n.kind === k);
    return { nodes, edges, byKind };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, projects, subs, scraps]);

  // Visible subgraph: with no filter, everything; otherwise the connected component(s)
  // of the explicitly-selected nodes (undirected BFS over the relationship edges).
  const visible = useMemo(() => {
    const all = new Set(nodes.keys());
    if (!hasFilter) return all;
    const adj = new Map<string, string[]>();
    for (const e of edges) {
      (adj.get(e.source) ?? adj.set(e.source, []).get(e.source)!).push(e.target);
      (adj.get(e.target) ?? adj.set(e.target, []).get(e.target)!).push(e.source);
    }
    const seeds: string[] = [];
    for (const c of clients) if (fClient.includes(c.name) && nodes.has(`c:${c.id}`)) seeds.push(`c:${c.id}`);
    for (const p of projects) if (fProject.includes(p.name) && nodes.has(`p:${p.id}`)) seeds.push(`p:${p.id}`);
    for (const s of subs) if (fSub.includes(s.name) && nodes.has(`s:${s.id}`)) seeds.push(`s:${s.id}`);
    // Seeds filter → the subscriptions that contain any selected seed.
    if (fSeed.length) for (const s of subs) if ((s.seeds ?? []).some((d) => fSeed.includes(d)) && nodes.has(`s:${s.id}`)) seeds.push(`s:${s.id}`);
    for (const o of baseScraps) if (fScrap.includes(o.name)) seeds.push(`o:${o.name}`);
    // Extraction type filter → scrapping options of the selected type(s).
    if (fExtraction.length) for (const o of baseScraps) if (fExtraction.includes(o.extractionType)) seeds.push(`o:${o.name}`);
    const vis = new Set(seeds);
    const queue = [...seeds];
    while (queue.length) {
      const k = queue.shift()!;
      for (const n of adj.get(k) ?? []) if (!vis.has(n)) { vis.add(n); queue.push(n); }
    }
    return vis;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, hasFilter, fClient, fProject, fSub, fSeed, fScrap, fExtraction]);

  // Task generation estimation over the visible subscriptions.
  // Rule (TBD): tasks ≈ seeds × locations per store, locations = location set volume.
  const visibleSubs = subs.filter((s) => visible.has(`s:${s.id}`));
  const estRows = visibleSubs.map((s) => {
    const seedCount = (s.seeds ?? []).length;
    const usesLoc = s.geo === "MANUAL" && !!s.locationSet;
    const locations = usesLoc ? LOC_VOLUME_TBD : 1;
    return { id: s.id, name: s.name, seeds: seedCount, locations, usesLoc, tasks: seedCount * locations };
  });
  const totalTasks = estRows.reduce((a, r) => a + r.tasks, 0);
  const anyTbd = estRows.some((r) => r.usesLoc);

  const columns: { kind: NodeKind; label: string; icon: typeof Users; tone: string }[] = [
    { kind: "client", label: "Clients", icon: Users, tone: "text-emerald-600" },
    { kind: "project", label: "Projects", icon: FolderKanban, tone: "text-sky-600" },
    { kind: "subscription", label: "Subscriptions", icon: Layers, tone: "text-violet-600" },
    { kind: "scrap", label: "Scrapping options", icon: PlayCircle, tone: "text-amber-600" },
  ];

  // ---- Connector measurement ----
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<Map<string, HTMLElement>>(new Map());
  const [paths, setPaths] = useState<{ id: string; d: string }[]>([]);
  const visKey = [...visible].sort().join("|");

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const wr = wrap.getBoundingClientRect();
      const pos = (key: string) => {
        const el = cardEls.current.get(key);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { lx: r.left - wr.left, rx: r.right - wr.left, my: r.top - wr.top + r.height / 2 };
      };
      const next: { id: string; d: string }[] = [];
      for (const e of edges) {
        if (!visible.has(e.source) || !visible.has(e.target)) continue;
        const a = pos(e.source);
        const b = pos(e.target);
        if (!a || !b) continue;
        const sx = a.rx, sy = a.my, tx = b.lx, ty = b.my;
        const dx = Math.max(40, (tx - sx) / 2);
        next.push({ id: `${e.source}->${e.target}`, d: `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}` });
      }
      // each visible scrapping option feeds the task estimation box
      const estPos = pos("est");
      if (estPos) {
        for (const o of baseScraps) {
          if (!visible.has(`o:${o.name}`)) continue;
          const a = pos(`o:${o.name}`);
          if (!a) continue;
          const sx = a.rx, sy = a.my, tx = estPos.lx, ty = estPos.my;
          const dx = Math.max(40, (tx - sx) / 2);
          next.push({ id: `o:${o.name}->est`, d: `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}` });
        }
      }
      setPaths(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 60);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); clearTimeout(t); };
  }, [edges, visible, visKey]);

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <div>
            <h1 className="text-[17px] font-semibold text-foreground">Planner View</h1>
            <p className="text-sm text-muted-foreground">
              Visual map of the data-extraction setup — clients → projects → subscriptions → scrapping options.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-6 py-4">
          <FilterChip label="Clients" icon={Users} options={baseClients.map((c) => c.name)} value={fClient} onChange={setFClient} searchable />
          <FilterChip label="Projects" icon={FolderKanban} options={baseProjects.map((p) => p.name)} value={fProject} onChange={setFProject} searchable />
          <FilterChip label="Subscriptions" icon={Layers} options={subs.map((s) => s.name)} value={fSub} onChange={setFSub} searchable />
          <FilterChip label="Seeds" icon={Sprout} options={seedOptions} value={fSeed} onChange={setFSeed} searchable />
          <FilterChip label="Scrapping options" icon={PlayCircle} options={baseScraps.map((o) => o.name)} value={fScrap} onChange={setFScrap} searchable />
          <FilterChip label="Extraction type" icon={Calculator} options={extractionOptions} value={fExtraction} onChange={setFExtraction} searchable />
          {hasFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6">
          <div ref={wrapRef} className="relative min-w-max">
            {/* connectors */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
              {paths.map((p) => (
                <path key={p.id} d={p.d} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeOpacity={0.8} />
              ))}
            </svg>

            <div className="relative z-10 flex gap-20">
              {columns.map((col) => {
                const items = byKind(col.kind).filter((n) => visible.has(n.key));
                return (
                  <div key={col.kind} className="w-[230px] shrink-0">
                    <div className="mb-3 flex items-center gap-1.5">
                      <col.icon className={cn("h-4 w-4", col.tone)} />
                      <span className="text-sm font-semibold text-foreground">{col.label}</span>
                      <span className="rounded-full bg-secondary px-1.5 text-[11px] text-muted-foreground">{items.length}</span>
                    </div>
                    <div className="space-y-3">
                      {items.length === 0 && (
                        <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                          Nothing to show
                        </p>
                      )}
                      {items.map((n) => (
                        <button
                          key={n.key}
                          ref={(el) => { if (el) cardEls.current.set(n.key, el); else cardEls.current.delete(n.key); }}
                          type="button"
                          onClick={n.go}
                          title="Open to edit"
                          className="block w-full rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-colors hover:border-primary/50 hover:bg-secondary/40"
                        >
                          <div className="mb-1 truncate text-sm font-medium text-foreground" title={n.title}>{n.title}</div>
                          <div className="text-xs text-muted-foreground">{n.body}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Task generation estimation — the pipeline's output */}
              <div className="w-[300px] shrink-0">
                <div className="mb-3 flex items-center gap-1.5">
                  <Calculator className="h-4 w-4 text-rose-600" />
                  <span className="text-sm font-semibold text-foreground">Task estimation</span>
                </div>
                <div
                  ref={(el) => { if (el) cardEls.current.set("est", el); else cardEls.current.delete("est"); }}
                  className="rounded-lg border border-border bg-card p-4 shadow-sm"
                >
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    A task ≈ <span className="font-medium text-foreground">seeds × locations</span> per store. Locations ={" "}
                    location set volume{" "}
                    <span className="rounded bg-amber-100 px-1 text-[10px] font-medium text-amber-800">TBD</span>.
                  </p>
                  <div className="mt-3 space-y-1.5">
                    {estRows.length === 0 && <p className="text-xs text-muted-foreground">No subscriptions in view.</p>}
                    {estRows.map((r) => (
                      <div key={r.id} className="flex items-center justify-between gap-2 text-xs">
                        <span className="min-w-0 truncate text-foreground/80" title={r.name}>{r.name}</span>
                        <span className="shrink-0 font-mono text-muted-foreground">
                          {r.seeds}×{r.locations}{r.usesLoc ? "*" : ""} = <b className="text-foreground">{r.tasks}</b>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                    <span className="text-xs font-medium text-foreground">Estimated total</span>
                    <span className="text-base font-semibold text-rose-600">{totalTasks.toLocaleString()} tasks</span>
                  </div>
                  {anyTbd && (
                    <p className="mt-2 text-[11px] text-muted-foreground">* assumes {LOC_VOLUME_TBD} locations / set (TBD)</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function InfoLine({ icon: Icon, children }: { icon?: typeof Users; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      <span className="truncate">{children}</span>
    </span>
  );
}
