import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/seeds/ListPrimitives";
import { toast } from "sonner";
import { FlaskConical, PlayCircle, Trash2, Network, TriangleAlert, Sprout, Calculator } from "lucide-react";
import { REAL_JOBS, CLIENT_LABELS, SCENARIO_CLIENTS, type RealJob } from "@/lib/scenarioSeedData";
import { generateForClient, clearSimulated, hasSimulated, estimateTasks, validateScenario, type BuiltScenario } from "@/lib/scenarioGenerator";

export const Route = createFileRoute("/seeds-api/scenario-generator")({
  head: () => ({ meta: [{ title: "Scenario simulator — Shalion" }] }),
  component: ScenarioGeneratorPage,
});

const extTone = (ext: string) =>
  ext === "MEDIA" ? "orange" : ext === "DIGITAL_SHELF_PDP" ? "blue" : ext === "DIGITAL_SHELF_PLP" ? "violet" : ext === "AD" ? "green" : "slate";

function ScenarioGeneratorPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [sel, setSel] = useState<Record<string, Set<string>>>({});
  const [results, setResults] = useState<BuiltScenario[]>([]);
  const [simLive, setSimLive] = useState(false);
  useEffect(() => { setMounted(true); setSimLive(hasSimulated()); }, []);

  const toggle = (slug: string, name: string) =>
    setSel((p) => {
      const s = new Set(p[slug] ?? []);
      s.has(name) ? s.delete(name) : s.add(name);
      return { ...p, [slug]: s };
    });

  const generate = (slug: string) => {
    const jobs = REAL_JOBS[slug] ?? [];
    const chosen = jobs.filter((j) => (sel[slug] ?? new Set()).has(j.name));
    const use = chosen.length ? chosen : jobs; // none ticked → generate all
    const built = generateForClient(slug, use);
    setResults((r) => [built, ...r].slice(0, 6));
    setSimLive(true);
    toast.success(`Generated ${CLIENT_LABELS[slug]}: ${built.subscriptions.length} subscriptions · ${built.scrappingOptions.length} options · ${built.seeds.length} seeds`);
  };

  const generateAll = () => {
    const built = SCENARIO_CLIENTS.map((slug) => generateForClient(slug, REAL_JOBS[slug] ?? []));
    setResults(built);
    setSimLive(true);
    const subs = built.reduce((a, b) => a + b.subscriptions.length, 0);
    toast.success(`Generated all ${built.length} clients · ${subs} subscriptions`);
  };

  const clear = () => {
    const c = clearSimulated();
    setResults([]);
    setSimLive(false);
    setSel({});
    toast.success(`Cleared ${c.subscriptions} subscriptions · ${c.scrappingOptions} options · ${c.seeds} seeds · ${c.projects} projects${c.clients ? ` · ${c.clients} test clients` : ""}`);
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
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Fabricate internally-consistent <strong>client → project → subscription → scrapping option → seeds</strong> scenarios from
              real, recently-updated production Jobs (parsed from <code>ecometry-tasks-api</code>), then review them in the Value Stream Map.
              Cross-references are wired by name so the whole flow resolves.
            </p>
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
            <Button size="sm" className="h-8 gap-1.5" onClick={generateAll}>
              <PlayCircle className="h-4 w-4" /> Generate all 6
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Client pickers */}
            {SCENARIO_CLIENTS.map((slug) => {
              const jobs = REAL_JOBS[slug] ?? [];
              const picked = sel[slug] ?? new Set<string>();
              return (
                <div key={slug} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{CLIENT_LABELS[slug]}</span>
                    <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={() => generate(slug)}>
                      <PlayCircle className="h-3.5 w-3.5" /> Generate {picked.size ? `(${picked.size})` : "all"}
                    </Button>
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
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-6 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Generated this session</h2>
              {results.map((b) => {
                const warns = validateScenario(b);
                const optByName = new Map(b.scrappingOptions.map((o) => [o.name, o]));
                const total = b.subscriptions.reduce((a, s) => a + estimateTasks(s, optByName.get(s.scrappingOption)), 0);
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
                      <Pill tone="slate">{b.scrappingOptions.length} scrapping options</Pill>
                      <Pill tone="green"><Sprout className="mr-1 inline h-3 w-3" />{b.seeds.length} seeds</Pill>
                      {b.clientIsNew && <Pill tone="amber">test client created</Pill>}
                    </div>
                    <div className="mt-2 space-y-0.5">
                      {b.subscriptions.map((s) => (
                        <div key={s.id} className="flex items-center gap-2 text-[11px]">
                          <span className="min-w-0 flex-1 truncate font-mono text-foreground/75">{s.name}</span>
                          {s.destinationOption && <span className="shrink-0 text-violet-600" title={`→ ${s.destinationOption}`}>→ PDP</span>}
                          <span className="shrink-0 tabular-nums text-muted-foreground">{estimateTasks(s, optByName.get(s.scrappingOption))} tasks</span>
                        </div>
                      ))}
                    </div>
                    {warns.length > 0 && (
                      <div className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                        <span className="flex items-center gap-1 font-medium"><TriangleAlert className="h-3.5 w-3.5" /> {warns.length} validation note(s) — gaps the real flow should catch:</span>
                        <ul className="mt-1 list-inside list-disc space-y-0.5">{warns.slice(0, 6).map((w, i) => <li key={i}>{w}</li>)}</ul>
                      </div>
                    )}
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground">
                Open the <button className="font-medium text-[var(--sidebar-active-fg)] hover:underline" onClick={() => navigate({ to: "/seeds-api/planner" })}>Value Stream Map</button> to see them wired Client → Project → Subscription → Scrapping option.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
