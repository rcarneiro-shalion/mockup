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
  ArrowDownUp,
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
type AssignRecord = { recordId: string; sectionId: string; position: number };

/** Live bundle for one kind (agency = retailers, brand = datagroups). */
type LiveBundle = {
  targets: PosTarget[];
  sections: CatalogSection[];
  /** posKey(appId, targetId) → ordered section ids (by live `position`). */
  orderMap: Record<string, string[]>;
  /** posKey(appId, targetId) → existing assignment records (id + position), for in-place reorder. */
  recordsByKey: Record<string, AssignRecord[]>;
  /** targetId → highest `position` in use (global across apps; for safe appends/temp band). */
  maxPos: Record<string, number>;
};
const kindKeyOf = (k: PosTargetKind): "agency" | "brand" => (k === "retailer" ? "agency" : "brand");

// The live insert/delete/patch endpoints (already allow-listed in the proxy).
const EP = {
  retailer: "/v1.0/admin/retailer-dashboardsections",
  datagroup: "/v1.0/admin/datagroup-dashboardsections",
} as const;
const ID_FIELD = { retailer: "retailerId", datagroup: "dataGroupId" } as const;

type BulkMode = "add" | "enforce";
type AddItem = { targetId: string; name: string; toAdd: string[]; already: number };
type AddPlan = { kind: "add"; appLabel: string; sourceName: string; items: AddItem[]; totalAdds: number; targetCount: number };
type EnforceItem = { targetId: string; name: string; changes: number };
type EnforcePlan = { kind: "enforce"; appLabel: string; sourceName: string; items: EnforceItem[]; totalChanges: number; targetCount: number; alreadyOrdered: number };
type UndoState =
  | { type: "add"; created: string[] }
  | { type: "enforce"; restore: { recordId: string; position: number }[] };

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
  const [mode, setMode] = useState<BulkMode>("add");
  // Facet filters — same shape as the relationship map: a per-entity filter
  // (Retailers / Clients) plus, for retailers, a Label filter over every label.
  const [retailerLabels] = usePersistentState<RetailerLabel[]>("mu:retailer-labels:v4", SEED_RETAILER_LABELS);
  const [fRetailers, setFRetailers] = useState<string[]>([]);
  const [fLabels, setFLabels] = useState<string[]>([]);
  const [fClients, setFClients] = useState<string[]>([]);
  const target = targetsOfKind.find((t) => t.id === targetId) ?? null;

  // --- live write state ------------------------------------------------------
  const [confirm, setConfirm] = useState<AddPlan | EnforcePlan | null>(null);
  const [writing, setWriting] = useState(false);
  const [writeProgress, setWriteProgress] = useState<{ done: number; total: number } | null>(null);
  const [lastAction, setLastAction] = useState<UndoState | null>(null);

  // Keep the app / target selections valid as the data source changes.
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
    const grouped: Record<string, AssignRecord[]> = {};
    const maxPos: Record<string, number> = {};
    for (const a of res.assignments) {
      const k = posKey(a.appId, a.targetId);
      (grouped[k] ||= []).push({ recordId: a.id, sectionId: a.sectionId, position: a.position });
      if (a.position > (maxPos[a.targetId] ?? 0)) maxPos[a.targetId] = a.position;
    }
    const orderMap: Record<string, string[]> = {};
    const recordsByKey: Record<string, AssignRecord[]> = {};
    for (const k of Object.keys(grouped)) {
      const sorted = grouped[k].slice().sort((x, y) => x.position - y.position);
      orderMap[k] = sorted.map((x) => x.sectionId);
      recordsByKey[k] = sorted;
    }
    return { targets: res.targets.map((t) => ({ id: t.id, kind, name: t.name, client: t.client })), sections, orderMap, recordsByKey, maxPos };
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

  // Auto-connect on open when tokens are already saved (top-bar 🔑).
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
    setLastAction(null);
  };

  const switchKind = (k: PosTargetKind) => {
    if (k === kind) return;
    setKind(k);
    if (!live) setTargetId(POSITION_TARGETS.find((t) => t.kind === k)?.id ?? "");
    setApplyTargets([]);
    setFRetailers([]);
    setFLabels([]);
    setFClients([]);
    setLastAction(null);
  };

  // Order for the selected application + target. When live, the real order comes
  // from `position`; a local edit (drag/add/remove) overlays it (localStorage,
  // NOT written back). When local, it's purely local.
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
  const labelOptions = retailerLabels.map((l) => l.id);
  const clientOptions = [...new Set(targetsOfKind.filter((t) => t.client).map((t) => t.client as string))].sort((a, b) => a.localeCompare(b));

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

  // ---- shared live-write helpers -------------------------------------------
  const creds = () => {
    const saved = getDevTokens();
    return { tok: token || saved.token, idt: idToken || saved.idToken };
  };
  const patchPos = async (recordId: string, position: number) => {
    const { tok, idt } = creds();
    return mutateLive({
      data: { service: "visualization", env: loadedEnv!, method: "PATCH", path: `${EP[kind]}/${recordId}`, body: { position }, token: tok || undefined, idToken: idt || undefined },
    });
  };
  // Let the vacate-phase writes settle before the set-phase, so a just-freed slot
  // isn't still seen as occupied (the upstream auto-bumps position on conflict,
  // which would drift the final positions by +1 even though order is preserved).
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  // Run independent per-target jobs with limited concurrency.
  const pool = async <T,>(items: T[], worker: (it: T) => Promise<void>, conc = 4) => {
    let i = 0;
    const next = async (): Promise<void> => {
      const idx = i++;
      if (idx >= items.length) return;
      await worker(items[idx]);
      return next();
    };
    await Promise.all(Array.from({ length: Math.min(conc, items.length) }, () => next()));
  };

  // ---- ADD missing (additive POST) -----------------------------------------
  const buildAddPlan = (): AddPlan | null => {
    if (!live || !bundle || !target) return null;
    const src = order;
    const items: AddItem[] = [];
    let totalAdds = 0;
    for (const tId of applyTargets) {
      if (tId === target.id) continue;
      const existing = new Set(bundle.orderMap[posKey(appId, tId)] ?? []);
      const toAdd = src.filter((sid) => !existing.has(sid));
      totalAdds += toAdd.length;
      items.push({ targetId: tId, name: targetsOfKind.find((t) => t.id === tId)?.name ?? tId, toAdd, already: src.length - toAdd.length });
    }
    if (!items.length) return null;
    return { kind: "add", appLabel: byId.get(src[0])?.appLabel ?? "this app", sourceName: targetLabel(target), items, totalAdds, targetCount: items.length };
  };

  const runAdd = async (plan: AddPlan) => {
    if (!bundle || !loadedEnv) return;
    setWriting(true);
    setConfirm(null);
    const { tok, idt } = creds();
    const ep = EP[kind];
    const idField = ID_FIELD[kind];
    const created: string[] = [];
    let added = 0;
    let failed = 0;
    const nextOrderMap = { ...bundle.orderMap };
    const nextRecords = { ...bundle.recordsByKey };
    const nextMax = { ...bundle.maxPos };
    setWriteProgress({ done: 0, total: plan.totalAdds });
    let done = 0;
    for (const item of plan.items) {
      let pos = (nextMax[item.targetId] ?? 0) + 1;
      const k2 = posKey(appId, item.targetId);
      for (const sid of item.toAdd) {
        let ok = false;
        let tries = 0;
        let lastErr = "";
        while (!ok && tries < 40) {
          const res = await mutateLive({
            data: { service: "visualization", env: loadedEnv, method: "POST", path: ep, body: { [idField]: item.targetId, dashboardSectionId: sid, position: pos }, token: tok || undefined, idToken: idt || undefined },
          });
          if (res.ok) {
            ok = true;
            const recId = (res.data as { id?: string } | null)?.id;
            if (recId) created.push(recId);
            added++;
            nextMax[item.targetId] = pos;
            nextOrderMap[k2] = [...(nextOrderMap[k2] ?? []), sid];
            if (recId) nextRecords[k2] = [...(nextRecords[k2] ?? []), { recordId: recId, sectionId: sid, position: pos }];
          } else if (res.status === 409) {
            pos++;
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
    setBundles((prev) => ({ ...prev, [kindKeyOf(kind)]: { ...bundle, orderMap: nextOrderMap, recordsByKey: nextRecords, maxPos: nextMax } }));
    setLastAction(created.length ? { type: "add", created } : null);
    setApplyTargets([]);
    setWriting(false);
    setWriteProgress(null);
    if (failed) toast.warning(`Added to ${plan.targetCount} ${kindLabel}s: +${added}, ${failed} failed. ${created.length} undoable.`);
    else toast.success(`Added ${plan.sourceName}'s sections to ${plan.targetCount} ${kindLabel}s: +${added}. Undo available.`);
  };

  // ---- ENFORCE order (in-place PATCH reorder) ------------------------------
  // For each target, the source sections it already has are re-sequenced into the
  // source's order, REUSING their current position slots (so the block stays where
  // it is globally; only the within-app order changes). Sections not in the source
  // order are left untouched. Collision-safe 2-phase: vacate to a temp band, then set.
  const planMovesFor = (tId: string): { recordId: string; fromPos: number; toPos: number }[] => {
    if (!bundle) return [];
    const recs = bundle.recordsByKey[posKey(appId, tId)] ?? [];
    const present = order.filter((sid) => recs.some((r) => r.sectionId === sid)); // source order ∩ target
    if (present.length < 2) return [];
    const matched = recs.filter((r) => present.includes(r.sectionId));
    const slots = matched.map((r) => r.position).slice().sort((a, b) => a - b);
    const bySec = new Map(matched.map((r) => [r.sectionId, r]));
    const moves: { recordId: string; fromPos: number; toPos: number }[] = [];
    present.forEach((sid, i) => {
      const rec = bySec.get(sid);
      if (rec && rec.position !== slots[i]) moves.push({ recordId: rec.recordId, fromPos: rec.position, toPos: slots[i] });
    });
    return moves;
  };

  const buildEnforcePlan = (): EnforcePlan | null => {
    if (!live || !bundle || !target) return null;
    const items: EnforceItem[] = [];
    let alreadyOrdered = 0;
    let totalChanges = 0;
    for (const tId of applyTargets) {
      if (tId === target.id) continue;
      const moves = planMovesFor(tId);
      const present = (bundle.recordsByKey[posKey(appId, tId)] ?? []).filter((r) => order.includes(r.sectionId));
      if (present.length < 2) continue; // nothing meaningful to order
      if (!moves.length) {
        alreadyOrdered++;
        continue;
      }
      totalChanges += moves.length;
      items.push({ targetId: tId, name: targetsOfKind.find((t) => t.id === tId)?.name ?? tId, changes: moves.length });
    }
    return { kind: "enforce", appLabel: byId.get(order[0])?.appLabel ?? "this app", sourceName: targetLabel(target), items, totalChanges, targetCount: items.length, alreadyOrdered };
  };

  const runEnforce = async (plan: EnforcePlan) => {
    if (!bundle || !loadedEnv) return;
    setWriting(true);
    setConfirm(null);
    const restore: { recordId: string; position: number }[] = [];
    let changed = 0;
    let failed = 0;
    const nextRecords = { ...bundle.recordsByKey };
    setWriteProgress({ done: 0, total: plan.totalChanges });
    let done = 0;
    await pool(
      plan.items,
      async (item) => {
        const moves = planMovesFor(item.targetId);
        if (!moves.length) return;
        const tempBase = (bundle.maxPos[item.targetId] ?? 0) + 1000;
        // Phase 1 — vacate every moving record to a unique free temp slot.
        for (let j = 0; j < moves.length; j++) {
          const r = await patchPos(moves[j].recordId, tempBase + j);
          if (!r.ok) failed++;
        }
        await sleep(400); // let the vacates settle so final slots read as free
        // Phase 2 — drop each record into its final slot (now free).
        for (const m of moves) {
          const r = await patchPos(m.recordId, m.toPos);
          if (r.ok) {
            changed++;
            restore.push({ recordId: m.recordId, position: m.fromPos });
          } else {
            failed++;
          }
          done++;
          setWriteProgress({ done, total: plan.totalChanges });
        }
        // reflect new positions locally
        const k2 = posKey(appId, item.targetId);
        const moveTo = new Map(moves.map((m) => [m.recordId, m.toPos]));
        const updated = (nextRecords[k2] ?? []).map((r) => (moveTo.has(r.recordId) ? { ...r, position: moveTo.get(r.recordId)! } : r)).sort((a, b) => a.position - b.position);
        nextRecords[k2] = updated;
      },
      4,
    );
    const nextOrderMap = { ...bundle.orderMap };
    for (const item of plan.items) {
      const k2 = posKey(appId, item.targetId);
      nextOrderMap[k2] = (nextRecords[k2] ?? []).map((r) => r.sectionId);
    }
    setBundles((prev) => ({ ...prev, [kindKeyOf(kind)]: { ...bundle, recordsByKey: nextRecords, orderMap: nextOrderMap } }));
    setLastAction(restore.length ? { type: "enforce", restore } : null);
    setApplyTargets([]);
    setWriting(false);
    setWriteProgress(null);
    if (failed) toast.warning(`Enforced order on ${plan.targetCount} ${kindLabel}s: ${changed} moves, ${failed} failed. ${restore.length} undoable.`);
    else toast.success(`Enforced ${plan.sourceName}'s order on ${plan.targetCount} ${kindLabel}s (${changed} moves). Undo available.`);
  };

  // ---- Undo (handles both add + enforce) -----------------------------------
  const undo = async () => {
    if (!lastAction || !loadedEnv) return;
    setWriting(true);
    const { tok, idt } = creds();
    const ep = EP[kind];
    if (lastAction.type === "add") {
      let removed = 0;
      let failed = 0;
      setWriteProgress({ done: 0, total: lastAction.created.length });
      for (let n = 0; n < lastAction.created.length; n++) {
        const res = await mutateLive({ data: { service: "visualization", env: loadedEnv, method: "DELETE", path: `${ep}/${lastAction.created[n]}`, token: tok || undefined, idToken: idt || undefined } });
        if (res.ok) removed++;
        else failed++;
        setWriteProgress({ done: n + 1, total: lastAction.created.length });
      }
      toast.success(`Undo: removed ${removed}${failed ? `, ${failed} failed` : ""}. Reconnect to refresh.`);
    } else {
      // 2-phase restore of positions: vacate all to a global temp band, then set originals.
      const r = lastAction.restore;
      setWriteProgress({ done: 0, total: r.length });
      for (let j = 0; j < r.length; j++) await patchPos(r[j].recordId, 90000 + j);
      await sleep(400); // let the vacates settle before restoring originals
      let restored = 0;
      let failed = 0;
      for (let n = 0; n < r.length; n++) {
        const res = await patchPos(r[n].recordId, r[n].position);
        if (res.ok) restored++;
        else failed++;
        setWriteProgress({ done: n + 1, total: r.length });
      }
      toast.success(`Undo: restored ${restored} position${restored === 1 ? "" : "s"}${failed ? `, ${failed} failed` : ""}. Reconnect to refresh.`);
    }
    setLastAction(null);
    setWriting(false);
    setWriteProgress(null);
  };

  const onApply = () => {
    if (!applyTargets.length) return;
    if (!live) {
      applyToAllLocal();
      return;
    }
    if (mode === "add") {
      const plan = buildAddPlan();
      if (!plan) {
        toast.info("Nothing to add — the selected targets already have every section in this order.");
        return;
      }
      setConfirm(plan);
    } else {
      const plan = buildEnforcePlan();
      if (!plan || !plan.items.length) {
        toast.info(plan?.alreadyOrdered ? `All ${plan.alreadyOrdered} selected ${kindLabel}s already match this order.` : "No matching sections to re-order on the selected targets.");
        return;
      }
      setConfirm(plan);
    }
  };

  const undoCount = lastAction ? (lastAction.type === "add" ? lastAction.created.length : lastAction.restore.length) : 0;
  const primaryLabel = !live
    ? `Apply to ${applyTargets.length} ${kindLabel}${applyTargets.length === 1 ? "" : "s"}`
    : mode === "add"
      ? `Replicate to ${applyTargets.length} ${kindLabel}${applyTargets.length === 1 ? "" : "s"}`
      : `Enforce order on ${applyTargets.length} ${kindLabel}${applyTargets.length === 1 ? "" : "s"}`;

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 px-6 pt-5">
          <div>
            <Link to="/settings/dashboard-applications" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Dashboard applications
            </Link>
            <div className="mt-1 flex items-center gap-2">
              <Layers className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Section position</h1>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Order the dashboard sections of a retailer or datagroup. The order here is the position the client sees their sections in, in the dashboard.{" "}
              {live && <span className="text-foreground/70">Drag/add edits stay local; the bulk panel can replicate or enforce this order on other {kindLabel}s live.</span>}
            </p>
          </div>
          {/* Live connect controls */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-md border border-border bg-secondary/40 p-0.5 text-xs" title="Environment for live load + write">
              <button type="button" onClick={() => onEnvChange("develop")} className={cn("flex items-center gap-1 rounded px-2 py-1", liveEnv === "develop" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                <FlaskConical className="h-3.5 w-3.5" /> Dev
              </button>
              <button type="button" onClick={() => onEnvChange("prod")} className={cn("flex items-center gap-1 rounded px-2 py-1", liveEnv === "prod" ? "bg-rose-600 font-medium text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}>
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
              Load the <strong>real retailers / datagroups</strong> and their dashboard section order from the Visualization API ({liveEnv}) via the server proxy.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input type="password" value={draftA} onChange={(e) => setDraftA(e.target.value)} placeholder="Authorization bearer token" className="h-8 min-w-[220px] flex-1 rounded-md border border-border bg-background px-2.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
              <input type="password" value={draftI} onChange={(e) => setDraftI(e.target.value)} placeholder="x-id-token" className="h-8 min-w-[220px] flex-1 rounded-md border border-border bg-background px-2.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
              <Button size="sm" className="h-8" onClick={() => void connectLive(liveEnv)} disabled={connecting}>
                {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
              </Button>
            </div>
          </div>
        )}

        {/* Application + target selector */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-4">
          <select value={appId} onChange={(e) => setAppId(e.target.value)} title="Dashboard application" className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring">
            {appOptions.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-0.5 rounded-md border border-border bg-secondary/40 p-0.5 text-sm">
            <button type="button" onClick={() => switchKind("retailer")} className={cn("flex items-center gap-1.5 rounded px-2.5 py-1", kind === "retailer" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <Store className="h-3.5 w-3.5" /> Retailer
            </button>
            <button type="button" onClick={() => switchKind("datagroup")} className={cn("flex items-center gap-1.5 rounded px-2.5 py-1", kind === "datagroup" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <Building2 className="h-3.5 w-3.5" /> Datagroup
            </button>
          </div>
          <select value={targetId} onChange={(e) => setTargetId(e.target.value)} className="h-9 min-w-[240px] max-w-[320px] rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
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
                  <button type="button" onClick={() => removeAt(secId)} aria-label="Remove section" className="ml-auto shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}

            {/* Add section */}
            <Popover open={addOpen} onOpenChange={setAddOpen}>
              <PopoverTrigger asChild>
                <button type="button" disabled={!target} className="inline-flex items-center gap-1.5 px-1 pt-1 text-sm font-medium text-[var(--sidebar-active-fg)] hover:underline disabled:opacity-50">
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

            {/* Bulk panel */}
            {target && (
              <div className="mt-6 rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      {live ? (mode === "add" ? <Copy className="h-4 w-4 text-rose-600" /> : <ArrowDownUp className="h-4 w-4 text-rose-600" />) : null}
                      {!live
                        ? `Apply this order to multiple ${kindLabel}s`
                        : mode === "add"
                          ? `Replicate ${targetLabel(target)}'s order to other ${kindLabel}s`
                          : `Enforce ${targetLabel(target)}'s order on other ${kindLabel}s`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {!live ? (
                        <>Copies the {order.length}-section order above onto every selected {kindLabel}'s {byId.get(order[0])?.appLabel ?? "dashboard"} dashboard.</>
                      ) : mode === "add" ? (
                        <>Adds the {order.length} <strong>{byId.get(order[0])?.appLabel ?? "dashboard"}</strong> sections to each selected {kindLabel} that is missing them. Existing assignments are untouched.</>
                      ) : (
                        <>Re-sequences the sections each selected {kindLabel} <strong>already has</strong> to match this order (in place). Extra sections they have are left untouched; nothing is added or removed.</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {live && undoCount > 0 && !writing && (
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => void undo()}>
                        <Undo2 className="h-4 w-4" /> Undo ({undoCount})
                      </Button>
                    )}
                    <Button size="sm" disabled={!applyTargets.length || writing} onClick={onApply} className={cn(live && "bg-rose-600 hover:bg-rose-700")}>
                      {writing && writeProgress ? (
                        <span className="flex items-center gap-1.5">
                          <Loader2 className="h-4 w-4 animate-spin" /> {writeProgress.done}/{writeProgress.total}
                        </span>
                      ) : (
                        primaryLabel
                      )}
                    </Button>
                  </div>
                </div>

                {/* Mode toggle (live only) */}
                {live && (
                  <div className="mt-3 flex items-center gap-0.5 rounded-md border border-border bg-secondary/40 p-0.5 text-xs w-fit" title="Add missing sections, or re-order the ones they already have">
                    <button type="button" onClick={() => setMode("add")} className={cn("flex items-center gap-1 rounded px-2.5 py-1", mode === "add" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                      <Copy className="h-3.5 w-3.5" /> Add missing
                    </button>
                    <button type="button" onClick={() => setMode("enforce")} className={cn("flex items-center gap-1 rounded px-2.5 py-1", mode === "enforce" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                      <ArrowDownUp className="h-3.5 w-3.5" /> Enforce order
                    </button>
                  </div>
                )}

                {live && (
                  <p className="mt-2 flex items-center gap-1.5 rounded-md bg-rose-50 px-3 py-1.5 text-[11px] text-rose-700">
                    <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
                    {mode === "add" ? "Add" : "Enforce"} writes to <strong>{loadedEnv?.toUpperCase()}</strong> live ({mode === "add" ? "POST per missing section" : "PATCH positions in place"}). You'll confirm with the exact count, and can Undo.
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {kind === "retailer" ? (
                    <>
                      <FilterChip label="Retailers" icon={Store} options={targetsOfKind.map((t) => t.id)} value={fRetailers} onChange={setFRetailers} getLabel={(id) => targetsOfKind.find((t) => t.id === id)?.name ?? id} searchable />
                      <FilterChip label="Label" icon={Tags} options={labelOptions} value={fLabels} onChange={setFLabels} getLabel={(id) => retailerLabels.find((l) => l.id === id)?.name ?? id} searchable />
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
                  {filteredTargets.length === 0 && <p className="col-span-full px-2 py-2 text-xs text-muted-foreground">No {kindLabel}s match the filter.</p>}
                  {filteredTargets.map((t) => {
                    const lbl = kind === "retailer" ? labelOf(t.name) : null;
                    return (
                      <label key={t.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-foreground/90 hover:bg-secondary/40">
                        <input type="checkbox" checked={applyTargets.includes(t.id)} onChange={() => toggleApply(t.id)} className="h-4 w-4 rounded border-border" />
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

      {/* Confirmation (live, safe) */}
      {confirm && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" onClick={() => setConfirm(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <TriangleAlert className={cn("h-5 w-5", loadedEnv === "prod" ? "text-rose-500" : "text-amber-500")} />
              <h3 className="text-base font-semibold">{confirm.kind === "add" ? "Replicate" : "Enforce order"} to {loadedEnv?.toUpperCase()} live?</h3>
            </div>
            {confirm.kind === "add" ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Add <strong>{confirm.sourceName}</strong>'s <strong>{confirm.appLabel}</strong> section order to <strong>{confirm.targetCount}</strong> {kindLabel}
                {confirm.targetCount === 1 ? "" : "s"} — <strong className={loadedEnv === "prod" ? "text-rose-600" : "text-amber-600"}>{confirm.totalAdds}</strong> new assignment{confirm.totalAdds === 1 ? "" : "s"} via POST. Sections already present are skipped; nothing is reordered or removed. Undoable.
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Re-sequence <strong>{confirm.targetCount}</strong> {kindLabel}{confirm.targetCount === 1 ? "" : "s"} to match <strong>{confirm.sourceName}</strong>'s <strong>{confirm.appLabel}</strong> order —{" "}
                <strong className={loadedEnv === "prod" ? "text-rose-600" : "text-amber-600"}>{confirm.totalChanges}</strong> position change{confirm.totalChanges === 1 ? "" : "s"} via PATCH (in place, reusing existing slots).
                {confirm.alreadyOrdered > 0 && <> {confirm.alreadyOrdered} already in order (skipped).</>} Extra sections untouched. Undoable.
              </p>
            )}
            <div className="mt-3 max-h-56 overflow-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {confirm.kind === "add"
                    ? confirm.items.map((it) => (
                        <tr key={it.targetId} className="border-b border-border/60 last:border-0">
                          <td className="px-3 py-1.5 truncate">{it.name}</td>
                          <td className="px-3 py-1.5 text-right tabular-nums text-emerald-700">+{it.toAdd.length}</td>
                          <td className="px-3 py-1.5 text-right text-[11px] tabular-nums text-muted-foreground">{it.already} present</td>
                        </tr>
                      ))
                    : confirm.items.map((it) => (
                        <tr key={it.targetId} className="border-b border-border/60 last:border-0">
                          <td className="px-3 py-1.5 truncate">{it.name}</td>
                          <td className="px-3 py-1.5 text-right tabular-nums text-rose-700">{it.changes} move{it.changes === 1 ? "" : "s"}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirm(null)} className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary">
                Cancel
              </button>
              <button
                onClick={() => (confirm.kind === "add" ? void runAdd(confirm) : void runEnforce(confirm))}
                className={cn("rounded-md px-3 py-1.5 text-sm font-medium text-white", loadedEnv === "prod" ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700")}
              >
                {confirm.kind === "add" ? `Replicate ${confirm.totalAdds} assignment${confirm.totalAdds === 1 ? "" : "s"}` : `Apply ${confirm.totalChanges} change${confirm.totalChanges === 1 ? "" : "s"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
