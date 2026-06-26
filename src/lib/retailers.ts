import { nowStamp } from "./clients";
import { STORE_LOCATIONS, REAL_LOCATION_SETS } from "./scenarioSeedData";
import { BULK_STORES } from "./storesBulk";

// ---------- shared options ----------

export const STORE_TYPE_OPTIONS = ["GEOLOC", "FLAGSHIP"];
export const STORE_CLASS_OPTIONS = ["BRICK_AND_CLICK", "MARKETPLACE", "SPECIALIST", "AGGREGATOR", "DARK_STORE", "PURE_PLAYER", "DIRECT_TO_CONSUMER"];
export const DEVICE_OPTIONS = ["WEB", "APP"];

export const TIMEZONE_OPTIONS = [
  "UTC", "America/New_York", "America/Chicago", "America/Mexico_City", "America/Sao_Paulo",
  "Europe/Madrid", "Europe/Amsterdam", "Europe/Paris", "Europe/Berlin", "Asia/Bangkok", "Africa/Johannesburg",
];

export const LOCALE_OPTIONS = [
  "en-US", "es-ES", "es-MX", "pt-BR", "nl-NL", "fr-FR", "de-DE", "it-IT", "en-ZA", "th-TH",
];

export const COUNTRY_OPTIONS = [
  "US", "ES", "BR", "MX", "FR", "DE", "IT", "NL", "BE", "GR",
  "HU", "ZA", "TH", "PE", "RO", "CO", "UY", "PA", "QA", "AR", "CL", "CA", "EC", "MM", "LT",
  "PT", "CH", "DK", "JP",
];

/** Country code → flag emoji (regional indicator symbols). */
export function flag(code?: string): string {
  if (!code || code.length !== 2) return "";
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", ES: "Spain", BR: "Brazil", MX: "Mexico", FR: "France",
  DE: "Germany", IT: "Italy", NL: "Netherlands", BE: "Belgium", GR: "Greece",
  HU: "Hungary", ZA: "South Africa", TH: "Thailand", PE: "Peru", RO: "Romania",
  CO: "Colombia", UY: "Uruguay", PA: "Panama", QA: "Qatar", AR: "Argentina",
  CL: "Chile", CA: "Canada", EC: "Ecuador", MM: "Myanmar", LT: "Lithuania",
  PT: "Portugal", CH: "Switzerland", DK: "Denmark", JP: "Japan",
};

export function countryLabel(code?: string): string {
  if (!code) return "";
  return `${flag(code)} ${COUNTRY_NAMES[code] ?? code}`;
}

function genId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
}

// ---------- Retailer ----------

export type Retailer = {
  id: string;
  name: string;
  logoUrl: string;
  meta: string; // JSON string
  createdAt: string;
  updatedAt: string;
};

export const RETAILERS_KEY = "retailers:retailers";

// Sourced from the Retailers export (Ecometry / Shalion Console, Jun 2026).
// Representative subset — the full list has ~1,191 retailers.
const R = (id: string, name: string, createdAt: string, updatedAt: string): Retailer => ({ id, name, logoUrl: "", meta: "{}", createdAt, updatedAt });

const BASE_RETAILERS: Retailer[] = [
  R("r1", "24 Pharma BE", "Mon, Jan 9, 2023 8:05 AM", "Tue, Dec 12, 2023 9:22 AM"),
  R("r2", "7 - Eleven APP TH", "Wed, Aug 13, 2025 3:22 PM", "Wed, Aug 13, 2025 3:22 PM"),
  R("r3", "99Food BR", "Thu, Nov 13, 2025 11:35 AM", "Thu, Nov 13, 2025 11:35 AM"),
  R("r4", "Abacus ES", "Tue, Dec 19, 2023 11:52 AM", "Tue, Dec 19, 2023 11:52 AM"),
  R("r5", "AB-Delhaize GR", "Tue, Jan 14, 2025 7:22 PM", "Tue, Jan 14, 2025 7:22 PM"),
  R("r6", "Agora APP PE", "Wed, Apr 16, 2025 3:21 PM", "Wed, Apr 16, 2025 3:21 PM"),
  R("r7", "Ahorramas ES", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r8", "AiqFome BR", "Sun, Feb 9, 2025 5:52 PM", "Sun, Feb 9, 2025 5:52 PM"),
  R("r9", "Albert Heijn BE", "Mon, Jan 9, 2023 8:05 AM", "Sun, Apr 7, 2024 9:53 AM"),
  R("r10", "Albert Heijn NL", "Mon, Jan 9, 2023 8:05 AM", "Wed, Nov 6, 2024 12:05 PM"),
  R("r11", "Albertsons US", "Tue, Aug 19, 2025 6:47 PM", "Tue, Mar 17, 2026 2:10 PM"),
  R("r12", "Alcampo ES", "Mon, Jan 9, 2023 8:05 AM", "Wed, Nov 6, 2024 12:03 PM"),
  R("r13", "AlfaDrink RO", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r14", "Almerina ES", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r15", "Aloia Cosmetics SB", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r16", "Alkohol CZ", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r17", "Alkoholempu HU", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r18", "Alkoshop SK", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r19", "Alkosto CO", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r20", "Allegro CZ", "Thu, Feb 22, 2024 8:05 PM", "Thu, Feb 22, 2024 8:05 PM"),
  R("r21", "Allegro PL", "Thu, Feb 23, 2024 8:57 PM", "Wed, Nov 6, 2024 12:07 PM"),
  R("r22", "All retailers (don't delete)", "Tue, May 28, 2024 7:36 PM", "Tue, May 28, 2024 7:36 PM"),
  R("r23", "Almendara PE", "Tue, Oct 3, 2023 2:10 PM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r24", "Alphamega CY", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r25", "AI Super MX", "Thu, Mar 6, 2025 1:23 PM", "Thu, Mar 6, 2025 1:23 PM"),
  R("r26", "Alternate DE", "Tue, Jul 4, 2023 11:16 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r27", "Altex RO", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r28", "Alza CZ", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r29", "Alza HU", "Thu, Feb 22, 2024 9:13 PM", "Thu, Feb 22, 2024 9:13 PM"),
  R("r30", "Amara ES", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r31", "Amaro BR", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r32", "Amazon AE", "Tue, Apr 11, 2023 6:00 PM", "Mon, Nov 4, 2024 11:03 AM"),
  R("r33", "Amazon AU", "Fri, Dec 20, 2024 1:42 PM", "Tue, Jan 28, 2025 3:51 PM"),
  R("r34", "Amazon BE", "Fri, Sep 1, 2023 5:45 PM", "Mon, Nov 4, 2024 11:02 AM"),
  R("r35", "Amazon BR", "Mon, Jan 9, 2023 8:05 AM", "Mon, Nov 4, 2024 11:03 AM"),
  R("r36", "Amazon CA", "Fri, Dec 20, 2024 11:56 AM", "Sun, Feb 16, 2025 9:19 AM"),
  R("r37", "Amazon DE", "Mon, Jan 9, 2023 8:05 AM", "Mon, Nov 4, 2024 11:04 AM"),
  R("r38", "Amazon EG", "Fri, Sep 1, 2023 5:45 PM", "Mon, Nov 4, 2024 11:02 AM"),
  R("r39", "Amazon ES", "Mon, Jan 9, 2023 8:05 AM", "Mon, Nov 4, 2024 11:04 AM"),
  R("r40", "Amazon FR", "Mon, Jan 9, 2023 8:05 AM", "Mon, Nov 4, 2024 11:04 AM"),
  R("r41", "Amazon IE", "Thu, Nov 13, 2025 1:37 PM", "Tue, Feb 17, 2026 9:50 AM"),
  R("r42", "Amazon IN", "Mon, Jan 9, 2023 8:05 AM", "Mon, Nov 4, 2024 11:02 AM"),
  R("r43", "Amazon IT", "Mon, Jan 9, 2023 8:05 AM", "Mon, Nov 4, 2024 11:02 AM"),
  R("r44", "Amazon JP", "Mon, Jan 9, 2023 8:05 AM", "Mon, Nov 4, 2024 11:05 AM"),
  R("r45", "Amazon MX", "Mon, Jan 9, 2023 8:05 AM", "Mon, Nov 4, 2024 11:04 AM"),
  R("r46", "Amazon NL", "Thu, Aug 31, 2023 3:32 PM", "Mon, Nov 4, 2024 11:03 AM"),
  R("r47", "Amazon PL", "Fri, Feb 23, 2024 12:29 PM", "Mon, Nov 4, 2024 11:05 AM"),
  R("r48", "Amazon SA", "Fri, Sep 1, 2023 5:45 PM", "Mon, Nov 4, 2024 11:03 AM"),
  R("r49", "Amazon SE", "Fri, Sep 1, 2023 5:45 PM", "Mon, Nov 4, 2024 11:01 AM"),
  R("r50", "Amazon SG", "Mon, Jan 9, 2023 8:05 AM", "Mon, Nov 4, 2024 11:05 AM"),
  R("r51", "Amazon TR", "Fri, Sep 1, 2023 5:45 PM", "Mon, Nov 4, 2024 11:04 AM"),
  R("r52", "Amazon UK", "Mon, Jan 9, 2023 8:05 AM", "Mon, Sep 1, 2025 6:25 PM"),
  R("r53", "Amazon US", "Mon, Jan 9, 2023 8:05 AM", "Mon, Nov 4, 2024 11:03 AM"),
  R("r54", "Americanas BR", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r55", "Amica Farmacia IT", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r56", "Amobeleza BR", "Wed, Jan 18, 2023 1:34 PM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r57", "Amwine RU", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r58", "Ananas RS", "Fri, Dec 1, 2023 6:45 PM", "Mon, Dec 18, 2023 8:17 AM"),
  R("r59", "Angeloni App BR", "Fri, Feb 28, 2025 7:09 PM", "Fri, Feb 28, 2025 7:09 PM"),
  R("r60", "Angeloni BR", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r61", "AO UK", "Wed, Apr 15, 2026 7:10 PM", "Wed, Apr 15, 2026 7:10 PM"),
  R("r62", "Apo Discounter DE", "Fri, Jan 13, 2023 5:25 PM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r63", "Apoio Entrega BR", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r64", "Aponeo DE", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r65", "Apotheke DE", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r66", "AppDerma PE", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r67", "Applebee's US", "Wed, Apr 1, 2026 6:40 PM", "Wed, Apr 1, 2026 6:40 PM"),
  R("r68", "Araujo BR", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r69", "Arby's US", "Mon, Apr 13, 2026 7:29 PM", "Mon, Apr 13, 2026 7:29 PM"),
  R("r70", "Arcaplanet IT", "Wed, Oct 9, 2024 2:37 PM", "Wed, Oct 9, 2024 2:37 PM"),
  R("r71", "Arco Mix BR", "Thu, Oct 19, 2023 4:16 PM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r72", "Arenal ES", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r73", "Argos UK", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r74", "Aromas ES", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r75", "Aruma PE", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r76", "Asda UK", "Mon, Jan 9, 2023 8:05 AM", "Wed, Nov 6, 2024 12:08 PM"),
  R("r77", "Atacadao BR", "Fri, Sep 8, 2023 9:54 PM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r78", "Atida Mifarma ES", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r79", "Atida Mifarma PT", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r80", "Atida Sante Discount FR", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
  R("r81", "Aubert FR", "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"),
];

export function getRetailers(): Retailer[] {
  const list = readList<Retailer>(RETAILERS_KEY);
  const base = list.length ? list : INITIAL_RETAILERS;
  return [...base, ...deriveStoreRetailers(base)];
}

export function emptyRetailer(): Retailer {
  return { id: genId(), name: "", logoUrl: "", meta: "{}", createdAt: nowStamp(), updatedAt: nowStamp() };
}

// ---------- Store ----------

export type StoreLocation = {
  id: string;
  name: string;
  locator: string;
  address: string;
  city: string;
  postal: string;
  status: "Active" | "Inactive";
};

export type Store = {
  id: string;
  name: string;
  domain: string;
  retailer: string;
  type: string; // GEOLOC | FLAGSHIP
  klass: string; // BRICK_AND_CLICK | MARKETPLACE | ...
  device: string; // WEB | APP
  country: string;
  status: "Active" | "Inactive";
  ecometryId?: string;
  timezone?: string;
  locale?: string;
  logoUrl?: string;
  meta?: string; // JSON string
  locations?: StoreLocation[];
  /** Real total active locations for this store (from the prod store entity). */
  activeLocationsCount?: number;
  createdAt: string;
  updatedAt: string;
};

export const STORES_KEY = "retailers:stores";

export const INITIAL_STORES: Store[] = BULK_STORES;

// Every retailer referenced by a store's "Retailer" column should exist as a
// Retailer record (so its Stores sub-table is populated). Merge the distinct
// store retailers that aren't already in the base list.
function retailerSlugId(name: string): string {
  return "ret-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const baseRetailerNames = new Set(BASE_RETAILERS.map((r) => r.name));
const derivedRetailers: Retailer[] = [...new Set(INITIAL_STORES.map((s) => s.retailer))]
  .filter((name) => name && !baseRetailerNames.has(name))
  .map((name) => R(retailerSlugId(name), name, "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"));

export const INITIAL_RETAILERS: Retailer[] = [...BASE_RETAILERS, ...derivedRetailers];

/**
 * Retailers referenced by a store's "Retailer" column that aren't in `existing`.
 * Surfaced as retailer records (stable slug id) so they always appear in the
 * Retailers list/edit even when persisted data predates this behavior.
 */
export function deriveStoreRetailers(existing: Retailer[]): Retailer[] {
  const names = new Set(existing.map((r) => r.name));
  return [...new Set(getStores().map((s) => s.retailer))]
    .filter((name) => name && !names.has(name))
    .map((name) => R(retailerSlugId(name), name, "Mon, Jan 9, 2023 8:05 AM", "Mon, Dec 11, 2023 11:24 AM"));
}

export function getStores(): Store[] {
  const list = readList<Store>(STORES_KEY);
  const base = list.length ? list : INITIAL_STORES;
  // Attach the real active-location count from the prod store entity (matched by
  // name) so the mockup store catalog reflects production location volumes.
  return base.map((s) => ({ ...s, activeLocationsCount: s.activeLocationsCount ?? STORE_LOCATIONS[s.name] ?? 0 }));
}

/**
 * Real per-store active-location count keyed by store name, for every store in the
 * prod store entity (≈1,677). This is the authoritative location volume the Value
 * Stream Map / task estimator scale by — far wider coverage than the curated
 * STORE_LOCATIONS subset, so a MANUAL subscription's tasks = seeds × the store's
 * own active locations whenever its store is on record.
 */
export function storeLocationCounts(): Map<string, number> {
  return new Map(getStores().map((s) => [s.name, s.activeLocationsCount ?? 0]));
}

/** A real SAMPLE of a store's locations (from the live backoffice /admin/locations pull,
 *  matched by store name) mapped to the StoreLocation shape — used to populate the Store
 *  form's Locations tab so simulations are easier to trust. Empty when the store wasn't in
 *  the sampled pull. Display-only: not persisted unless the user edits + saves the store. */
export function sampleStoreLocations(storeName: string): StoreLocation[] {
  const set = REAL_LOCATION_SETS.find((s) => s.store === storeName);
  if (!set) return [];
  return set.locations.map((l, i) => ({
    id: `rl-${storeName}-${i}`, name: l.name, locator: "", address: l.address, city: l.city, postal: l.postal, status: "Active" as const,
  }));
}

export function emptyStore(): Store {
  return { id: genId(), name: "", domain: "", retailer: "", type: "GEOLOC", klass: "BRICK_AND_CLICK", device: "WEB", country: "", status: "Active", ecometryId: "", timezone: "", locale: "", logoUrl: "", meta: "{}", locations: [], createdAt: nowStamp(), updatedAt: nowStamp() };
}

// ---------- Location Catalog (ex Region System) ----------
// Region System → Location Catalog generalization (RFC TECH-15730 area). A catalog
// groups location SETS (ex "Region"); each set holds locations (ex RegionLocation).
// Store / Location base entities are unchanged. Client enablement carries `useCases`.

export type SetLocation = {
  id: string;
  name: string;
  city: string;
  address: string;
  postal: string;
  store: string;
};

export type LocationSet = {
  id: string;
  name: string;
  // Sets are neutral buckets; the purpose/use-case dimension lives on the CATALOG (below).
  locations: SetLocation[];
};

// Use cases a client enables a catalog for (replaces the never-shipped `type` tag).
export const USE_CASE_OPTIONS = ["DASHBOARD", "MSRP", "ASSORTMENT", "SCRAPING"] as const;
export type UseCase = (typeof USE_CASE_OPTIONS)[number];

// A catalog's `purposes` shares the same vocabulary as the client `useCases` (RFC §5.1: the
// type→use-case dimension). Kept under its own name so the catalog-level concept can diverge.
export const PURPOSE_OPTIONS = USE_CASE_OPTIONS;
export type Purpose = UseCase;

export type LocationCatalog = {
  id: string;
  name: string;
  country: string;
  /**
   * Which product flows this catalog is meant for — zero or more, optional (empty = no
   * specific purpose). Multi-select, same vocabulary as the client `useCases`. (Moved up
   * from the location set: the catalog, not its buckets, carries the purpose.)
   */
  purposes?: Purpose[];
  /** Location sets (buckets) — ex Region. */
  sets?: LocationSet[];
  createdAt: string;
  updatedAt: string;
};

const BR_STATE_NAMES = [
  "Paraíba", "Rondônia", "Alagoas", "Mato Grosso", "Minas Gerais", "Mato Grosso do Sul",
  "Rio Grande do Sul", "Rio de Janeiro", "São Paulo", "Bahia", "Ceará", "Pará", "Paraná",
  "Pernambuco", "Santa Catarina", "Goiás", "Maranhão", "Espírito Santo", "Amazonas",
  "Rio Grande do Norte", "Piauí", "Distrito Federal", "Sergipe", "Tocantins", "Acre",
];

const BR_STATES: LocationSet[] = BR_STATE_NAMES.map((name, i) => ({
  id: `br-${i}`,
  name,
  locations: i === 0
    ? [
        { id: "rl1", name: "Pao de Acucar BR", city: "João Pessoa - Paraíba", address: "Av. Governador Flávio Ribeiro Coutinho", postal: "58037-000", store: "Pao de Acucar BR" },
        { id: "rl2", name: "João Pessoa - Carrefour BR", city: "João Pessoa - Paraíba", address: "Carrefour BR - R Brasília", postal: "58036-460", store: "Carrefour BR" },
      ]
    : [],
}));

export function emptyLocationSet(): LocationSet {
  return { id: genId(), name: "New location set", locations: [] };
}

// Pool of locations that can be assigned to a set — REAL location names sampled from the
// live backoffice /admin/locations pull (see locationsBulk.ts), deduped + capped.
export const ASSIGNABLE_LOCATIONS: string[] = [
  ...new Set(REAL_LOCATION_SETS.flatMap((s) => s.locations.map((l) => l.name))),
].slice(0, 100);

/**
 * Assignable-location pool scoped to a catalog's country — a real sample of locations
 * from `REAL_LOCATION_SETS` whose store is in that country, deduped by name and capped.
 * Each entry carries its real city / address / postal / store so an assigned location
 * shows real data. Returns `[]` when the country has no real sample (caller may fall back
 * to {@link ASSIGNABLE_LOCATIONS}). Match by ISO country code (e.g. `ES`, `BR`).
 */
export function assignableLocationsForCountry(country: string, cap = 150): SetLocation[] {
  const cc = (country || "").toUpperCase();
  if (!cc) return [];
  const sets = REAL_LOCATION_SETS.filter((s) => s.country === cc);
  if (!sets.length) return [];
  const seen = new Set<string>();
  const out: SetLocation[] = [];
  // Round-robin across the country's stores so the sample is diverse (a few per store)
  // rather than dominated by one huge store (e.g. a 40k-location delivery app).
  for (let i = 0, more = true; more && out.length < cap; i++) {
    more = false;
    for (const set of sets) {
      const l = set.locations[i];
      if (!l) continue;
      more = true;
      if (seen.has(l.name)) continue;
      seen.add(l.name);
      out.push({ id: `pool-${cc}-${out.length}`, name: l.name, city: l.city, address: l.address, postal: l.postal, store: set.store });
      if (out.length >= cap) break;
    }
  }
  return out;
}

export const LOCATION_CATALOGS_KEY = "retailers:location-catalogs";

export const INITIAL_LOCATION_CATALOGS: LocationCatalog[] = [
  { id: "rs1", name: "LT - Administrative Region", country: "LT", createdAt: "Tue, Apr 8, 2025 2:49", updatedAt: "Tue, Apr 8, 2025 2:49" },
  { id: "rs2", name: "ZA - Provinces", country: "ZA", createdAt: "Mon, Aug 12, 2024 8:00", updatedAt: "Mon, Aug 12, 2024 8:00" },
  { id: "rs3", name: "CO - Coke Bottlers", country: "CO", createdAt: "Mon, May 19, 2025 8:00", updatedAt: "Mon, May 19, 2025 8:00" },
  { id: "rs4", name: "BR - Unidades Federativas do Brasil", country: "BR", sets: BR_STATES, createdAt: "Thu, Jun 20, 2024 11:10", updatedAt: "Sun, Jul 21, 2024 9:30" },
  { id: "rs5", name: "UY - Coke Bottlers", country: "UY", createdAt: "Mon, May 19, 2025 8:00", updatedAt: "Mon, May 19, 2025 8:00" },
  { id: "rs6", name: "PA - Coke Bottlers", country: "PA", createdAt: "Mon, May 19, 2025 8:00", updatedAt: "Mon, May 19, 2025 8:00" },
  { id: "rs7", name: "QA - Municipality", country: "QA", createdAt: "Tue, Dec 24, 2024 6:30", updatedAt: "Thu, Dec 26, 2024 6:00" },
  { id: "rs8", name: "FR - Département", country: "FR", createdAt: "Mon, Aug 5, 2024 9:30", updatedAt: "Mon, Aug 5, 2024 9:30" },
  { id: "rs9", name: "AR - Provincia", country: "AR", createdAt: "Sun, May 25, 2025 7:00", updatedAt: "Sun, May 25, 2025 7:00" },
  { id: "rs10", name: "CL - Zonas", country: "CL", createdAt: "Sun, May 25, 2025 7:00", updatedAt: "Sun, May 25, 2025 7:00" },
  { id: "rs11", name: "NO USAR - ES - Cities", country: "ES", createdAt: "Mon, Jun 24, 2024 8:00", updatedAt: "Sun, Jul 21, 2024 4:19" },
  { id: "rs12", name: "CA - Regions", country: "CA", createdAt: "Fri, Jan 24, 2025 4:13", updatedAt: "Fri, Jan 24, 2025 4:13" },
  { id: "rs13", name: "EC - Coke Bottlers", country: "EC", createdAt: "Mon, May 19, 2025 8:00", updatedAt: "Mon, May 19, 2025 8:00" },
];

export function getLocationCatalogs(): LocationCatalog[] {
  const list = readList<LocationCatalog>(LOCATION_CATALOGS_KEY);
  return list.length ? list : INITIAL_LOCATION_CATALOGS;
}

export function emptyLocationCatalog(): LocationCatalog {
  return { id: genId(), name: "", country: "", purposes: [], sets: [], createdAt: nowStamp(), updatedAt: nowStamp() };
}

// ---------- shared persistence read (SSR-safe) ----------

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}
