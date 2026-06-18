// Desk-test "Scenario simulator": fabricate internally-consistent Seeds-API
// scenarios (client → project → subscription → scrapping option → seeds) from the
// real production Jobs in scenarioSeedData, so the whole flow can be validated in
// the Value Stream Map. Reusable: generate per client, then "Clear simulated" to
// remove exactly what was created (tracked in a sim registry).
//
// IMPORTANT: cross-entity references in this mockup are by NAME, not id
// (subscription.project = project.name, subscription.scrappingOption = option.name).
// The generator wires those consistently so the planner resolves every edge.

import { getClients, setProjectClients, nowStamp, emptyClient, CLIENTS_KEY, type Client } from "./clients";
import { getProjects, PROJECTS_KEY, type Project, type AssignedSubscription } from "./projects";
import { getSubscriptions, SUBSCRIPTIONS_KEY, emptySubscription, type Subscription } from "./subscriptions";
import { getSeeds, INITIAL_SEEDS, SEEDS_KEY, type Seed, type SeedType } from "./seeds";
import { getScrappingOptions, SCRAPPING_OPTIONS_KEY } from "./scrappingOptions";
import { EMPTY_SCRAPPING_OPTION, type ScrappingOptionValues } from "@/components/seeds/ScrappingOptionDialog";
import { REAL_JOBS, CLIENT_LABELS, REAL_LOCATION_SETS, type RealJob } from "./scenarioSeedData";

const SIM_KEY = "seeds-api:sim:index";
const LOC_VOLUME_TBD = 10;
const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `sim-${Date.now()}-${Math.round(performance.now())}`);

type SimIndex = {
  projectIds: string[];
  subIds: string[];
  seedIds: string[];
  scrapNames: string[];
  createdClientIds: string[]; // clients the simulator itself created (test clients)
  linkedClientProjects: { clientId: string; projectId: string }[]; // links to unwind
};
const emptyIndex = (): SimIndex => ({ projectIds: [], subIds: [], seedIds: [], scrapNames: [], createdClientIds: [], linkedClientProjects: [] });

const readIndex = (): SimIndex => {
  if (typeof window === "undefined") return emptyIndex();
  try { return { ...emptyIndex(), ...JSON.parse(window.localStorage.getItem(SIM_KEY) || "{}") }; } catch { return emptyIndex(); }
};
const writeIndex = (ix: SimIndex) => { if (typeof window !== "undefined") window.localStorage.setItem(SIM_KEY, JSON.stringify(ix)); };
const write = (key: string, list: unknown) => { if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(list)); };

// ---- extraction-type → seed-type + scrapping-option preset --------------------
export const extractionToSeedType = (ext: string): SeedType => {
  if (ext === "DIGITAL_SHELF_PDP") return "PDP";
  if (ext === "SHELF") return "URL";
  return "KEYWORD"; // MEDIA, SEARCH, AD, DIGITAL_SHELF_PLP (the discovery keyword)
};

/** Whether this extraction type discovers product URLs that feed a sibling PDP run. */
export const isDiscovery = (ext: string) => ext === "DIGITAL_SHELF_PLP" || ext === "MEDIA";

const optionPreset = (ext: string): Partial<ScrappingOptionValues> => {
  switch (ext) {
    case "MEDIA": return { multivariants: true };
    case "DIGITAL_SHELF_PDP": return { pagination: true, maxPage: "10", limitedDiscovery: true, maxRank: "100000", sorting: true, sort: "best_seller" };
    case "DIGITAL_SHELF_PLP": return { pagination: true, maxPage: "40", limitedDiscovery: true, maxRank: "10000" };
    case "AD": return { modalities: true, modalityValues: ["pickup", "delivery"] };
    case "SEARCH": return { sorting: true, sort: "relevance" };
    default: return {}; // SHELF
  }
};

const geoToSub = (mode: string) => (mode === "NO_GEOLOC" ? "NONE" : mode); // MANUAL/AUTOMATIC/VIRTUAL_STORE pass through
const freqFromName = (name: string) => (/_1d_|_1d /i.test(name) ? "Daily" : /_1w_/i.test(name) ? "Weekly" : /_1m_/i.test(name) ? "Monthly" : "Daily");
const pick = <T,>(arr: T[], n: number, seed: number) => arr.filter((_, i) => i % Math.max(1, Math.round(arr.length / n)) === seed % Math.max(1, Math.round(arr.length / n))).slice(0, n);

// Real seed corpus (collected from tasks > seeds), bucketed by type. The generator
// samples + clones these so fabricated subscriptions carry REAL seed descriptions,
// values, categories, keyword types/brands, page types and discovery keys.
const realByType = (t: SeedType): Seed[] => INITIAL_SEEDS.filter((s) => (s.type ?? "KEYWORD") === t);
const REAL_KEYWORDS = realByType("KEYWORD");
const REAL_URLS = realByType("URL");
const REAL_PDPS = realByType("PDP");
const cloneSeed = (s: Seed, fromDiscovery = false): Seed => ({ ...s, id: uid(), c: nowStamp(), u: nowStamp(), status: "Active", isFromDiscovery: fromDiscovery });

// Assign a realistic location set to a geolocated subscription: prefer a set whose
// store matches the job's store, else one in the same country, else any — so the
// task estimate uses a REAL location volume (6–200+) instead of a flat placeholder.
const pickLocationSet = (job: RealJob): string => {
  const sets = REAL_LOCATION_SETS;
  if (!sets.length) return "Amazon US — All locations";
  const js = job.store.toLowerCase();
  const exact = sets.find((s) => { const ss = s.store.toLowerCase(); return ss.includes(js) || js.includes(ss.split(" -")[0]); });
  if (exact) return exact.name;
  const sameCountry = sets.filter((s) => s.country === (job.country || "").toUpperCase());
  const pool = sameCountry.length ? sameCountry : sets;
  return pool[job.name.length % pool.length].name;
};
const locationCount = (name?: string): number => { const m = /—\s*([\d,]+)\s*locations/i.exec(name || ""); return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0; };

// One built scenario = the records to persist for a single client (one project).
export type BuiltScenario = {
  client: Client;
  clientIsNew: boolean;
  project: Project;
  scrappingOptions: ScrappingOptionValues[];
  subscriptions: Subscription[];
  seeds: Seed[];
};

/** Build (but do not persist) a consistent scenario for one client from chosen jobs. */
export function buildScenario(clientSlug: string, jobs: RealJob[]): BuiltScenario {
  const label = CLIENT_LABELS[clientSlug] ?? clientSlug;
  const existing = getClients().find((c) => c.name.toLowerCase() === label.toLowerCase());
  const client: Client = existing ?? { ...emptyClient(), name: label, acronym: label.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase(), isTest: true };
  const clientIsNew = !existing;

  const project: Project = {
    id: uid(), name: `${label} — Desk test`, bom: "SIMUL", status: "Active",
    createdAt: nowStamp(), updatedAt: nowStamp(), createdBy: "desk-test@shalion.com", updatedBy: "desk-test@shalion.com",
    assignedSubscriptions: [],
  };

  const scrappingOptions: ScrappingOptionValues[] = [];
  const subscriptions: Subscription[] = [];
  const seeds: Seed[] = [];
  const assigned: AssignedSubscription[] = [];

  jobs.forEach((job, ji) => {
    const seedType = extractionToSeedType(job.extractionType);
    const geo = geoToSub(job.geolocMode);
    const locationSet = geo === "MANUAL" ? pickLocationSet(job) : "";

    // --- the seeds for this subscription (sampled + cloned from the REAL corpus)
    const subSeeds: Seed[] = [];
    const realPool = seedType === "PDP" ? REAL_PDPS : seedType === "URL" ? REAL_URLS : REAL_KEYWORDS;
    pick(realPool, 2, ji).forEach((s) => subSeeds.push(cloneSeed(s)));

    const optName = `${job.name}`; // reuse the real job name as the option name
    const option: ScrappingOptionValues = { ...EMPTY_SCRAPPING_OPTION, name: optName, status: "Active", extractionType: job.extractionType, ...optionPreset(job.extractionType) };

    const sub: Subscription = {
      ...emptySubscription(), id: uid(), name: job.name, project: project.name, store: job.store,
      seeds: subSeeds.map((s) => s.d), scrappingOption: optName, geo, locationSet,
      frequency: freqFromName(job.name), rotation: geo === "MANUAL" ? "Locations" : "Seeds",
      status: "Active", businessUnit: job.businessUnit || "GEN",
    };

    // --- discovery (PLP/MEDIA) → create a sibling PDP subscription + destinationOption
    if (isDiscovery(job.extractionType)) {
      const pdpName = job.name.replace(/^(ME|PLP|MAG|MAT|GR|GC|GEO)[^_]*_/, "PDP_");
      const pdpOptName = `${pdpName} (PDP)`;
      const pdpOption: ScrappingOptionValues = { ...EMPTY_SCRAPPING_OPTION, name: pdpOptName, status: "Active", extractionType: "DIGITAL_SHELF_PDP", ...optionPreset("DIGITAL_SHELF_PDP") };
      const pdpSeeds: Seed[] = pick(REAL_PDPS, 2, ji + 1).map((s) => cloneSeed(s, true));
      const pdpSub: Subscription = {
        ...emptySubscription(), id: uid(), name: `${pdpName} (PDP)`, project: project.name, store: job.store,
        seeds: pdpSeeds.map((s) => s.d), scrappingOption: pdpOptName, geo, locationSet,
        frequency: "Weekly", rotation: "Seeds", status: "Active", businessUnit: job.businessUnit || "GEN",
      };
      scrappingOptions.push(pdpOption); subscriptions.push(pdpSub); seeds.push(...pdpSeeds);
      assigned.push({ id: pdpSub.id, name: pdpSub.name, store: pdpSub.store, geo: pdpSub.geo, type: "ADDON", expiration: "-" });
      sub.destinationOption = pdpSub.name; // discovery feeds the PDP sibling
    }

    scrappingOptions.push(option); subscriptions.push(sub); seeds.push(...subSeeds);
    assigned.push({ id: sub.id, name: sub.name, store: sub.store, geo: sub.geo, type: "BASE", expiration: "-" });
  });

  project.assignedSubscriptions = assigned;
  return { client, clientIsNew, project, scrappingOptions, subscriptions, seeds };
}

/** Persist a built scenario to the 5 stores + the client↔project link, tracking it for clean removal. */
export function persistScenario(b: BuiltScenario): void {
  if (typeof window === "undefined") return;
  // client (upsert) FIRST so setProjectClients sees it
  if (b.clientIsNew) write(CLIENTS_KEY, [...getClients(), b.client]);
  write(PROJECTS_KEY, [...getProjects(), b.project]);
  write(SUBSCRIPTIONS_KEY, [...getSubscriptions(), ...b.subscriptions]);
  write(SCRAPPING_OPTIONS_KEY, [...getScrappingOptions(), ...b.scrappingOptions]);
  write(SEEDS_KEY, [...getSeeds(), ...b.seeds]);
  // canonical client↔project link (so the Value Stream Map shows the client column)
  const existingLinks = getClients()
    .flatMap((c) => (c.assignedProjects ?? []).some((ap) => ap.projectId === b.project.id) ? [{ clientId: c.id, name: c.name, acronym: c.acronym, activeFrom: nowStamp(), activeTo: "-" }] : []);
  setProjectClients({ id: b.project.id, name: b.project.name, bom: b.project.bom }, [
    ...existingLinks.filter((l) => l.clientId !== b.client.id),
    { clientId: b.client.id, name: b.client.name, acronym: b.client.acronym, activeFrom: nowStamp(), activeTo: "-" },
  ]);

  const ix = readIndex();
  ix.projectIds.push(b.project.id);
  ix.subIds.push(...b.subscriptions.map((s) => s.id));
  ix.seedIds.push(...b.seeds.map((s) => s.id));
  ix.scrapNames.push(...b.scrappingOptions.map((o) => o.name));
  if (b.clientIsNew) ix.createdClientIds.push(b.client.id);
  ix.linkedClientProjects.push({ clientId: b.client.id, projectId: b.project.id });
  writeIndex(ix);
}

/** Build + persist for a client in one call. */
export function generateForClient(clientSlug: string, jobs: RealJob[]): BuiltScenario {
  const built = buildScenario(clientSlug, jobs);
  persistScenario(built);
  return built;
}

/** Remove EXACTLY what the simulator created (by the sim registry); leaves seeded/real data intact. */
export function clearSimulated(): { projects: number; subscriptions: number; scrappingOptions: number; seeds: number; clients: number } {
  if (typeof window === "undefined") return { projects: 0, subscriptions: 0, scrappingOptions: 0, seeds: 0, clients: 0 };
  const ix = readIndex();
  const projIds = new Set(ix.projectIds), subIds = new Set(ix.subIds), seedIds = new Set(ix.seedIds), scrapNames = new Set(ix.scrapNames), createdClients = new Set(ix.createdClientIds);
  write(PROJECTS_KEY, getProjects().filter((p) => !projIds.has(p.id)));
  write(SUBSCRIPTIONS_KEY, getSubscriptions().filter((s) => !subIds.has(s.id)));
  write(SCRAPPING_OPTIONS_KEY, getScrappingOptions().filter((o) => !scrapNames.has(o.name)));
  write(SEEDS_KEY, getSeeds().filter((s) => !seedIds.has(s.id)));
  // unlink sim projects from clients; drop sim-created clients entirely
  const clients = getClients()
    .filter((c) => !createdClients.has(c.id))
    .map((c) => ({ ...c, assignedProjects: (c.assignedProjects ?? []).filter((ap) => !projIds.has(ap.projectId)) }));
  write(CLIENTS_KEY, clients);
  const counts = { projects: ix.projectIds.length, subscriptions: ix.subIds.length, scrappingOptions: ix.scrapNames.length, seeds: ix.seedIds.length, clients: ix.createdClientIds.length };
  writeIndex(emptyIndex());
  return counts;
}

export const hasSimulated = (): boolean => {
  const ix = readIndex();
  return ix.projectIds.length > 0 || ix.subIds.length > 0;
};

// ---- task estimation (mirrors planner + extends with disjoint fan-out) ----------
export function estimateTasks(sub: Subscription, opt?: ScrappingOptionValues): number {
  const seeds = sub.seeds.length || 1;
  const locations = sub.geo === "MANUAL" && sub.locationSet ? (locationCount(sub.locationSet) || LOC_VOLUME_TBD) : 1;
  const modalities = opt?.modalities && opt.modalityValues?.length ? opt.modalityValues.length : 1;
  const timeframes = opt?.timeframes?.length || 1;
  return seeds * locations * modalities * timeframes;
}

// ---- validation: surfaces the gap-analysis rules per scenario -------------------
export function validateScenario(b: BuiltScenario): string[] {
  const warns: string[] = [];
  const optByName = new Map(b.scrappingOptions.map((o) => [o.name, o]));
  for (const s of b.subscriptions) {
    const o = optByName.get(s.scrappingOption);
    if (o && isDiscovery(o.extractionType) && !s.destinationOption) warns.push(`${s.name}: ${o.extractionType} without a destination (PDP sibling)`);
    if (s.geo === "MANUAL" && !s.locationSet) warns.push(`${s.name}: geo MANUAL but no locationSet (task estimate silently uses 1 location)`);
    if (o?.pagination && !o.maxPage) warns.push(`${s.name}: pagination on but maxPage empty`);
  }
  for (const sd of b.seeds) {
    if (sd.type === "PDP" && !sd.discoveryKey) warns.push(`seed "${sd.d}": PDP without discoveryKey`);
    if (sd.type === "KEYWORD" && sd.keywordType === "BRANDED" && !sd.brand) warns.push(`seed "${sd.d}": BRANDED keyword without brand`);
  }
  return warns;
}

export { REAL_JOBS, CLIENT_LABELS };
