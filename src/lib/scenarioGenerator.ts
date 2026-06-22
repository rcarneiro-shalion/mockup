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
import { REAL_JOBS, CLIENT_LABELS, STORE_LOCATIONS, CLIENT_KEYWORDS, CLIENT_CATEGORY, type RealJob } from "./scenarioSeedData";

const SIM_KEY = "seeds-api:sim:index";
const LOC_VOLUME_TBD = 10;
const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `sim-${Date.now()}-${Math.round(performance.now())}`);

// One generated scenario per client = one batch, so it can be cleared individually.
type SimBatch = {
  slug: string;
  projectIds: string[];
  subIds: string[];
  seedIds: string[];
  scrapNames: string[];
  createdClientIds: string[]; // test clients this batch created (dropped on clear)
};
type SimIndex = { batches: SimBatch[] };
const emptyIndex = (): SimIndex => ({ batches: [] });

const readIndex = (): SimIndex => {
  if (typeof window === "undefined") return emptyIndex();
  try {
    const raw = JSON.parse(window.localStorage.getItem(SIM_KEY) || "{}");
    if (Array.isArray(raw.batches)) return { batches: raw.batches };
    // migrate the legacy flat shape into a single (slug-less) batch
    if (raw.projectIds || raw.subIds || raw.seedIds) {
      return { batches: [{ slug: "", projectIds: raw.projectIds ?? [], subIds: raw.subIds ?? [], seedIds: raw.seedIds ?? [], scrapNames: raw.scrapNames ?? [], createdClientIds: raw.createdClientIds ?? [] }] };
    }
    return emptyIndex();
  } catch { return emptyIndex(); }
};
const writeIndex = (ix: SimIndex) => { if (typeof window !== "undefined") window.localStorage.setItem(SIM_KEY, JSON.stringify(ix)); };
const write = (key: string, list: unknown) => { if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(list)); };

// ---- extraction-type → seed-type + scrapping-option preset --------------------
export const extractionToSeedType = (ext: string): SeedType => {
  if (ext === "DIGITAL_SHELF_PDP") return "PDP";
  if (ext === "SHELF") return "URL";
  return "KEYWORD"; // MEDIA, SEARCH, AD, DIGITAL_SHELF_PLP (the discovery keyword)
};

/** Seed types VALID for an extraction type — the Seed ↔ Extraction compatibility
 *  matrix: MEDIA / DIGITAL_SHELF_PLP / AD → URL + KEYWORD + API; SEARCH → KEYWORD;
 *  SHELF → URL + API; DIGITAL_SHELF_PDP → PDP. The generator fabricates seeds of
 *  these types so each subscription's seeds are valid for its scrapping option. */
export const seedTypesForExtraction = (ext: string): SeedType[] => {
  switch (ext) {
    case "DIGITAL_SHELF_PDP": return ["PDP"];
    case "SHELF": return ["URL", "API"];
    case "SEARCH": return ["KEYWORD"];
    default: return ["KEYWORD", "URL", "API"]; // MEDIA, DIGITAL_SHELF_PLP, AD
  }
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
// Real seed corpus (collected from tasks > seeds), bucketed by type. The generator
// samples + clones these so fabricated subscriptions carry REAL seed descriptions,
// values, categories, keyword types, page types and discovery keys.
const realByType = (t: SeedType): Seed[] => INITIAL_SEEDS.filter((s) => (s.type ?? "KEYWORD") === t);
const REAL_KEYWORDS = realByType("KEYWORD");
const REAL_URLS = realByType("URL");
const REAL_API = realByType("API");
const REAL_PDPS = realByType("PDP");

// Default seed volume per subscription↔seeds relation. The simulator fabricates this
// many type-correct seeds per subscription (hundreds, for realistic desk-test scale).
export const SEEDS_PER_SUB = 200;

// KEYWORD template pool for a client: curated brand-accurate keywords first (so a
// Samsung job leads with "samsung galaxy", a Danone job with "activia", …), then the
// real keyword corpus to fill — plenty of on-brand keyword seeds.
const keywordPool = (slug: string, store: string): Seed[] => {
  const cat = CLIENT_CATEGORY[slug] ?? "Other > Other > Other";
  const curated: Seed[] = (CLIENT_KEYWORDS[slug] ?? []).map((kw) => ({
    id: "", d: kw, store, cat, c: "", u: "", type: "KEYWORD", status: "Active", value: kw, keywordType: "CATEGORY",
  }));
  return [...curated, ...REAL_KEYWORDS];
};
const poolFor = (type: SeedType, slug: string, store: string): Seed[] =>
  type === "KEYWORD" ? keywordPool(slug, store) : type === "URL" ? REAL_URLS : type === "API" ? REAL_API : REAL_PDPS;

// Clone a template seed into a fresh, valid, globally-unique seed for `store`.
// `dup` (the pool wrapped past its length) appends a counter so within-subscription
// descriptions stay distinct; PDP always gets a unique discoveryKey (+ value).
const cloneForSub = (tmpl: Seed, type: SeedType, store: string, slug: string, salt: number, ti: number, i: number, dup: boolean, fromDiscovery: boolean): Seed => {
  const s: Seed = { ...tmpl, id: uid(), store, c: nowStamp(), u: nowStamp(), status: "Active", type, d: dup ? `${tmpl.d} (${i + 1})` : tmpl.d };
  if (type === "PDP") {
    s.discoveryKey = `${slug}-${salt}-${ti}-${i}`;
    s.value = dup ? `${tmpl.value}?n=${i + 1}` : tmpl.value;
    s.pageType = tmpl.pageType ?? "LEGACY";
    s.isFromDiscovery = fromDiscovery;
  } else if (dup && (type === "URL" || type === "API")) {
    s.value = `${tmpl.value}#${i + 1}`;
  }
  return s;
};

// Build `count` seeds spread across the extraction-compatible `types`, drawn from the
// real corpus and synthesised with unique handles when a pool runs dry — so each
// subscription can carry hundreds of type-correct seeds.
const buildSubSeeds = (types: SeedType[], count: number, store: string, slug: string, salt: number, fromDiscovery = false): Seed[] => {
  const out: Seed[] = [];
  types.forEach((type, ti) => {
    const share = Math.floor(count / types.length) + (ti < count % types.length ? 1 : 0);
    const pool = poolFor(type, slug, store);
    if (!pool.length) return;
    for (let i = 0; i < share; i++) {
      const tmpl = pool[(salt * 7 + ti * 101 + i) % pool.length];
      out.push(cloneForSub(tmpl, type, store, slug, salt, ti, i, i >= pool.length, fromDiscovery));
    }
  });
  return out;
};

// A geolocated (MANUAL) subscription scrapes every location of its store, so the
// location volume = the store's real activeLocationsCount (STORE_LOCATIONS, pulled
// from the prod store entity). The locationSet label reflects that store + count.
const storeLocations = (store: string): number => STORE_LOCATIONS[store] ?? 0;
const locationSetLabel = (store: string): string => {
  const n = storeLocations(store);
  return n > 0 ? `${store} — ${n.toLocaleString()} locations` : "";
};

// One built scenario = the records to persist for a single client (one project).
export type BuiltScenario = {
  slug: string;
  client: Client;
  clientIsNew: boolean;
  project: Project;
  scrappingOptions: ScrappingOptionValues[];
  subscriptions: Subscription[];
  seeds: Seed[];
};

/** Build (but do not persist) a consistent scenario for one client from chosen jobs. */
export function buildScenario(clientSlug: string, jobs: RealJob[], seedsPerSub: number = SEEDS_PER_SUB): BuiltScenario {
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
    const geo = geoToSub(job.geolocMode);
    const locationSet = geo === "MANUAL" ? locationSetLabel(job.store) : "";

    // --- the seeds for this subscription: hundreds of seeds whose TYPES are valid
    // for the option's extraction type (the Seed ↔ Extraction compatibility matrix);
    // KEYWORD seeds lead with the client's brand-accurate terms.
    const subSeeds = buildSubSeeds(seedTypesForExtraction(job.extractionType), seedsPerSub, job.store, clientSlug, ji);

    const optName = `${job.name}`; // reuse the real job name as the option name
    const option: ScrappingOptionValues = { ...EMPTY_SCRAPPING_OPTION, name: optName, status: "Active", extractionType: job.extractionType, ...optionPreset(job.extractionType), createdAt: nowStamp(), updatedAt: nowStamp() };

    const sub: Subscription = {
      ...emptySubscription(), id: uid(), name: job.name, project: project.name, store: job.store,
      seeds: subSeeds.map((s) => s.d), scrappingOption: optName, geo, locationSet,
      frequency: freqFromName(job.name), rotation: geo === "MANUAL" ? ["Locations"] : ["Seeds"],
      status: "Active", businessUnit: job.businessUnit || "GEN",
      createdAt: nowStamp(), updatedAt: nowStamp(),
    };

    // --- discovery (PLP/MEDIA) → create a sibling PDP subscription + destinationOption
    if (isDiscovery(job.extractionType)) {
      const pdpName = job.name.replace(/^(ME|PLP|MAG|MAT|GR|GC|GEO)[^_]*_/, "PDP_");
      const pdpOptName = `${pdpName} (PDP)`;
      const pdpOption: ScrappingOptionValues = { ...EMPTY_SCRAPPING_OPTION, name: pdpOptName, status: "Active", extractionType: "DIGITAL_SHELF_PDP", ...optionPreset("DIGITAL_SHELF_PDP"), createdAt: nowStamp(), updatedAt: nowStamp() };
      const pdpSeeds: Seed[] = buildSubSeeds(["PDP"], seedsPerSub, job.store, clientSlug, ji + 1000, true);
      const pdpSub: Subscription = {
        ...emptySubscription(), id: uid(), name: `${pdpName} (PDP)`, project: project.name, store: job.store,
        seeds: pdpSeeds.map((s) => s.d), scrappingOption: pdpOptName, geo, locationSet,
        frequency: "Weekly", rotation: ["Seeds"], status: "Active", businessUnit: job.businessUnit || "GEN",
        createdAt: nowStamp(), updatedAt: nowStamp(),
      };
      scrappingOptions.push(pdpOption); subscriptions.push(pdpSub); seeds.push(...pdpSeeds);
      assigned.push({ id: pdpSub.id, name: pdpSub.name, store: pdpSub.store, geo: pdpSub.geo, type: "ADDON", expiration: "-" });
      sub.destinationOptions = [pdpSub.name]; // discovery feeds the PDP sibling
    }

    scrappingOptions.push(option); subscriptions.push(sub); seeds.push(...subSeeds);
    assigned.push({ id: sub.id, name: sub.name, store: sub.store, geo: sub.geo, type: "BASE", expiration: "-" });
  });

  project.assignedSubscriptions = assigned;
  return { slug: clientSlug, client, clientIsNew, project, scrappingOptions, subscriptions, seeds };
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
  ix.batches.push({
    slug: b.slug,
    projectIds: [b.project.id],
    subIds: b.subscriptions.map((s) => s.id),
    seedIds: b.seeds.map((s) => s.id),
    scrapNames: b.scrappingOptions.map((o) => o.name),
    createdClientIds: b.clientIsNew ? [b.client.id] : [],
  });
  writeIndex(ix);
}

/** Build + persist for a client in one call. */
export function generateForClient(clientSlug: string, jobs: RealJob[], seedsPerSub?: number): BuiltScenario {
  const built = buildScenario(clientSlug, jobs, seedsPerSub);
  persistScenario(built);
  return built;
}

type ClearCounts = { projects: number; subscriptions: number; scrappingOptions: number; seeds: number; clients: number };

/** Remove the records belonging to the given batches from the 5 stores + client links. */
function removeBatches(batches: SimBatch[]): ClearCounts {
  const projIds = new Set(batches.flatMap((b) => b.projectIds));
  const subIds = new Set(batches.flatMap((b) => b.subIds));
  const seedIds = new Set(batches.flatMap((b) => b.seedIds));
  const scrapNames = new Set(batches.flatMap((b) => b.scrapNames));
  const createdClients = new Set(batches.flatMap((b) => b.createdClientIds));
  write(PROJECTS_KEY, getProjects().filter((p) => !projIds.has(p.id)));
  write(SUBSCRIPTIONS_KEY, getSubscriptions().filter((s) => !subIds.has(s.id)));
  write(SCRAPPING_OPTIONS_KEY, getScrappingOptions().filter((o) => !scrapNames.has(o.name)));
  write(SEEDS_KEY, getSeeds().filter((s) => !seedIds.has(s.id)));
  // unlink these projects from clients; drop the test clients these batches created
  const clients = getClients()
    .filter((c) => !createdClients.has(c.id))
    .map((c) => ({ ...c, assignedProjects: (c.assignedProjects ?? []).filter((ap) => !projIds.has(ap.projectId)) }));
  write(CLIENTS_KEY, clients);
  return { projects: projIds.size, subscriptions: subIds.size, scrappingOptions: scrapNames.size, seeds: seedIds.size, clients: createdClients.size };
}

/** Remove EVERYTHING the simulator created; leaves seeded/real data intact. */
export function clearSimulated(): ClearCounts {
  if (typeof window === "undefined") return { projects: 0, subscriptions: 0, scrappingOptions: 0, seeds: 0, clients: 0 };
  const counts = removeBatches(readIndex().batches);
  writeIndex(emptyIndex());
  return counts;
}

/** Remove only the scenario generated for one client (slug). */
export function clearSimulatedForClient(slug: string): ClearCounts {
  if (typeof window === "undefined") return { projects: 0, subscriptions: 0, scrappingOptions: 0, seeds: 0, clients: 0 };
  const ix = readIndex();
  const counts = removeBatches(ix.batches.filter((b) => b.slug === slug));
  writeIndex({ batches: ix.batches.filter((b) => b.slug !== slug) });
  return counts;
}

export const hasSimulated = (): boolean => readIndex().batches.length > 0;

/** Client slugs that currently have a simulated scenario in the registry. */
export const simulatedSlugs = (): string[] => [...new Set(readIndex().batches.map((b) => b.slug).filter(Boolean))];

// ---- task estimation (mirrors planner + extends with disjoint fan-out) ----------
export function estimateTasks(sub: Subscription, opt?: ScrappingOptionValues): number {
  const seeds = sub.seeds.length || 1;
  const known = sub.store in STORE_LOCATIONS;
  const locations = sub.geo === "MANUAL" ? (known ? Math.max(1, STORE_LOCATIONS[sub.store]) : LOC_VOLUME_TBD) : 1;
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
    if (o && isDiscovery(o.extractionType) && !s.destinationOptions?.length) warns.push(`${s.name}: ${o.extractionType} without a destination (PDP sibling)`);
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
