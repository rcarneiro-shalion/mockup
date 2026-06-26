import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/seeds/ListPrimitives";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FlaskConical, PlayCircle, Trash2, Network, TriangleAlert, Sprout, Calculator, Search, Check, ChevronsUpDown, Users, Layers, ListFilter, X, Info } from "lucide-react";
import { REAL_JOBS, CLIENT_LABELS, SCENARIO_CLIENTS, type RealJob } from "@/lib/scenarioSeedData";
import { generateForClient, clearSimulated, clearSimulatedForClient, hasSimulated, simulatedSlugs, estimateTasks, validateScenario, extractionToSeedType, pruneInvalidSimProjects, type BuiltScenario } from "@/lib/scenarioGenerator";
import { buildQueryMatch } from "@/lib/textMatch";
import { storeLocationCounts } from "@/lib/retailers";

export const Route = createFileRoute("/seeds-api/scenario-generator")({
  head: () => ({ meta: [{ title: "Scenario simulator — Shalion" }] }),
  component: ScenarioGeneratorPage,
});

// Persisted per-use-case checkbox state: { [clientSlug]: jobName[] }. Kept in sync
// with the simulation so a generated client's ticks survive reloads and clearing
// unticks them.
const SEL_KEY = "seeds-api:sim:checked";

const extTone = (ext: string) =>
  ext === "MEDIA" ? "orange" : ext === "DIGITAL_SHELF_PDP" ? "blue" : ext === "DIGITAL_SHELF_PLP" ? "violet" : ext === "AD" ? "green" : "slate";

type Opt = { value: string; label: string; hint?: string };

/** Searchable multi-select filter (Popover + cmdk). Empty selection = no filter. */
function MultiFilter({ label, icon: Icon, options, selected, onChange, searchPlaceholder }: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  options: Opt[];
  selected: Set<string>;
  onChange: (s: Set<string>) => void;
  searchPlaceholder: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (v: string) => {
    const s = new Set(selected);
    s.has(v) ? s.delete(v) : s.add(v);
    onChange(s);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          {label}
          {selected.size > 0 && (
            <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded bg-[var(--sidebar-active)] px-1 text-[10px] font-semibold text-[var(--sidebar-active-fg)]">{selected.size}</span>
          )}
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No match.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem key={o.value} value={o.label} onSelect={() => toggle(o.value)}>
                  <Check className={cn("mr-2 h-4 w-4", selected.has(o.value) ? "opacity-100" : "opacity-0")} />
                  <span className="flex-1 truncate">{o.label}</span>
                  {o.hint && <span className="ml-2 shrink-0 text-xs text-muted-foreground">{o.hint}</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ScenarioGeneratorPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [sel, setSel] = useState<Record<string, Set<string>>>({});
  const [results, setResults] = useState<BuiltScenario[]>([]);
  const [simLive, setSimLive] = useState(false);
  const [simSlugs, setSimSlugs] = useState<Set<string>>(new Set()); // clients with a live simulated scenario
  useEffect(() => {
    setMounted(true);
    // Sweep any invalid scenario left behind (a desk-test project with no subscription,
    // e.g. from an interrupted generation) so the simulator only ever shows valid
    // client → project → subscription scenarios.
    const pruned = pruneInvalidSimProjects();
    if (pruned) toast.message(`Cleaned ${pruned} incomplete test project${pruned > 1 ? "s" : ""} (no subscription).`);
    setSimLive(hasSimulated());
    setSimSlugs(new Set(simulatedSlugs()));
    // Restore the per-use-case checkbox state persisted from the last generation.
    try {
      const raw = localStorage.getItem(SEL_KEY);
      if (raw) {
        const obj = JSON.parse(raw) as Record<string, string[]>;
        setSel(Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, new Set(v)])));
      }
    } catch { /* ignore */ }
  }, []);

  // Persist the checkbox selection (Sets → arrays) so generated use cases stay
  // ticked across reloads; clearing writes the emptied state back.
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(SEL_KEY, JSON.stringify(Object.fromEntries(Object.entries(sel).map(([k, v]) => [k, [...v]]))));
    } catch { /* ignore */ }
  }, [sel, mounted]);

  // ---- filters
  const [clientFilter, setClientFilter] = useState<Set<string>>(new Set());
  const [extFilter, setExtFilter] = useState<Set<string>>(new Set());
  const [seedFilter, setSeedFilter] = useState<Set<string>>(new Set());
  const [jobQuery, setJobQuery] = useState("");

  const storeLoc = useMemo(() => storeLocationCounts(), []);
  const clientOpts = useMemo<Opt[]>(() => SCENARIO_CLIENTS.map((slug) => ({ value: slug, label: CLIENT_LABELS[slug] ?? slug, hint: String((REAL_JOBS[slug] ?? []).length) })), []);
  const extOpts = useMemo<Opt[]>(() => {
    const s = new Set<string>();
    Object.values(REAL_JOBS).forEach((js) => js.forEach((j) => s.add(j.extractionType)));
    return [...s].sort().map((v) => ({ value: v, label: v.replace("DIGITAL_SHELF_", "") }));
  }, []);
  const seedOpts = useMemo<Opt[]>(() => {
    const s = new Set<string>();
    Object.values(REAL_JOBS).forEach((js) => js.forEach((j) => s.add(extractionToSeedType(j.extractionType))));
    return [...s].sort().map((v) => ({ value: v, label: v }));
  }, []);

  const anyFilter = clientFilter.size > 0 || extFilter.size > 0 || seedFilter.size > 0 || jobQuery.trim().length > 0;
  const clearFilters = () => { setClientFilter(new Set()); setExtFilter(new Set()); setSeedFilter(new Set()); setJobQuery(""); };

  const jobMatch = useMemo(() => buildQueryMatch(jobQuery), [jobQuery]);
  const passesJob = (j: RealJob) =>
    (extFilter.size === 0 || extFilter.has(j.extractionType)) &&
    (seedFilter.size === 0 || seedFilter.has(extractionToSeedType(j.extractionType))) &&
    jobMatch(j.name);

  const visibleClients = useMemo(() =>
    SCENARIO_CLIENTS
      .filter((slug) => clientFilter.size === 0 || clientFilter.has(slug))
      .map((slug) => ({ slug, jobs: (REAL_JOBS[slug] ?? []).filter(passesJob) }))
      .filter((c) => c.jobs.length > 0),
    [clientFilter, extFilter, seedFilter, jobQuery]);
  const visibleJobCount = visibleClients.reduce((a, c) => a + c.jobs.length, 0);

  const toggle = (slug: string, name: string) =>
    setSel((p) => {
      const s = new Set(p[slug] ?? []);
      s.has(name) ? s.delete(name) : s.add(name);
      return { ...p, [slug]: s };
    });

  const runClient = (slug: string, jobs: RealJob[]) => {
    const chosen = jobs.filter((j) => (sel[slug] ?? new Set()).has(j.name));
    const use = chosen.length ? chosen : jobs; // none ticked → generate all (filtered) jobs
    const built = generateForClient(slug, use);
    setResults((r) => [built, ...r.filter((x) => x.project.id !== built.project.id)].slice(0, 18));
    setSel((p) => ({ ...p, [slug]: new Set(use.map((j) => j.name)) }));
    setSimLive(true);
    setSimSlugs((s) => { const n = new Set(s); n.add(slug); return n; });
    toast.success(`Generated ${CLIENT_LABELS[slug]}: ${built.subscriptions.length} subscriptions · ${built.scrappingOptions.length} options · ${built.seeds.length} seeds`);
  };

  // "Generate all" spans every visible client, so it uses a lighter seed volume per
  // subscription than a single-client run (which keeps the deep SEEDS_PER_SUB) — this
  // keeps the whole batch well under the localStorage budget. It is also resilient:
  // each client is generated independently so one failure (e.g. storage limit) can't
  // abort the rest, and the use-case checkboxes tick for every client that succeeded.
  const GEN_ALL_SEEDS_PER_SUB = 30;
  const generateAll = () => {
    if (!visibleClients.length) return;
    const built: BuiltScenario[] = [];
    const failed: string[] = [];
    for (const c of visibleClients) {
      try {
        built.push(generateForClient(c.slug, c.jobs, GEN_ALL_SEEDS_PER_SUB));
      } catch {
        failed.push(c.slug);
      }
    }
    if (built.length) {
      const okSlugs = new Set(built.map((b) => b.slug));
      setResults(built.slice(0, 18));
      // Tick the use-case checkboxes for every client that generated (merge, like runClient).
      setSel((prev) => {
        const next = { ...prev };
        for (const c of visibleClients) if (okSlugs.has(c.slug)) next[c.slug] = new Set(c.jobs.map((j) => j.name));
        return next;
      });
      setSimLive(true);
      setSimSlugs(new Set(simulatedSlugs()));
    }
    const subs = built.reduce((a, b) => a + b.subscriptions.length, 0);
    if (failed.length) {
      toast.error(`Generated ${built.length} of ${visibleClients.length} client(s) · ${subs} subscriptions. ${failed.length} hit the storage limit — Clear simulated, or filter to fewer clients, then retry.`);
    } else {
      toast.success(`Generated ${built.length} client(s) · ${subs} subscriptions`);
    }
  };

  const clear = () => {
    const c = clearSimulated();
    setResults([]);
    setSimLive(false);
    setSimSlugs(new Set());
    setSel({});
    toast.success(`Cleared ${c.subscriptions} subscriptions · ${c.scrappingOptions} options · ${c.seeds} seeds · ${c.projects} projects${c.clients ? ` · ${c.clients} test clients` : ""}`);
  };

  // Clear only one client's simulated scenario (per-card).
  const clearOne = (slug: string) => {
    const c = clearSimulatedForClient(slug);
    setResults((r) => r.filter((x) => x.slug !== slug));
    setSimSlugs((s) => { const n = new Set(s); n.delete(slug); return n; });
    setSimLive(hasSimulated());
    setSel((p) => { const n = { ...p }; delete n[slug]; return n; }); // untick this client's use cases
    toast.success(`Cleared ${CLIENT_LABELS[slug] ?? slug}: ${c.subscriptions} subscriptions · ${c.scrappingOptions} options · ${c.seeds} seeds`);
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 px-6 pt-5">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Scenario simulator</h1>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">desk-test</span>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" aria-label="About the scenario simulator" className="grid h-5 w-5 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start" className="max-w-sm text-xs leading-relaxed">
                    Fabricate internally-consistent client → project → subscription → scraping option → seeds scenarios from real production Jobs (ecometry-tasks-api), with real seeds and real store locations, then review them in the Value Stream Map. Cross-references are wired by name so the whole flow resolves.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => navigate({ to: "/seeds-api/planner" })}>
              <Network className="h-4 w-4" /> Value Stream Map
            </Button>
            {mounted && simLive && (
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-destructive" onClick={clear}>
                <Trash2 className="h-4 w-4" /> Clear simulated
              </Button>
            )}
            <Button size="sm" className="h-8 gap-1.5" onClick={generateAll} disabled={!visibleClients.length}>
              <PlayCircle className="h-4 w-4" /> Generate all {visibleClients.length}
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
          <div className="relative w-[260px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={jobQuery}
              onChange={(e) => setJobQuery(e.target.value)}
              placeholder="Search subscription (% wildcard)"
              className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <MultiFilter label="Clients" icon={Users} options={clientOpts} selected={clientFilter} onChange={setClientFilter} searchPlaceholder="Search client…" />
          <MultiFilter label="Extraction type" icon={Layers} options={extOpts} selected={extFilter} onChange={setExtFilter} searchPlaceholder="Search extraction type…" />
          <MultiFilter label="Seed type" icon={Sprout} options={seedOpts} selected={seedFilter} onChange={setSeedFilter} searchPlaceholder="Search seed type…" />
          <span className="ml-1 text-xs text-muted-foreground">
            <ListFilter className="mr-1 inline h-3.5 w-3.5" />{visibleClients.length}/{SCENARIO_CLIENTS.length} clients · {visibleJobCount} jobs
          </span>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground" onClick={clearFilters} disabled={!anyFilter}>
            <X className="h-3.5 w-3.5" /> Clear filters
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Client pickers (filtered) */}
            {visibleClients.map(({ slug, jobs }) => {
              const picked = sel[slug] ?? new Set<string>();
              const pickedVisible = jobs.filter((j) => picked.has(j.name)).length;
              return (
                <div key={slug} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-sm font-semibold text-foreground">{CLIENT_LABELS[slug]} <span className="text-xs font-normal text-muted-foreground">· {jobs.length} jobs</span></span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {mounted && simSlugs.has(slug) && (
                        <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs text-destructive" onClick={() => clearOne(slug)}>
                          <Trash2 className="h-3.5 w-3.5" /> Clear simulated
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={() => runClient(slug, jobs)}>
                        <PlayCircle className="h-3.5 w-3.5" /> Generate {pickedVisible ? `(${pickedVisible})` : "all"}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {jobs.map((j: RealJob) => (
                      <label key={j.name} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-secondary/40">
                        <input type="checkbox" checked={picked.has(j.name)} onChange={() => toggle(slug, j.name)} className="h-3.5 w-3.5 rounded border-border" />
                        <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground/80" title={j.name}>{j.name}</span>
                        <Pill tone={extTone(j.extractionType)}>{j.extractionType.replace("DIGITAL_SHELF_", "")}</Pill>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{j.geolocMode} · {j.businessUnit || "—"}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
            {!visibleClients.length && (
              <div className="col-span-full rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                No jobs match the current filters. <button onClick={clearFilters} className="font-medium text-[var(--sidebar-active-fg)] hover:underline">Clear filters</button>
              </div>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-6 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Generated this session</h2>
              {results.map((b) => {
                const warns = validateScenario(b);
                const optByName = new Map(b.scrappingOptions.map((o) => [o.name, o]));
                const total = b.subscriptions.reduce((a, s) => a + estimateTasks(s, optByName.get(s.scrappingOption), storeLoc.get(s.store)), 0);
                return (
                  <div key={b.project.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{b.client.name} <span className="text-muted-foreground">· {b.project.name}</span></span>
                      <span className="flex items-center gap-1.5 text-sm">
                        <Calculator className="h-4 w-4 text-rose-600" />
                        <span className="font-semibold text-rose-600">{total.toLocaleString()} tasks</span>
                        <span className="text-xs text-muted-foreground">est.</span>
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <Pill tone="slate">{b.subscriptions.length} subscriptions</Pill>
                      <Pill tone="slate">{b.scrappingOptions.length} scraping options</Pill>
                      <Pill tone="green"><Sprout className="mr-1 inline h-3 w-3" />{b.seeds.length} seeds</Pill>
                      {b.clientIsNew && <Pill tone="amber">test client created</Pill>}
                    </div>
                    <div className="mt-2 space-y-0.5">
                      {b.subscriptions.map((s) => (
                        <div key={s.id} className="flex items-center gap-2 text-[11px]">
                          <span className="min-w-0 flex-1 truncate font-mono text-foreground/75">{s.name}</span>
                          {s.locationSet && <span className="shrink-0 text-muted-foreground" title={s.locationSet}>📍 {s.locationSet.replace(/ — .*/, "")}</span>}
                          {(s.destinationOptions?.length ?? 0) > 0 && <span className="shrink-0 text-violet-600" title={`→ ${s.destinationOptions!.join(", ")}`}>→ PDP</span>}
                          <span className="shrink-0 tabular-nums text-muted-foreground">{estimateTasks(s, optByName.get(s.scrappingOption), storeLoc.get(s.store)).toLocaleString()} tasks</span>
                        </div>
                      ))}
                    </div>
                    {warns.length > 0 && (
                      <div className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                        <span className="flex items-center gap-1 font-medium"><TriangleAlert className="h-3.5 w-3.5" /> {warns.length} validation note(s) — real-data gaps the flow should catch:</span>
                        <ul className="mt-1 list-inside list-disc space-y-0.5">{warns.slice(0, 6).map((w, i) => <li key={i}>{w}</li>)}</ul>
                      </div>
                    )}
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground">
                Open the <button className="font-medium text-[var(--sidebar-active-fg)] hover:underline" onClick={() => navigate({ to: "/seeds-api/planner" })}>Value Stream Map</button> to see them wired Client → Project → Subscription → Scraping option.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
