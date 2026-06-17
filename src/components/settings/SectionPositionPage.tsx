import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { usePersistentState } from "@/hooks/usePersistentState";
import { Pill } from "@/components/seeds/ListPrimitives";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  GripVertical,
  Plus,
  X,
  Store,
  Building2,
  Layers,
  Tags,
  PlugZap,
  Loader2,
  Rocket,
  FlaskConical,
  RotateCcw,
  TriangleAlert,
  Copy,
  Undo2,
} from "lucide-react";
import { FilterChip } from "@/components/seeds/FilterChip";
import { LABEL_COLOR_CLASSES, SEED_RETAILER_LABELS, labelForRetailer, type RetailerLabel } from "@/lib/retailerLabels";
import { getDashboardApps } from "@/lib/dashboardApps";
import { fetchSectionPositions, mutateLive } from "@/lib/api/live.functions";
import { getDevTokens } from "@/lib/devTokens";
import {
  POSITION_TARGETS,
  SECTION_POSITIONS_KEY,
  SEED_POSITIONS,
  posKey,
  type PosTarget,
  type PosTargetKind,
  type PositionMap,
} from "@/lib/dashboardSectionPositions";

/** Short app code (uppercased slug, e.g. RMMS / DSM), falling back to initials. */
const appShortOf = (a: { slug?: string; label: string }) =>
  (a.slug?.trim() || a.label.split(/\s+/).filter(Boolean).map((w) => w[0]).join("")).toUpperCase();

type CatalogSection = { id: string; path: string; label: string; type: string; appId: string; appLabel: string; appShort: string; group: string };

/** Live bundle for one kind (agency = retailers, brand = datagroups). */
type LiveBundle = {
  targets: PosTarget[];
  sections: CatalogSection[];
  /** posKey(appId, targetId) → ordered section ids (by live `position`). */
  orderMap: Record<string, string[]>;
  /** targetId → highest `position` in use (global across apps; for safe appends). */
  maxPos: Record<string, number>;
};
const kindKeyOf = (k: PosTargetKind): "agency" | "brand" => (k === "retailer" ? "agency" : "brand");

// The live insert/delete endpoints (already allow-listed for POST/DELETE in the proxy).
const EP = {
  retailer: "/v1.0/admin/retailer-dashboardsections",
  datagroup: "/v1.0/admin/datagroup-dashboardsections",
} as const;
const ID_FIELD = { retailer: "retailerId", datagroup: "dataGroupId" } as const;

type ReplicateItem = { targetId: string; name: string; toAdd: string[]; already: number };
type ReplicatePlan = { appLabel: string; sourceName: string; items: ReplicateItem[]; totalAdds: number; targetCount: number };

export function SectionPositionPage() {
  const [positions, setPositions] = usePersistentState<PositionMap>(SECTION_POSITIONS_KEY, SEED_POSITIONS);

  // --- live connect ----------------------------------------------------------
  const [token, setToken] = usePersistentState<string>("shalion:devToken", "");
  const [idToken, setIdToken] = usePersistentState<string>("shalion:devIdToken", "");
  const [liveEnv, setLiveEnv] = usePersistentState<"prod" | "develop">("mu:env", "prod");
  const [loadedEnv, setLoadedEnv] = useState<"prod" | "develop" | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [draftA, setDraftA] = useState("");
  const [draftI, setDraftI] = useState("");
  const [bundles, setBundles] = useState<Partial<Record<"agency" | "brand", LiveBundle>>>({});
  const live = loadedEnv !== null;

  const [kind, setKind] = useState<PosTargetKind>("retailer");
  const bundle = live ? bundles[kindKeyOf(kind)] : undefined;

  // Local section catalogue (every app's groups → sections) for local mode.
  const localCatalog = useMemo<CatalogSection[]>(() => {
    const out: CatalogSection[] = [];
    for (const a of getDashboardApps())
      for (const g of a.groups)
        for (const s of g.sections)
          out.push({ id: s.id, path: s.path, label: s.label, type: s.type, appId: a.id, appLabel: a.label, appShort: appShortOf(a), group: g.label });
    return out;
  }, []);

  // Catalog + targets switch between local mockup and the live bundle.
  const catalog = live && bundle ? bundle.sections : localCatalog;
  const byId = useMemo(() => new Map(catalog.map((s) => [s.id, s])), [catalog]);

  // Applications that actually have sections to order (label-sorted when live).
  const appOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const s of catalog) if (!seen.has(s.appId)) seen.set(s.appId, s.appLabel);
    const list = [...seen.entries()];
    return live ? list.sort((a, b) => a[1].localeCompare(b[1])) : list;
  }, [catalog, live]);

  const [appId, setAppId] = useState<string>(() => (localCatalog.some((s) => s.appId === "rmms") ? "rmms" : localCatalog[0]?.appId ?? ""));
  const targetsOfKind = useMemo<PosTarget[]>(
    () => (live && bundle ? bundle.targets : POSITION_TARGETS.filter((t) => t.kind === kind)),
    [live, bundle, kind],
  );
  const [targetId, setTargetId] = useState<string>(() => POSITION_TARGETS.find((t) => t.kind === "retailer")?.id ?? "");
  const [applyTargets, setApplyTargets] = useState<string[]>([]);
  // Facet filters — same shape as the relationship map: a per-entity filter
  // (Retailers / Clients) plus, for retailers, a Label filter over every label.
  const [retailerLabels] = usePersistentState<RetailerLabel[]>("mu:retailer-labels:v4", SEED_RETAILER_LABELS);
  const [fRetailers, setFRetailers] = useState<string[]>([]);
  const [fLabels, setFLabels] = useState<string[]>([]);
  const [fClients, setFClients] = useState<string[]>([]);
  const target = targetsOfKind.find((t) => t.id === targetId) ?? null;

  // --- live replicate (safe write) -------------------------------------------
  const [confirmPlan, setConfirmPlan] = useState<ReplicatePlan | null>(null);
  const [writing, setWriting] = useState(false);
  const [writeProgress, setWriteProgress] = useState<{ done: number; total: number } | null>(null);
  const [lastCreated, setLastCreated] = useState<{ recordId: string }[]>([]);

  // Keep the app / target selections valid as the data source changes (live load,
  // kind switch). Falls back to the first available option.
  useEffect(() => {
    if (appOptions.length && !appOptions.some(([id]) => id === appId)) setAppId(appOptions[0][0]);
  }, [appOptions, appId]);
  useEffect(() => {
    if (!targetsOfKind.some((t) => t.id === targetId)) setTargetId(targetsOfKind[0]?.id ?? "");
  }, [targetsOfKind, targetId]);

  // --- live loading ----------------------------------------------------------
  const buildBundle = (res: Awaited<ReturnType<typeof fetchSectionPositions>>): LiveBundle => {
    const sections: CatalogSection[] = res.sections.map((s) => ({
      id: s.id,
      path: s.path,
      label: s.label,
      type: s.type,
      appId: s.appId,
      appLabel: s.appLabel,
      appShort: appShortOf({ slug: s.appSlug, label: s.appLabel }),
      group: s.group,
    }));
    const grouped: Record<string, { sectionId: string; position: number }[]> = {};
    const maxPos: Record<string, number> = {};
    for (const a of res.assignments) {
      const k = posKey(a.appId, a.targetId);
      (grouped[k] ||= []).push({ sectionId: a.sectionId, position: a.position });
      if (a.position > (maxPos[a.targetId] ?? 0)) maxPos[a.targetId] = a.position;
    }
    const orderMap: Record<string, string[]> = {};
    for (const k of Object.keys(grouped))
      orderMap[k] = grouped[k].sort((x, y) => x.position - y.position).map((x) => x.sectionId);
    return { targets: res.targets.map((t) => ({ id: t.id, kind, name: t.name, client: t.client })), sections, orderMap, maxPos };
  };

  const loadKind = async (k: PosTargetKind, env: "prod" | "develop", a: string, i: string): Promise<LiveBundle | null> => {
    const res = await fetchSectionPositions({ data: { kind: kindKeyOf(k), env, token: a, idToken: i } });
    if (!res.ok) {
      toast.error(res.error || `Couldn't load section positions from ${env}.`);
      return null;
    }
    const b = buildBundle(res);
    const noun = k === "retailer" ? "retailers" : "datagroups";
    toast.success(`Live (${env}): ${b.targets.length} ${noun} · ${b.sections.length} sections.${res.complete ? "" : " (partial — reconnect to retry)"}`);
    return b;
  };

  const connectLive = async (env: "prod" | "develop"): Promise<boolean> => {
    const saved = getDevTokens();
    const a = (draftA || token || saved.token).trim();
    const i = (draftI || idToken || saved.idToken).trim();
    if (a && a !== token) setToken(a);
    if (i && i !== idToken) setIdToken(i);
    if (!a || !i) {
      setShowConnect(true);
      toast.error("Both an access token and an id token are required.");
      return false;
    }
    setConnecting(true);
    try {
      const b = await loadKind(kind, env, a, i);
      if (!b) return false;
      setBundles({ [kindKeyOf(kind)]: b });
      setLoadedEnv(env);
      setShowConnect(false);
      return true;
    } catch (e) {
      toast.error(`Couldn't connect to ${env}: ${(e as Error).message}`);
      return false;
    } finally {
      setConnecting(false);
    }
  };

  const onEnvChange = (next: "prod" | "develop") => {
    if (next === liveEnv && live) return;
    setLiveEnv(next);
    const saved = getDevTokens();
    const haveTokens = !!((token || saved.token) && (idToken || saved.idToken));
    if (!live && !haveTokens) {
      setShowConnect(true);
      return;
    }
    void connectLive(next).then((ok) => {
      if (ok) return;
      setLoadedEnv(null);
      setBundles({});
      setShowConnect(true);
      toast.error(
        next === "develop"
          ? "Couldn't connect to develop — it's a separate environment needing a develop token + VPN (a prod token won't work there)."
          : "Couldn't connect to production — paste a fresh token.",
      );
    });
  };

  // Lazy-load the other kind's bundle the first time it's viewed while live.
  useEffect(() => {
    if (!live || !loadedEnv || bundle || connecting) return;
    const saved = getDevTokens();
    const a = token || saved.token;
    const i = idToken || saved.idToken;
    if (!a || !i) return;
    let cancelled = false;
    setConnecting(true);
    loadKind(kind, loadedEnv, a, i)
      .then((b) => {
        if (!cancelled && b) setBundles((prev) => ({ ...prev, [kindKeyOf(kind)]: b }));
      })
      .finally(() => !cancelled && setConnecting(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, loadedEnv, kind]);

  // Auto-connect on open when tokens are already saved (top-bar 🔑), same as the
  // Section editor — so live data loads without a manual connect.
  const autoTried = useRef(false);
  useEffect(() => {
    if (autoTried.current) return;
    autoTried.current = true;
    const { token: t, idToken: i } = getDevTokens();
    if (t && i) void connectLive(liveEnv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disconnect = () => {
    setLoadedEnv(null);
    setBundles({});
    setLastCreated([]);
  };

  const switchKind = (k: PosTargetKind) => {
    if (k === kind) return;
    setKind(k);
    if (!live) setTargetId(POSITION_TARGETS.find((t) => t.kind === k)?.id ?? "");
    setApplyTargets([]);
    setFRetailers([]);
    setFLabels([]);
    setFClients([]);
    setLastCreated([]);
  };

  // Order for the selected application + target. When live, the real order comes
  // from `position`; a local edit (drag/add/remove) overlays it (kept in
  // localStorage, NOT written back to prod). When local, it's purely local.
  const key = target ? posKey(appId, target.id) : "";
  const liveDefault = live && bundle && target ? bundle.orderMap[key] ?? [] : [];
  const hasOverride = !!target && key in positions;
  const order = (target && positions[key]) || liveDefault;
  const setOrder = (next: string[]) => {
    if (!target) return;
    setPositions((prev) => ({ ...prev, [key]: next }));
  };
  const resetToLive = () => {
    if (!target) return;
    setPositions((prev) => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
    toast.success("Reverted to the live order.");
  };
  const move = (from: number, to: number) => {
    if (from === to) return;
    const a = [...order];
    const [x] = a.splice(from, 1);
    a.splice(to, 0, x);
    setOrder(a);
  };
  const removeAt = (secId: string) => setOrder(order.filter((id) => id !== secId));
  const addSection = (secId: string) => {
    if (!order.includes(secId)) setOrder([...order, secId]);
  };

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // Add-section options: this application's sections not already in the order.
  const available = catalog.filter((s) => s.appId === appId && !order.includes(s.id));

  const targetLabel = (t: PosTarget) => (t.client ? `${t.client} · ${t.name}` : t.name);
  const kindLabel = kind === "retailer" ? "retailer" : "datagroup";

  // Bulk-apply target list, narrowed by the active facets (relationship-map style).
  const labelOf = (name: string) => labelForRetailer(retailerLabels, name);
  const retSet = useMemo(() => new Set(fRetailers), [fRetailers]);
  const filteredTargets = targetsOfKind.filter((t) =>
    kind === "retailer"
      ? (!fRetailers.length || retSet.has(t.id)) && (!fLabels.length || fLabels.includes(labelOf(t.name).id))
      : !fClients.length || (!!t.client && fClients.includes(t.client)),
  );
  // Labels: every defined label (matches the relationship map), not just present ones.
  const labelOptions = retailerLabels.map((l) => l.id);
  const clientOptions = [...new Set(targetsOfKind.filter((t) => t.client).map((t) => t.client as string))].sort((a, b) => a.localeCompare(b));

  // Bulk apply: copy the current (app) order onto every selected target.
  const allSelected = filteredTargets.length > 0 && filteredTargets.every((t) => applyTargets.includes(t.id));
  const toggleAll = () => {
    const ids = filteredTargets.map((t) => t.id);
    setApplyTargets((prev) => (allSelected ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]));
  };
  const toggleApply = (id: string) =>
    setApplyTargets((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // LOCAL apply (mockup mode): copy the order onto each selected target's overlay.
  const applyToAllLocal = () => {
    if (!applyTargets.length) return;
    setPositions((prev) => {
      const next = { ...prev };
      for (const id of applyTargets) next[posKey(appId, id)] = [...order];
      return next;
    });
    toast.success(`Applied this order to ${applyTargets.length} ${kindLabel}${applyTargets.length === 1 ? "" : "s"}.`);
  };

  // LIVE replicate: additive — for each selected target, add the source's sections
  // it is MISSING, in source order, appended at a free position. Never deletes or
  // reorders existing assignments (the unique constraint is on (target, position)).
  const buildPlan = (): ReplicatePlan | null => {
    if (!live || !bundle || !target) return null;
    const src = order;
    const items: ReplicateItem[] = [];
    let totalAdds = 0;
    for (const tId of applyTargets) {
      if (tId === target.id) continue; // the source itself
      const existing = new Set(bundle.orderMap[posKey(appId, tId)] ?? []);
      const toAdd = src.filter((sid) => !existing.has(sid));
      totalAdds += toAdd.length;
      items.push({ targetId: tId, name: targetsOfKind.find((t) => t.id === tId)?.name ?? tId, toAdd, already: src.length - toAdd.length });
    }
    if (!items.length) return null;
    return { appLabel: byId.get(src[0])?.appLabel ?? "this app", sourceName: targetLabel(target), items, totalAdds, targetCount: items.length };
  };

  const runReplicate = async (plan: ReplicatePlan) => {
    if (!bundle || !loadedEnv) return;
    setWriting(true);
    setConfirmPlan(null);
    const saved = getDevTokens();
    const tok = token || saved.token;
    const idt = idToken || saved.idToken;
    const ep = EP[kind];
    const idField = ID_FIELD[kind];
    const created: { recordId: string }[] = [];
    let added = 0;
    let failed = 0;
    const nextOrderMap = { ...bundle.orderMap };
    const nextMax = { ...bundle.maxPos };
    setWriteProgress({ done: 0, total: plan.totalAdds });
    let done = 0;
    for (const item of plan.items) {
      let pos = (nextMax[item.targetId] ?? 0) + 1;
      for (const sid of item.toAdd) {
        let ok = false;
        let tries = 0;
        let lastErr = "";
        while (!ok && tries < 40) {
          const res = await mutateLive({
            data: {
              service: "visualization",
              env: loadedEnv,
              method: "POST",
              path: ep,
              body: { [idField]: item.targetId, dashboardSectionId: sid, position: pos },
              token: tok || undefined,
              idToken: idt || undefined,
            },
          });
          if (res.ok) {
            ok = true;
            const recId = (res.data as { id?: string } | null)?.id;
            if (recId) created.push({ recordId: recId });
            added++;
            nextMax[item.targetId] = pos;
            const k2 = posKey(appId, item.targetId);
            nextOrderMap[k2] = [...(nextOrderMap[k2] ?? []), sid];
          } else if (res.status === 409) {
            pos++; // (target, position) taken — try the next slot
            tries++;
            lastErr = res.error || "position conflict";
          } else {
            lastErr = res.error || `status ${res.status}`;
            break;
          }
        }
        if (!ok) failed++;
        done++;
        setWriteProgress({ done, total: plan.totalAdds });
      }
    }
    setBundles((prev) => ({ ...prev, [kindKeyOf(kind)]: { ...bundle, orderMap: nextOrderMap, maxPos: nextMax } }));
    setLastCreated(created);
    setApplyTargets([]);
    setWriting(false);
    setWriteProgress(null);
    if (failed) toast.warning(`Replicated to ${plan.targetCount} ${kindLabel}s: +${added} added, ${failed} failed. ${created.length} undoable.`);
    else toast.success(`Replicated ${plan.sourceName}'s order to ${plan.targetCount} ${kindLabel}s: +${added} section assignments. Undo available.`);
  };

  const undoReplicate = async () => {
    if (!lastCreated.length || !loadedEnv) return;
    setWriting(true);
    const saved = getDevTokens();
    const tok = token || saved.token;
    const idt = idToken || saved.idToken;
    const ep = EP[kind];
    let removed = 0;
    let failed = 0;
    setWriteProgress({ done: 0, total: lastCreated.length });
    for (let n = 0; n < lastCreated.length; n++) {
      const res = await mutateLive({
        data: { service: "visualization", env: loadedEnv, method: "DELETE", path: `${ep}/${lastCreated[n].recordId}`, token: tok || undefined, idToken: idt || undefined },
      });
      if (res.ok) removed++;
      else failed++;
      setWriteProgress({ done: n + 1, total: lastCreated.length });
    }
    setLastCreated([]);
    setWriting(false);
    setWriteProgress(null);
    toast.success(`Undo: removed ${removed}${failed ? `, ${failed} failed` : ""}. Reconnect to refresh exact order.`);
  };

  const onApply = () => {
    if (!applyTargets.length) return;
    if (live) {
      const plan = buildPlan();
      if (!plan) {
        toast.info("Nothing to add — the selected targets already have every section in this order.");
        return;
      }
      setConfirmPlan(plan);
    } else {
      applyToAllLocal();
    }
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 px-6 pt-5">
          <div>
            <Link
              to="/settings/dashboard-applications"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Dashboard applications
            </Link>
            <div className="mt-1 flex items-center gap-2">
              <Layers className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Section position</h1>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Order the dashboard sections of a retailer or datagroup. The order here is the position the client sees
              their sections in, in the dashboard.{" "}
              {live && <span className="text-foreground/70">Drag/add edits stay local; the bulk panel can replicate this order to other {kindLabel}s live.</span>}
            </p>
          </div>
          {/* Live connect controls */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-md border border-border bg-secondary/40 p-0.5 text-xs" title="Environment for live load + replicate">
              <button
                type="button"
                onClick={() => onEnvChange("develop")}
                className={cn("flex items-center gap-1 rounded px-2 py-1", liveEnv === "develop" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <FlaskConical className="h-3.5 w-3.5" /> Dev
              </button>
              <button
                type="button"
                onClick={() => onEnvChange("prod")}
                className={cn("flex items-center gap-1 rounded px-2 py-1", liveEnv === "prod" ? "bg-rose-600 font-medium text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <Rocket className="h-3.5 w-3.5" /> Prod
              </button>
            </div>
            {live ? (
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={disconnect}>
                <PlugZap className="h-4 w-4 text-emerald-600" /> Live ({loadedEnv}) · disconnect
              </Button>
            ) : connecting ? (
              <Button variant="outline" size="sm" className="h-8 gap-1.5" disabled>
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setShowConnect((s) => !s)}>
                <PlugZap className="h-4 w-4" /> Connect live
              </Button>
            )}
          </div>
        </div>

        {/* Live connect panel */}
        {showConnect && !live && (
          <div className="mx-6 mt-3 rounded-lg border border-border bg-card p-3 shadow-sm">
            <p className="mb-2 text-xs text-muted-foreground">
              Load the <strong>real retailers / datagroups</strong> and their dashboard section order from the Visualization
              API ({liveEnv}) via the server proxy.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="password"
                value={draftA}
                onChange={(e) => setDraftA(e.target.value)}
                placeholder="Authorization bearer token"
                className="h-8 min-w-[220px] flex-1 rounded-md border border-border bg-background px-2.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <input
                type="password"
                value={draftI}
                onChange={(e) => setDraftI(e.target.value)}
                placeholder="x-id-token"
                className="h-8 min-w-[220px] flex-1 rounded-md border border-border bg-background px-2.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button size="sm" className="h-8" onClick={() => void connectLive(liveEnv)} disabled={connecting}>
                {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
              </Button>
            </div>
          </div>
        )}

        {/* Application + target selector */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-4">
          <select
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            title="Dashboard application"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {appOptions.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-0.5 rounded-md border border-border bg-secondary/40 p-0.5 text-sm">
            <button
              type="button"
              onClick={() => switchKind("retailer")}
              className={cn("flex items-center gap-1.5 rounded px-2.5 py-1", kind === "retailer" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <Store className="h-3.5 w-3.5" /> Retailer
            </button>
            <button
              type="button"
              onClick={() => switchKind("datagroup")}
              className={cn("flex items-center gap-1.5 rounded px-2.5 py-1", kind === "datagroup" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <Building2 className="h-3.5 w-3.5" /> Datagroup
            </button>
          </div>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="h-9 min-w-[240px] max-w-[320px] rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {targetsOfKind.map((t) => (
              <option key={t.id} value={t.id}>
                {targetLabel(t)}
              </option>
            ))}
          </select>
          {live && <Pill tone="green">{targetsOfKind.length} live {kindLabel}s</Pill>}
          <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            {hasOverride && live && (
              <button type="button" onClick={resetToLive} className="inline-flex items-center gap-1 font-medium text-foreground/70 hover:text-foreground">
                <RotateCcw className="h-3.5 w-3.5" /> Reset to live order
              </button>
            )}
            {order.length} section{order.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Ordered section list */}
        <div className="min-h-0 flex-1 overflow-auto px-6 pb-6">
          <div className="mx-auto max-w-3xl space-y-2">
            {connecting && order.length === 0 && (
              <p className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading live data…
              </p>
            )}
            {!connecting && order.length === 0 && (
              <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No sections assigned to {target ? targetLabel(target) : "this target"} for this application yet. Add one below.
              </p>
            )}
            {order.map((secId, i) => {
              const s = byId.get(secId);
              return (
                <div
                  key={secId}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (overIdx !== i) setOverIdx(i);
                  }}
                  onDrop={() => {
                    if (dragIdx !== null) move(dragIdx, i);
                    setDragIdx(null);
                    setOverIdx(null);
                  }}
                  onDragEnd={() => {
                    setDragIdx(null);
                    setOverIdx(null);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm transition-colors",
                    dragIdx === i && "opacity-40",
                    overIdx === i && dragIdx !== null && dragIdx !== i && "border-primary ring-1 ring-primary",
                  )}
                >
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" />
                  <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                  {s ? (
                    <>
                      <span className="truncate font-mono text-sm text-foreground" title={s.path}>{s.path}</span>
                      <Pill tone="slate">{s.group}</Pill>
                      <Pill tone="amber">{s.appShort}</Pill>
                    </>
                  ) : (
                    <span className="font-mono text-sm text-muted-foreground">{secId} (missing)</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAt(secId)}
                    aria-label="Remove section"
                    className="ml-auto shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}

            {/* Add section */}
            <Popover open={addOpen} onOpenChange={setAddOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={!target}
                  className="inline-flex items-center gap-1.5 px-1 pt-1 text-sm font-medium text-[var(--sidebar-active-fg)] hover:underline disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Add section
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[420px] p-0">
                <Command>
                  <CommandInput placeholder="Search sections by path, name or app" />
                  <CommandList>
                    <CommandEmpty>No sections found.</CommandEmpty>
                    <CommandGroup>
                      {available.map((s) => (
                        <CommandItem
                          key={s.id}
                          value={`${s.path} ${s.label} ${s.appLabel} ${s.type}`}
                          onSelect={() => {
                            addSection(s.id);
                            setAddOpen(false);
                          }}
                          className="flex items-center gap-2"
                        >
                          <span className="min-w-0 flex-1 truncate font-mono text-xs">{s.path}</span>
                          <Pill tone="slate">{s.group}</Pill>
                          <Pill tone="amber">{s.appShort}</Pill>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Bulk apply / replicate — push this order onto many targets at once */}
            {target && (
              <div className="mt-6 rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      {live ? <Copy className="h-4 w-4 text-rose-600" /> : null}
                      {live ? `Replicate ${targetLabel(target)}'s order to other ${kindLabel}s` : `Apply this order to multiple ${kindLabel}s`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {live ? (
                        <>Adds the {order.length} <strong>{byId.get(order[0])?.appLabel ?? "dashboard"}</strong> sections above to each selected {kindLabel} that is missing them, in this order. Existing assignments are untouched.</>
                      ) : (
                        <>Copies the {order.length}-section order above onto every selected {kindLabel}'s {byId.get(order[0])?.appLabel ?? "dashboard"} dashboard.</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {live && lastCreated.length > 0 && !writing && (
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => void undoReplicate()}>
                        <Undo2 className="h-4 w-4" /> Undo ({lastCreated.length})
                      </Button>
                    )}
                    <Button
                      size="sm"
                      disabled={!applyTargets.length || writing}
                      onClick={onApply}
                      className={cn(live && "bg-rose-600 hover:bg-rose-700")}
                    >
                      {writing && writeProgress ? (
                        <span className="flex items-center gap-1.5"><Loader2 className="h-4 w-4 animate-spin" /> {writeProgress.done}/{writeProgress.total}</span>
                      ) : live ? (
                        `Replicate to ${applyTargets.length} ${kindLabel}${applyTargets.length === 1 ? "" : "s"}`
                      ) : (
                        `Apply to ${applyTargets.length} ${kindLabel}${applyTargets.length === 1 ? "" : "s"}`
                      )}
                    </Button>
                  </div>
                </div>
                {live && (
                  <p className="mt-2 flex items-center gap-1.5 rounded-md bg-rose-50 px-3 py-1.5 text-[11px] text-rose-700">
                    <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
                    Replicate writes to <strong>{loadedEnv?.toUpperCase()}</strong> live (additive POST per missing section). You'll confirm once, and can Undo the inserts.
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {kind === "retailer" ? (
                    <>
                      <FilterChip
                        label="Retailers"
                        icon={Store}
                        options={targetsOfKind.map((t) => t.id)}
                        value={fRetailers}
                        onChange={setFRetailers}
                        getLabel={(id) => targetsOfKind.find((t) => t.id === id)?.name ?? id}
                        searchable
                      />
                      <FilterChip
                        label="Label"
                        icon={Tags}
                        options={labelOptions}
                        value={fLabels}
                        onChange={setFLabels}
                        getLabel={(id) => retailerLabels.find((l) => l.id === id)?.name ?? id}
                        searchable
                      />
                    </>
                  ) : (
                    <FilterChip label="Clients" icon={Building2} options={clientOptions} value={fClients} onChange={setFClients} searchable />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-border" />
                    Select all ({filteredTargets.length})
                  </label>
                  {applyTargets.length > 0 && (
                    <button type="button" onClick={() => setApplyTargets([])} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                      Clear ({applyTargets.length})
                    </button>
                  )}
                </div>
                <div className="mt-2 grid max-h-72 grid-cols-1 gap-0.5 overflow-auto sm:grid-cols-2">
                  {filteredTargets.length === 0 && (
                    <p className="col-span-full px-2 py-2 text-xs text-muted-foreground">No {kindLabel}s match the filter.</p>
                  )}
                  {filteredTargets.map((t) => {
                    const lbl = kind === "retailer" ? labelOf(t.name) : null;
                    return (
                      <label key={t.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-foreground/90 hover:bg-secondary/40">
                        <input
                          type="checkbox"
                          checked={applyTargets.includes(t.id)}
                          onChange={() => toggleApply(t.id)}
                          className="h-4 w-4 rounded border-border"
                        />
                        <span className="truncate">{targetLabel(t)}</span>
                        {lbl && <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium", LABEL_COLOR_CLASSES[lbl.color])}>{lbl.name}</span>}
                        {t.id === target.id && <span className="shrink-0 text-[10px] text-muted-foreground">(current)</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Replicate confirmation (live, safe) */}
      {confirmPlan && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" onClick={() => setConfirmPlan(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <TriangleAlert className={cn("h-5 w-5", loadedEnv === "prod" ? "text-rose-500" : "text-amber-500")} />
              <h3 className="text-base font-semibold">Replicate to {loadedEnv?.toUpperCase()} live?</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Add <strong>{confirmPlan.sourceName}</strong>'s <strong>{confirmPlan.appLabel}</strong> section order to{" "}
              <strong>{confirmPlan.targetCount}</strong> {kindLabel}{confirmPlan.targetCount === 1 ? "" : "s"} —{" "}
              <strong className={loadedEnv === "prod" ? "text-rose-600" : "text-amber-600"}>{confirmPlan.totalAdds}</strong> new section assignment{confirmPlan.totalAdds === 1 ? "" : "s"} via POST.
              Sections a {kindLabel} already has are skipped; nothing is reordered or removed. Each insert is undoable.
            </p>
            <div className="mt-3 max-h-56 overflow-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {confirmPlan.items.map((it) => (
                    <tr key={it.targetId} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-1.5 truncate">{it.name}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums text-emerald-700">+{it.toAdd.length}</td>
                      <td className="px-3 py-1.5 text-right text-[11px] tabular-nums text-muted-foreground">{it.already} present</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmPlan(null)} className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary">
                Cancel
              </button>
              <button
                onClick={() => void runReplicate(confirmPlan)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium text-white",
                  loadedEnv === "prod" ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700",
                )}
              >
                Replicate {confirmPlan.totalAdds} assignment{confirmPlan.totalAdds === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
