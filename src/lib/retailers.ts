import { nowStamp } from "./clients";
import { STORE_LOCATIONS, REAL_LOCATION_SETS } from "./scenarioSeedData";
import { BULK_STORES } from "./storesBulk";
import { versionedKey } from "./appVersion";

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
  // Real number of locations in this set (from region_location); locations[] may be empty/sampled.
  locationCount?: number;
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
  {
    id: "52e04543-c791-35a2-bd61-19d05c2de847",
    name: "AE - PVM",
    country: "AE",
    createdAt: "Thu, Nov 28, 2024 1:50 PM",
    updatedAt: "Fri, Mar 7, 2025 8:59 AM",
    sets: [
    { id: "f2c2bc28-ad46-32be-96a1-3f28d8988756", name: "Abu Dhabi and Al Ain", locationCount: 48, locations: [] },
    { id: "17bdfac1-393a-3575-97c0-df6c371b5ee7", name: "Dubai", locationCount: 152, locations: [] },
    { id: "7603808d-7972-3998-9dfa-39c14a0df4c7", name: "Sharjah and Northern Emirates", locationCount: 19, locations: [] },
  ],
  },
  {
    id: "69217e63-9a32-3016-a817-e50590e8734b",
    name: "AR - Coke Bottlers",
    country: "AR",
    createdAt: "Mon, May 19, 2025 8:54 AM",
    updatedAt: "Mon, May 19, 2025 8:54 AM",
    sets: [
    { id: "0e108f41-dcea-385c-8f66-20c07f830bfd", name: "Andina AR", locationCount: 323, locations: [] },
    { id: "d26ef3de-85cd-46fa-942b-412674f5ae41", name: "Arca AR", locationCount: 91, locations: [] },
    { id: "75f3a961-aaf6-4d31-b352-1dc6f4d9d3ee", name: "FEMSA AR", locationCount: 997, locations: [] },
    { id: "a05ce268-9e48-3600-85f4-524317bf4857", name: "Lee AR", locationCount: 216, locations: [] },
  ],
  },
  {
    id: "35833bb4-b5b5-3de7-8844-15a479f55f6e",
    name: "AR - Provincia",
    country: "AR",
    createdAt: "Sun, May 25, 2025 7:26 PM",
    updatedAt: "Sun, May 25, 2025 7:26 PM",
    sets: [
    { id: "dba71793-0b78-3b2c-bd44-02143fdf5b3f", name: "Buenos Aires", locationCount: 61, locations: [] },
    { id: "f4ecbafa-34e8-3352-9590-ab5c80b9e060", name: "Catamarca", locationCount: 1, locations: [] },
    { id: "391eea24-023c-3849-9a21-ee107e68bdd6", name: "Chaco", locationCount: 2, locations: [] },
    { id: "ada9b9c6-0c78-3f67-8caf-f2a3e564417a", name: "Chubut", locationCount: 4, locations: [] },
    { id: "0ad75df9-8bf2-3bad-8fa9-a1c181fc86b8", name: "Ciudad Autónoma de Buenos Aires", locationCount: 77, locations: [] },
    { id: "3523d229-7b98-3b96-a04d-14e2b6fc9597", name: "Corrientes", locationCount: 4, locations: [] },
    { id: "ecb77503-160d-3c2d-8482-f04eaf5842fb", name: "Córdoba", locationCount: 5, locations: [] },
    { id: "83988764-a2ac-3b95-a02e-242b299d4074", name: "Entre Ríos", locationCount: 3, locations: [] },
    { id: "43cb1dbb-0f93-3e6c-8d6a-a00b80256b9f", name: "Formosa", locationCount: 1, locations: [] },
    { id: "2573dd77-46d0-3064-ad83-ddd4887657ec", name: "Jujuy", locationCount: 0, locations: [] },
    { id: "739401c0-363d-312b-802b-5165d5d88104", name: "La Pampa", locationCount: 0, locations: [] },
    { id: "1eb7159e-c56b-3e79-857c-4860d23fea37", name: "La Rioja", locationCount: 0, locations: [] },
    { id: "b96731e7-e05e-3f32-9d30-8dd877a06727", name: "Mendoza", locationCount: 6, locations: [] },
    { id: "0ddf386c-6fa8-3407-8a06-005b9d150ee5", name: "Misiones", locationCount: 0, locations: [] },
    { id: "5b8528d3-1733-3c68-bf5a-aac399a6c893", name: "Neuquén", locationCount: 3, locations: [] },
    { id: "8bda24d5-25c0-3e12-a2f7-66dcc39c543c", name: "Pending", locationCount: 52, locations: [] },
    { id: "a445ce95-b29e-33cf-bb29-073ca24c1dfd", name: "Río Negro", locationCount: 1, locations: [] },
    { id: "631e7824-a1a0-3354-8317-ebf460391b8f", name: "Salta", locationCount: 4, locations: [] },
    { id: "4232040b-f87a-3e86-8a0b-fcfc1c62e51d", name: "San Juan", locationCount: 1, locations: [] },
    { id: "7e069696-6c60-35f6-ac6b-a9b9f9e9492b", name: "San Luis", locationCount: 1, locations: [] },
    { id: "c21185e7-7896-30a4-babd-c1653b9b95a3", name: "Santa Cruz", locationCount: 1, locations: [] },
    { id: "38c835bd-037e-335b-b403-6587b4285ecd", name: "Santa Fe", locationCount: 6, locations: [] },
    { id: "c9181e80-7613-3637-af7a-23f9f23886ab", name: "Santiago del Estero", locationCount: 0, locations: [] },
    { id: "4d170dda-f2ec-3edc-8e22-cb1708967aa0", name: "Tierra del Fuego", locationCount: 2, locations: [] },
    { id: "4552cc1a-c23b-3dbc-b7ce-0b9d6078264a", name: "Tucumán", locationCount: 5, locations: [] },
  ],
  },
  {
    id: "dff2b75f-4933-3589-81d6-bd768c0fc5ab",
    name: "AU - States",
    country: "AU",
    createdAt: "Thu, May 29, 2025 8:58 AM",
    updatedAt: "Thu, May 29, 2025 8:58 AM",
    sets: [
    { id: "215671bf-9fb8-3d72-adf8-dab8860e1725", name: "Australian Capital Territory - ACT", locationCount: 0, locations: [] },
    { id: "2cc39c29-fb7e-3450-a69d-479f0fc6f038", name: "New South Wales - NSW", locationCount: 7, locations: [] },
    { id: "b6e14d0b-20cb-3aaa-b178-71fb21a9df70", name: "Northern Territory - NT", locationCount: 3, locations: [] },
    { id: "dc395dba-1a66-32d0-b79e-80940f0d9e96", name: "Queensland - QLD", locationCount: 3, locations: [] },
    { id: "8cd3862b-0b61-3372-a77f-8667cab50f53", name: "South Australia - SA", locationCount: 10, locations: [] },
    { id: "7a3dd5dd-c8da-3149-bebe-98db843918bc", name: "Tasmania - TAS", locationCount: 2, locations: [] },
    { id: "bb5d25ea-211b-3f07-83a4-a214a834a993", name: "Victoria - VIC", locationCount: 10, locations: [] },
    { id: "11e1ee3c-53c9-3edb-841e-54adba347e66", name: "Western Australia - WA", locationCount: 64, locations: [] },
  ],
  },
  {
    id: "e0e57362-896f-3189-a6f3-26c3b31a4a24",
    name: "BO - Coke Bottlers",
    country: "BO",
    createdAt: "Mon, May 19, 2025 8:56 AM",
    updatedAt: "Mon, May 19, 2025 8:56 AM",
    sets: [
    { id: "5817cf38-3bbf-33c7-a0b0-e2a3920b29f0", name: "Embol BO", locationCount: 315, locations: [] },
  ],
  },
  {
    id: "c4d79bf5-426a-366d-b012-7e38d79195d1",
    name: "BR - Coke Bottlers",
    country: "BR",
    createdAt: "Mon, May 19, 2025 8:56 AM",
    updatedAt: "Mon, May 19, 2025 8:56 AM",
    sets: [
    { id: "234187ce-94bc-4e4f-8e66-ecf0d5661a6c", name: "Andina BR", locationCount: 619, locations: [] },
    { id: "8ac79e18-eb53-4279-bd07-989df8c81090", name: "Bandeirantes BR", locationCount: 11, locations: [] },
    { id: "ba8216ad-78d5-42b6-9799-abd44ec8e48e", name: "Brasal BR", locationCount: 129, locations: [] },
    { id: "9f01bbf9-acee-480b-951c-5708c234fa8e", name: "FEMSA BR", locationCount: 2370, locations: [] },
    { id: "6a0a3efc-20c0-4ad7-81d2-cb1696e626be", name: "Solar BR", locationCount: 507, locations: [] },
    { id: "02813707-7d3b-4666-8834-9df1600aa541", name: "Sorocaba BR", locationCount: 103, locations: [] },
    { id: "eab02359-8689-4345-ad59-e3a716b60084", name: "Uberlandia BR", locationCount: 45, locations: [] },
  ],
  },
  {
    id: "ce305279-a31e-342b-a37c-5dacda5a8cf5",
    name: "BR - Regions",
    country: "BR",
    createdAt: "Sun, Jul 21, 2024 9:55 AM",
    updatedAt: "Sun, Jul 21, 2024 9:55 AM",
    sets: [
    { id: "c7c917b2-3993-3a0e-a4af-ad44ae1d5ef6", name: "Centro-Oeste", locationCount: 14, locations: [] },
    { id: "e191ec6d-df46-36d2-8182-f9d326f75653", name: "Nordeste", locationCount: 27, locations: [] },
    { id: "fcc4e7de-1f89-3801-b4b3-6a1177572f92", name: "Norte", locationCount: 9, locations: [] },
    { id: "2758eff9-f8cd-32a0-a454-24016a8c5bec", name: "Sudeste", locationCount: 264, locations: [] },
    { id: "d1045170-a60f-3d0d-8a69-5f3c6417777d", name: "Sul", locationCount: 54, locations: [] },
  ],
  },
  {
    id: "0d46bd31-31fd-3291-9492-6e78e141c1e5",
    name: "BR - Unidades Federativas do Brasil",
    country: "BR",
    createdAt: "Thu, Jun 20, 2024 11:11 AM",
    updatedAt: "Sun, Jul 21, 2024 9:33 AM",
    sets: [
    { id: "0b485957-4be6-363b-a6e3-1163e7645538", name: "Alagoas", locationCount: 1, locations: [] },
    { id: "90da0391-3be1-3a0a-8d3c-02fbbd95c5ff", name: "Amapá", locationCount: 0, locations: [] },
    { id: "a0c49595-d6f1-3865-90aa-0eedc3f9c0a9", name: "Amazonas", locationCount: 3, locations: [] },
    { id: "e4c6fb5d-0f4c-3c2e-9ec4-cee0fad487ab", name: "Ceará", locationCount: 5, locations: [] },
    { id: "dddbbe8a-1031-3b3e-aa6f-53e497fe689d", name: "Distrito Federal", locationCount: 7, locations: [] },
    { id: "2e38fbef-3aa1-3b0b-a7d6-88706b96df42", name: "Espírito Santo", locationCount: 1, locations: [] },
    { id: "39e0e992-9fa8-3d5d-be39-9430aaf6d112", name: "Goiás", locationCount: 3, locations: [] },
    { id: "7b09b30e-f941-308a-89eb-86afeff9008c", name: "Maranhão", locationCount: 0, locations: [] },
    { id: "0ce14491-ceac-3db2-986c-3e2a39b9e7aa", name: "Mato Grosso", locationCount: 3, locations: [] },
    { id: "0f31d3da-32f1-326b-998a-2480a59b6c02", name: "Mato Grosso do Sul", locationCount: 2, locations: [] },
    { id: "0ecc9b01-6d8a-373c-b731-25f565c3696e", name: "Minas Gerais", locationCount: 12, locations: [] },
    { id: "f8d65318-3193-3dfc-a281-588386598b89", name: "Paraná", locationCount: 19, locations: [] },
    { id: "0127c359-952b-306a-9ad7-c915f05723b4", name: "Paraíba", locationCount: 2, locations: [] },
    { id: "fde20167-7f7b-31f6-a67f-7f6fd8f63802", name: "Pará", locationCount: 2, locations: [] },
    { id: "939f04f9-01df-310c-9e29-be40c5d0008b", name: "Pernambuco", locationCount: 14, locations: [] },
    { id: "ada8d5ea-ef06-3564-a7f1-df2d8ecc4fa1", name: "Piauí", locationCount: 2, locations: [] },
    { id: "180524b5-6170-3146-8337-6d5ec49a6851", name: "Rio de Janeiro", locationCount: 46, locations: [] },
    { id: "c1d9cfc5-8710-3fcb-b489-be0b06174746", name: "Rio Grande do Norte", locationCount: 5, locations: [] },
    { id: "11e7387a-c415-3e1b-bd0a-c5737e8ebb10", name: "Rio Grande do Sul", locationCount: 5, locations: [] },
    { id: "05372aee-88b6-390e-9188-ef2393442d14", name: "Rondônia", locationCount: 3, locations: [] },
    { id: "299d0a64-e722-3b22-a1a6-be8eec4f97a1", name: "Roraima", locationCount: 1, locations: [] },
    { id: "3cdaafe1-293c-3a6e-8a2d-54e706ac2f46", name: "Santa Catarina", locationCount: 30, locations: [] },
    { id: "6b3c6a35-9386-3397-b2e7-8876a1a990e5", name: "Sergipe", locationCount: 2, locations: [] },
    { id: "1899f375-36d4-3fd6-b22a-a6becfe192d1", name: "São Paulo", locationCount: 195, locations: [] },
    { id: "b38311cc-d8e4-3bfa-9d51-5a0c6124e22c", name: "Tocantins", locationCount: 0, locations: [] },
  ],
  },
  {
    id: "435ec096-6e00-3b27-9a3d-d2d43b5552d6",
    name: "CA - Regions",
    country: "CA",
    createdAt: "Fri, Jan 24, 2025 4:13 PM",
    updatedAt: "Fri, Jan 24, 2025 4:13 PM",
    sets: [
    { id: "249fac06-0ac2-3b16-863f-3942e3a6b6ae", name: "Central Canada", locationCount: 15, locations: [] },
    { id: "ccfa8348-7269-36d7-a5ef-79c1f0ba0873", name: "East Canada", locationCount: 6, locations: [] },
    { id: "dd992b64-eef4-3634-a4d3-2623c3a89cac", name: "Western Canada", locationCount: 5, locations: [] },
  ],
  },
  {
    id: "71ef66fa-cb07-32b1-a751-72ac4f1f15a6",
    name: "CL - Coke Bottlers",
    country: "CL",
    createdAt: "Mon, May 19, 2025 8:55 AM",
    updatedAt: "Mon, May 19, 2025 8:55 AM",
    sets: [
    { id: "65d387ca-a39a-4346-88b5-7246564d4efe", name: "Andina CL", locationCount: 286, locations: [] },
    { id: "3faf440c-7f91-487d-b00c-65b0a6e7459e", name: "Embonor CL", locationCount: 230, locations: [] },
  ],
  },
  {
    id: "3c08892c-2d14-3f2d-8e50-0bcc8a88e923",
    name: "CL - Zonas",
    country: "CL",
    createdAt: "Sun, May 25, 2025 7:30 PM",
    updatedAt: "Sun, May 25, 2025 7:30 PM",
    sets: [
    { id: "362cf054-3f2c-3560-9008-c0bddc2acd35", name: "Región de Antofagasta", locationCount: 5, locations: [] },
    { id: "e079cf81-f123-3063-9833-e72cb2bd7f6c", name: "Región de Arica y Parinacota", locationCount: 8, locations: [] },
    { id: "3d026462-d96a-3526-aba0-e52c7dd844ff", name: "Región de Atacama", locationCount: 16, locations: [] },
    { id: "19e43ffa-7ad7-30eb-9f43-94e4e41f720f", name: "Región de Aysén del General Carlos Ibáñez del Campo", locationCount: 0, locations: [] },
    { id: "efc25c87-c950-3cfb-8b8f-81dd275f0c36", name: "Región de Coquimbo", locationCount: 9, locations: [] },
    { id: "095db5c0-8e38-353f-8a92-3c82e5eecc15", name: "Región de La Araucanía", locationCount: 0, locations: [] },
    { id: "e8964d16-5873-326a-b884-6dc149530e89", name: "Región de Los Lagos", locationCount: 18, locations: [] },
    { id: "7c51ce2a-0b67-3460-91a7-0950727ef3bf", name: "Región de Los Ríos", locationCount: 11, locations: [] },
    { id: "00706e63-9dfb-3f0e-a794-51915c303b7c", name: "Región de Magallanes y de la Antártica Chilena", locationCount: 3, locations: [] },
    { id: "3837b36f-bf47-37d7-b813-31c7dfc9329e", name: "Región de O'Higgins", locationCount: 42, locations: [] },
    { id: "dc75bb43-9602-3f21-8bf2-3726273b72b9", name: "Región de Tarapacá", locationCount: 14, locations: [] },
    { id: "79059713-389f-3d4e-8f66-097d3e218e4d", name: "Región de Valparaíso", locationCount: 55, locations: [] },
    { id: "7c4ff2da-72f4-30a6-a721-15aadbba35bb", name: "Región del Biobío", locationCount: 61, locations: [] },
    { id: "7faed7f6-f5da-38c3-b758-a5c533e76a42", name: "Región del Maule", locationCount: 18, locations: [] },
    { id: "b37c30cb-6b7f-3fe3-bede-964a9dfad830", name: "Región del Ñuble", locationCount: 0, locations: [] },
    { id: "527a0388-7501-323a-af76-6171cd753219", name: "Región Metropolitana de Santiago", locationCount: 163, locations: [] },
  ],
  },
  {
    id: "089f4e95-e3b3-36e3-94b5-e0ee8c701916",
    name: "CO - Coke Bottlers",
    country: "CO",
    createdAt: "Mon, May 19, 2025 8:56 AM",
    updatedAt: "Mon, May 19, 2025 8:56 AM",
    sets: [
    { id: "6b77683b-eb16-3bb0-965c-f81e0cfb7274", name: "FEMSA CO", locationCount: 489, locations: [] },
  ],
  },
  {
    id: "bb9c2704-900f-3469-9b68-b3e314e8522c",
    name: "CO - Departamentos",
    country: "CO",
    createdAt: "Sun, May 25, 2025 7:27 PM",
    updatedAt: "Sun, May 25, 2025 7:27 PM",
    sets: [
    { id: "2465d808-3a37-3528-b071-77605078b610", name: "Amazonas", locationCount: 0, locations: [] },
    { id: "2784d5a2-535f-3a22-a091-7fe121dbc164", name: "Antioquia", locationCount: 52, locations: [] },
    { id: "0a6e131c-6da1-3ac1-975b-4457a970c2eb", name: "Arauca", locationCount: 0, locations: [] },
    { id: "9461758c-bc9e-3b25-9dc7-339e1ae3642c", name: "Atlántico", locationCount: 24, locations: [] },
    { id: "2554e5ee-f210-302d-b57e-e581901f0518", name: "Bogotá D.C.", locationCount: 37, locations: [] },
    { id: "7a884994-7799-31b3-880b-93a379bfd09d", name: "Bolívar", locationCount: 6, locations: [] },
    { id: "db4f1fc6-80f4-3b9a-91e9-5e7cecab31c2", name: "Boyacá", locationCount: 3, locations: [] },
    { id: "dacba7bc-9a47-3c52-b6e2-eb3c12e0b5d9", name: "Caldas", locationCount: 5, locations: [] },
    { id: "bd3d793b-eb24-378c-920e-c1c2605964e4", name: "Caquetá", locationCount: 3, locations: [] },
    { id: "c44df735-8571-387c-b642-5b1bf1b533c9", name: "Casanare", locationCount: 3, locations: [] },
    { id: "beba211f-5920-3100-b173-c3e929ce2e82", name: "Cauca", locationCount: 6, locations: [] },
    { id: "ee1ddb8e-8546-3cb1-b4bd-69b205c53aa6", name: "Cesar", locationCount: 0, locations: [] },
    { id: "d34404ac-08e4-3058-8126-c93ebb8eddcb", name: "Chocó", locationCount: 11, locations: [] },
    { id: "02279325-a33c-354a-ae9b-01dc884efcb2", name: "Cundinamarca", locationCount: 1, locations: [] },
    { id: "80d175b9-f6d2-395f-a74c-fb105817ef09", name: "Córdoba", locationCount: 34, locations: [] },
    { id: "c0906bcb-62ca-3940-b563-e2da00cb4509", name: "Guainía", locationCount: 0, locations: [] },
    { id: "f94c8d5c-0847-3fff-9fe4-cc5026a38322", name: "Guaviare", locationCount: 9, locations: [] },
    { id: "9b1b92a6-97cc-36e0-a578-a27e444a135b", name: "Huila", locationCount: 5, locations: [] },
    { id: "1daeb22a-0a28-3cd6-8491-8894fc8f4096", name: "La Guajira", locationCount: 7, locations: [] },
    { id: "e4137058-5b41-3daf-a8a6-bc49051b4e44", name: "Magdalena", locationCount: 24, locations: [] },
    { id: "fddd82cd-c1b1-35d4-b813-490f7b92de9b", name: "Meta", locationCount: 3, locations: [] },
    { id: "d4cb851c-273b-3330-8f83-4949ef5262f0", name: "Nariño", locationCount: 8, locations: [] },
    { id: "8aece55d-ea86-38b5-8cd1-3dacfeda2956", name: "Norte de Santander", locationCount: 0, locations: [] },
    { id: "42730bef-ff3c-38b2-8e0b-762a07d2deb6", name: "Putumayo", locationCount: 3, locations: [] },
    { id: "0c911e5e-c49b-3769-968e-d8b5849ab440", name: "Quindío", locationCount: 9, locations: [] },
    { id: "16424f84-937e-35f7-a938-62f923039258", name: "Risaralda", locationCount: 2, locations: [] },
    { id: "f2d23419-5315-3032-9e60-05897e416376", name: "San Andrés y Providencia", locationCount: 10, locations: [] },
    { id: "384f7b16-f7d3-3af0-a3c1-26baffaa13c0", name: "Santander", locationCount: 5, locations: [] },
    { id: "cd97c8a2-da11-30d3-9283-0e3690b9afbe", name: "Sucre", locationCount: 5, locations: [] },
    { id: "c434a3e3-bd01-31da-9439-8ae5caec345c", name: "Tolima", locationCount: 31, locations: [] },
    { id: "6cbc451d-25eb-3e9b-9961-03cd4ef0ddbf", name: "Valle del Cauca", locationCount: 0, locations: [] },
    { id: "bdcda378-f573-36d3-863d-4ec3e0aa94ae", name: "Vaupés", locationCount: 0, locations: [] },
    { id: "b14c6fa7-5c34-307f-ad88-e68c1409283d", name: "Vichada", locationCount: 98, locations: [] },
  ],
  },
  {
    id: "ac3d63cc-e595-3c6d-9968-da582dfdb8cc",
    name: "CR - Coke Bottlers",
    country: "CR",
    createdAt: "Mon, May 19, 2025 8:57 AM",
    updatedAt: "Mon, May 19, 2025 8:57 AM",
    sets: [
    { id: "78d13f3b-e375-3aef-bb69-b71f497a3408", name: "FEMSA CR", locationCount: 74, locations: [] },
  ],
  },
  {
    id: "489d0a09-ed05-3dfe-b785-6dc4e895e315",
    name: "EC - Coke Bottlers",
    country: "EC",
    createdAt: "Mon, May 19, 2025 8:56 AM",
    updatedAt: "Mon, May 19, 2025 8:56 AM",
    sets: [
    { id: "e9c97075-2619-35d0-bfad-5e6a1b9d862a", name: "Arca EC", locationCount: 6, locations: [] },
  ],
  },
  {
    id: "ac82450e-abbc-316e-ac75-fce519d9bd31",
    name: "ES - Provincias",
    country: "ES",
    createdAt: "Sun, Jul 21, 2024 4:20 PM",
    updatedAt: "Sun, Jul 21, 2024 4:20 PM",
    sets: [
    { id: "78b9c810-a0fd-3645-9226-95a93572dd31", name: "A Coruña", locationCount: 13, locations: [] },
    { id: "e4e6b70f-be01-3615-b62e-bf73df49b3e1", name: "Albacete", locationCount: 1, locations: [] },
    { id: "c9c3c088-83f3-3624-9826-acdf1ef51929", name: "Alicante", locationCount: 10, locations: [] },
    { id: "ddf29ea0-26cf-3e89-bb79-d7a119e24f81", name: "Almería", locationCount: 8, locations: [] },
    { id: "d54ea363-ca4e-31e8-9fb9-1df49d893726", name: "Asturias", locationCount: 28, locations: [] },
    { id: "4c0a5104-a542-3100-acde-3e65031b0e37", name: "Badajoz", locationCount: 1, locations: [] },
    { id: "a2a34805-52c0-3a4a-acc9-614f8417a8e6", name: "Barcelona", locationCount: 59, locations: [] },
    { id: "b0a27ad0-ca37-3c13-aeb1-fcc566131790", name: "Bizkaia", locationCount: 14, locations: [] },
    { id: "2ccca05d-a1bb-3af1-9f31-33b21e5114a0", name: "Burgos", locationCount: 15, locations: [] },
    { id: "76073cb5-4cd4-3d4d-821d-5302ce390536", name: "Cantabria", locationCount: 8, locations: [] },
    { id: "2597b6b9-ef83-3f8f-a2dc-157ec6d33a78", name: "Castellón", locationCount: 6, locations: [] },
    { id: "06bc17ba-2657-32d6-9c9b-98c1c4a56893", name: "Ciudad Real", locationCount: 0, locations: [] },
    { id: "ba477aa1-4e0e-3ec5-ab63-7e8062abfe7e", name: "Cuenca", locationCount: 5, locations: [] },
    { id: "f895a1a4-7992-3e62-aeda-e1488945bd78", name: "Cáceres", locationCount: 1, locations: [] },
    { id: "76016543-2678-3229-b133-cc8ecc33ca50", name: "Cádiz", locationCount: 9, locations: [] },
    { id: "2a1291ea-de7e-35ac-ab03-abc095c64a81", name: "Córdoba", locationCount: 5, locations: [] },
    { id: "bb359c0b-d75a-352b-9f25-f02965943134", name: "Gipuzkoa", locationCount: 18, locations: [] },
    { id: "d17cc034-93b9-302c-818b-06f6c6f9a7eb", name: "Girona", locationCount: 3, locations: [] },
    { id: "bdaddada-e4a7-3285-9de8-6eeefc4cb98f", name: "Granada", locationCount: 5, locations: [] },
    { id: "1b8d52d6-c9b4-3fb7-9e46-4d3f25d8a0db", name: "Guadalajara", locationCount: 0, locations: [] },
    { id: "8542b145-985d-3150-ad0c-2e72f317abc9", name: "Huelva", locationCount: 0, locations: [] },
    { id: "597e537d-587e-3183-a5a4-f3b660770099", name: "Huesca", locationCount: 1, locations: [] },
    { id: "f559592a-1ae0-3033-aecf-0f2fff3ab054", name: "Illes Balears", locationCount: 7, locations: [] },
    { id: "38a35599-caca-3bb4-8f48-7ac8d7a97baf", name: "Jaén", locationCount: 11, locations: [] },
    { id: "ce57d20f-fd13-303f-86e3-4d9faeb747e8", name: "La Rioja", locationCount: 15, locations: [] },
    { id: "82867154-6931-3581-a245-7c68a20e65f9", name: "Las Palmas", locationCount: 5, locations: [] },
    { id: "54ec3993-2255-3381-9e44-86a997630f24", name: "León", locationCount: 1, locations: [] },
    { id: "200f20c0-02f7-37a7-a552-951c2f395ee5", name: "Lleida", locationCount: 3, locations: [] },
    { id: "458c3fa0-1cb6-31ec-993c-522637ba2e0d", name: "Lugo", locationCount: 1, locations: [] },
    { id: "36506c09-c6a3-35d4-aecf-d0bcb3bd2a62", name: "Madrid", locationCount: 177, locations: [] },
    { id: "62a106a2-661b-360f-948f-b823b3ca6388", name: "Murcia", locationCount: 7, locations: [] },
    { id: "4dfa061b-1abb-380b-85fa-05356c7f10b9", name: "Málaga", locationCount: 10, locations: [] },
    { id: "0a62d3da-2458-3e5d-9133-f5fca20752da", name: "Navarra", locationCount: 2, locations: [] },
    { id: "13476e25-d970-333d-af2c-5566bd04a1bb", name: "Ourense", locationCount: 0, locations: [] },
    { id: "cd9b2690-b20e-3da2-888b-bf91733019b9", name: "Palencia", locationCount: 0, locations: [] },
    { id: "6951bd1e-485c-3b40-acf7-2a606997bad0", name: "Pontevedra", locationCount: 11, locations: [] },
    { id: "b7c2ee8b-b3ea-3dd1-a9b3-9726498cdbc7", name: "Salamanca", locationCount: 0, locations: [] },
    { id: "69c9b217-ac46-3671-867f-15089ac7d9ce", name: "Santa Cruz de Tenerife", locationCount: 8, locations: [] },
    { id: "77f573bb-f1c1-3b00-887c-bbab9f49c7fe", name: "Segovia", locationCount: 0, locations: [] },
    { id: "6c83b12b-a5f0-36e1-a240-acc639c99249", name: "Sevilla", locationCount: 21, locations: [] },
    { id: "d385aec3-d961-3b16-9ebc-59a0a1a6cc85", name: "Soria", locationCount: 0, locations: [] },
    { id: "2c786344-4978-3d17-9b90-314fdef06d4c", name: "Tarragona", locationCount: 18, locations: [] },
    { id: "e757a08b-ff48-3ff1-8c2e-225e64fa96b3", name: "Teruel", locationCount: 1, locations: [] },
    { id: "220c035b-3d1f-3005-a927-7d4da29bb676", name: "Toledo", locationCount: 1, locations: [] },
    { id: "f916436e-c3d8-3b82-a2b3-ae57f7538854", name: "Valladolid", locationCount: 6, locations: [] },
    { id: "6870098b-f279-3825-87cc-b12fdcf5f15c", name: "València", locationCount: 15, locations: [] },
    { id: "db72a20a-118e-3252-904d-4bd03ac0468d", name: "Zamora", locationCount: 0, locations: [] },
    { id: "4eafce96-239a-3522-8a8a-1d52f3b1ae5d", name: "Zaragoza", locationCount: 52, locations: [] },
    { id: "5d1c8cf3-966b-3e7c-a0c4-dc911c8a63d3", name: "Álava", locationCount: 5, locations: [] },
    { id: "1bd23118-76c6-3f56-a5f8-d10cdfc1e27b", name: "Ávila", locationCount: 0, locations: [] },
  ],
  },
  {
    id: "30d1f3ee-86f5-376d-b18a-70a9d36d0cce",
    name: "FR - Département",
    country: "FR",
    createdAt: "Mon, Aug 5, 2024 9:38 AM",
    updatedAt: "Mon, Aug 5, 2024 9:38 AM",
    sets: [
    { id: "2fa0af7f-e004-306d-9c0c-8435cae64e57", name: "Ain (01)", locationCount: 28, locations: [] },
    { id: "e14e21ac-b946-38a9-acae-fcf6e6bca054", name: "Aisne (02)", locationCount: 40, locations: [] },
    { id: "4aca4096-3e0e-30b4-b8d6-fa7dbbeabae6", name: "Allier (03)", locationCount: 24, locations: [] },
    { id: "650535b8-c96b-3e39-94c9-1322f11d6de5", name: "Alpes-de-Haute-Provence (04)", locationCount: 7, locations: [] },
    { id: "ce4817c8-1e19-387c-9782-52a06a505141", name: "Alpes-Maritimes (06)", locationCount: 47, locations: [] },
    { id: "fe59fbbe-226c-3e1d-acd0-9685ede36a5e", name: "Ardennes (08)", locationCount: 14, locations: [] },
    { id: "074eda81-6f18-3cfe-b47d-dba8ed1cdbaa", name: "Ardèche (07)", locationCount: 14, locations: [] },
    { id: "935627b6-e5d4-3747-a961-29ebe202beb5", name: "Ariège (09)", locationCount: 11, locations: [] },
    { id: "caf0535d-bc51-3f77-8a63-ac6853213ba3", name: "Aube (10)", locationCount: 33, locations: [] },
    { id: "e4ca4a0f-0788-3c30-aa5c-0c0e20093840", name: "Aude (11)", locationCount: 17, locations: [] },
    { id: "92a279e3-5183-3e63-933d-d8af069a1034", name: "Aveyron (12)", locationCount: 15, locations: [] },
    { id: "926a0c7a-888f-39af-956c-ae269744a3db", name: "Bas-Rhin (67)", locationCount: 97, locations: [] },
    { id: "ea22a66a-14f7-3a0a-bca8-d8401fad0c5f", name: "Bouches-du-Rhône (13)", locationCount: 133, locations: [] },
    { id: "5ca0be96-e785-3612-928f-a73860bdb4f1", name: "Calvados (14)", locationCount: 62, locations: [] },
    { id: "fb7f3257-476f-3ddf-b2dc-d9697566e411", name: "Cantal (15)", locationCount: 21, locations: [] },
    { id: "f5ed7e80-4057-368c-9c68-508a64fedae6", name: "Charente (16)", locationCount: 30, locations: [] },
    { id: "64e86afa-7ee2-3237-b122-71bb1e89501c", name: "Charente-Maritime (17)", locationCount: 34, locations: [] },
    { id: "280a41b5-73d3-3017-8623-e21d149a0306", name: "Cher (18)", locationCount: 28, locations: [] },
    { id: "3bc7bd8c-7081-3e64-94c0-7ac732a9b91d", name: "Corrèze (19)", locationCount: 20, locations: [] },
    { id: "6c924db7-8472-3c97-8120-70cdeb4a2675", name: "Corse-du-Sud (2A)", locationCount: 7, locations: [] },
    { id: "f9ee1318-82fe-3236-9a4f-b1d18fa658b9", name: "Creuse (23)", locationCount: 10, locations: [] },
    { id: "28a017a4-fe97-3917-b1eb-e2f31c1311dc", name: "Côte-d'Or (21)", locationCount: 54, locations: [] },
    { id: "8471c187-a9aa-303c-b566-8267c6462042", name: "Côtes-d'Armor (22)", locationCount: 34, locations: [] },
    { id: "ce50c2cd-de27-342b-8ba2-6cae6ac654f7", name: "Deux-Sèvres (79)", locationCount: 12, locations: [] },
    { id: "38394626-e804-3986-b877-5e897396b9ca", name: "Dordogne (24)", locationCount: 39, locations: [] },
    { id: "0c98c2a0-76f4-3e2b-8ef0-796c05e639d0", name: "Doubs (25)", locationCount: 20, locations: [] },
    { id: "4389db41-04d6-39e1-b4b5-b6772e6ac615", name: "Drôme (26)", locationCount: 11, locations: [] },
    { id: "edb589fe-062d-3bf2-91ba-1b27d345d03f", name: "Essonne (91)", locationCount: 99, locations: [] },
    { id: "916368d7-c97d-3c21-bb7d-8a1d4776b670", name: "Eure (27)", locationCount: 59, locations: [] },
    { id: "e65c36a6-b742-3467-9c7e-0b792e420306", name: "Eure-et-Loir (28)", locationCount: 24, locations: [] },
    { id: "6dd1a903-c154-3352-ab63-eefd2db977d7", name: "Finistère (29)", locationCount: 59, locations: [] },
    { id: "801e1c10-7716-322d-bb31-d56abc013952", name: "Gard (30)", locationCount: 39, locations: [] },
    { id: "f33f2dde-607d-3f1a-843c-91d199bda1f8", name: "Gers (32)", locationCount: 13, locations: [] },
    { id: "e4e3f3c1-a171-3939-b809-935ff4e59e17", name: "Gironde (33)", locationCount: 211, locations: [] },
    { id: "de718bd2-5975-3cc2-9a05-15d51e583200", name: "Haut-Rhin (68)", locationCount: 45, locations: [] },
    { id: "321a1734-1864-31e7-a91a-7402a36484c8", name: "Haute-Corse (2B)", locationCount: 9, locations: [] },
    { id: "ae77d591-79fc-33a0-855f-5576855575c9", name: "Haute-Garonne (31)", locationCount: 115, locations: [] },
    { id: "1d9d47f4-755d-393d-aec5-70a7d98f2f31", name: "Haute-Loire (43)", locationCount: 18, locations: [] },
    { id: "26be23d2-7285-32d4-8b7f-1254f6b365b3", name: "Haute-Marne (52)", locationCount: 7, locations: [] },
    { id: "ed388841-4252-3d41-b963-5af3f1bb784b", name: "Haute-Savoie (74)", locationCount: 44, locations: [] },
    { id: "806dbc23-c243-36d2-9bd8-58b8b714698b", name: "Haute-Saône (70)", locationCount: 20, locations: [] },
    { id: "dbece231-8625-3538-9bfc-8e1ca4969238", name: "Haute-Vienne (87)", locationCount: 12, locations: [] },
    { id: "291fb389-79c3-3df6-88b9-6d36e1e5dab1", name: "Hautes-Alpes (05)", locationCount: 9, locations: [] },
    { id: "de8e3909-c7a6-3659-ac91-8ac83266c059", name: "Hautes-Pyrénées (65)", locationCount: 21, locations: [] },
    { id: "eddcbc87-6909-35bd-96e8-5f7067df4680", name: "Hauts-de-Seine (92)", locationCount: 117, locations: [] },
    { id: "95aaea3a-a694-3217-bab2-0465a99eae9a", name: "Hérault (34)", locationCount: 61, locations: [] },
    { id: "3d23bb0a-0743-3e4c-8341-ccfdcd41526c", name: "Ille-et-Vilaine (35)", locationCount: 46, locations: [] },
    { id: "79e9ab79-a385-3f38-93a1-828ac3200835", name: "Indre (36)", locationCount: 25, locations: [] },
    { id: "42c6620a-f921-3cc4-bfd9-0e03ac8aa9a4", name: "Indre-et-Loire (37)", locationCount: 63, locations: [] },
    { id: "418f254c-af61-38dc-937a-3f1d72506033", name: "Isère (38)", locationCount: 50, locations: [] },
    { id: "2f01b64e-3c51-3b3c-b6e3-0f711140d8b9", name: "Jura (39)", locationCount: 9, locations: [] },
    { id: "63c669a7-7f26-3a36-b914-1c746f45b6b6", name: "Landes (40)", locationCount: 27, locations: [] },
    { id: "8380925b-c183-3b8d-9734-b5699a3a9f4f", name: "Loir-et-Cher (41)", locationCount: 23, locations: [] },
    { id: "1b534c51-198f-312b-9eb4-520c5c730fe5", name: "Loire (42)", locationCount: 39, locations: [] },
    { id: "aebc1b5f-10c1-3973-b8e4-e21783875cd1", name: "Loire-Atlantique (44)", locationCount: 75, locations: [] },
    { id: "979cd612-cedb-30a8-9734-63e87668354c", name: "Loiret (45)", locationCount: 97, locations: [] },
    { id: "18ef6fbb-b01f-37eb-be11-3d2565e96db6", name: "Lot (46)", locationCount: 9, locations: [] },
    { id: "9f864776-4ca0-3075-a77b-13a15b3fcc56", name: "Lot-et-Garonne (47)", locationCount: 26, locations: [] },
    { id: "dde6be1d-2788-3c92-9839-50d7c3705d5b", name: "Lozère (48)", locationCount: 1, locations: [] },
    { id: "49595f94-45d8-3c88-ba6e-4149f184119c", name: "Maine-et-Loire (49)", locationCount: 47, locations: [] },
    { id: "5befc16d-e07a-3896-bf6e-8337c3b4105a", name: "Manche (50)", locationCount: 40, locations: [] },
    { id: "da43aee4-a12c-3014-b63e-3e3792271319", name: "Marne (51)", locationCount: 35, locations: [] },
    { id: "0c6d50c9-a3cd-3a05-8c02-e7ba2bc982b9", name: "Martinique (972)", locationCount: 1, locations: [] },
    { id: "f29edd67-00a1-390a-9ff7-7b512fda16db", name: "Mayenne (53)", locationCount: 11, locations: [] },
    { id: "67fb4d26-5dad-3325-97f1-8264c4d23118", name: "Meurthe-et-Moselle (54)", locationCount: 68, locations: [] },
    { id: "8919aa6e-a1d2-3b13-b4f1-57e5be0d11ca", name: "Meuse (55)", locationCount: 23, locations: [] },
    { id: "d6a88c94-684e-3288-9bb7-528f7a2856af", name: "Monaco", locationCount: 2, locations: [] },
    { id: "364dee01-9457-39d5-bc5a-cf944a0406d1", name: "Morbihan (56)", locationCount: 39, locations: [] },
    { id: "bd9c7d69-8446-30aa-85c8-258a433f058a", name: "Moselle (57)", locationCount: 57, locations: [] },
    { id: "330e44e5-9fc7-38b7-a4f5-8a61c0516f64", name: "Nièvre (58)", locationCount: 45, locations: [] },
    { id: "d5cfbc31-da31-3088-9bdd-dda7d1d1265b", name: "Nord (59)", locationCount: 265, locations: [] },
    { id: "c4b36daf-eb05-397e-b12b-759ff4e2b0c8", name: "Oise (60)", locationCount: 64, locations: [] },
    { id: "e67f0272-74a3-3c91-88d5-7af73de06260", name: "Orne (61)", locationCount: 16, locations: [] },
    { id: "15c3df98-4a5e-36bd-80f6-0c3a638055bc", name: "Paris (75)", locationCount: 160, locations: [] },
    { id: "e455c464-0a21-358d-b35e-430215ca35df", name: "Pas-de-Calais (62)", locationCount: 188, locations: [] },
    { id: "60b21b80-a619-3b2d-a31f-bc07dfa21dbc", name: "Puy-de-Dôme (63)", locationCount: 73, locations: [] },
    { id: "0eb89985-0dc8-35b4-ba6c-8697aec3bcd5", name: "Pyrénées-Atlantiques (64)", locationCount: 56, locations: [] },
    { id: "baee6c64-bd16-32f1-9e0e-59716204b4c7", name: "Pyrénées-Orientales (66)", locationCount: 17, locations: [] },
    { id: "a7ef8ef5-b5ab-338d-89af-684f5b5efdaa", name: "Rhône (69)", locationCount: 115, locations: [] },
    { id: "7e2f73bf-a2b8-31b4-ba0a-c051d4dbb4fc", name: "Sarthe (72)", locationCount: 34, locations: [] },
    { id: "b46fba14-007c-3b25-b10c-3ad5cdc099aa", name: "Savoie (73)", locationCount: 21, locations: [] },
    { id: "87cc481e-27fe-3942-94a1-eb250f1d762d", name: "Saône-et-Loire (71)", locationCount: 56, locations: [] },
    { id: "b47cd589-2521-3d37-b0b2-517c5a7d8e69", name: "Seine-et-Marne (77)", locationCount: 111, locations: [] },
    { id: "a73239f5-0034-349a-a0d9-f35e967f551b", name: "Seine-Maritime (76)", locationCount: 115, locations: [] },
    { id: "bfe7e8a6-6373-37cb-9562-4aa751639750", name: "Seine-Saint-Denis (93)", locationCount: 57, locations: [] },
    { id: "27472112-b71b-3e55-8f84-c6be125d6ca2", name: "Somme (80)", locationCount: 56, locations: [] },
    { id: "17a7e5fc-8e67-3869-b97f-9864327ef449", name: "Tarn (81)", locationCount: 24, locations: [] },
    { id: "20bbcb0e-ce57-3b89-9a7a-05150ed4a775", name: "Tarn-et-Garonne (82)", locationCount: 22, locations: [] },
    { id: "8603fdd0-5447-3ffa-9354-6d8b42904c44", name: "Territoire de Belfort (90)", locationCount: 15, locations: [] },
    { id: "709061d3-55d3-3136-814c-0831e225b64d", name: "Val-d'Oise (95)", locationCount: 100, locations: [] },
    { id: "1b16355f-34f8-3e66-a5fc-de3801c31279", name: "Val-de-Marne (94)", locationCount: 99, locations: [] },
    { id: "1a4b0cfe-30b8-3ffc-bb19-e011c16b31e1", name: "Var (83)", locationCount: 73, locations: [] },
    { id: "36bc4d4e-96f2-3387-9dc6-5b7d27ba32f6", name: "Vaucluse (84)", locationCount: 46, locations: [] },
    { id: "f5389878-bfcd-3fc4-8ff2-f0a826388198", name: "Vendée (85)", locationCount: 17, locations: [] },
    { id: "16e2031e-0fe9-3e78-8c53-47f93d0c6959", name: "Vienne (86)", locationCount: 30, locations: [] },
    { id: "c8f17975-c701-32b0-b6b6-f0b519f07f2f", name: "Vosges (88)", locationCount: 30, locations: [] },
    { id: "859bee88-bdab-3f8f-ba54-3dbec6ef07b8", name: "Yonne (89)", locationCount: 42, locations: [] },
    { id: "39ad0cce-9684-385e-aa7e-a94425e34dd0", name: "Yvelines (78)", locationCount: 146, locations: [] },
  ],
  },
  {
    id: "880859e5-5175-3d15-963f-7051e80a5db6",
    name: "FR - Région Administrative",
    country: "FR",
    createdAt: "Mon, Aug 5, 2024 9:30 AM",
    updatedAt: "Mon, Aug 5, 2024 9:30 AM",
    sets: [
    { id: "24fe03b6-18cf-3306-a97e-ae567299c118", name: "Auvergne-Rhône-Alpes", locationCount: 464, locations: [] },
    { id: "da6ac84d-e408-3b93-9f97-ea8ad074fb0f", name: "Bourgogne-Franche-Comté", locationCount: 264, locations: [] },
    { id: "bd3c3fd5-5229-3687-a7e5-cdc8c102bad3", name: "Bretagne", locationCount: 178, locations: [] },
    { id: "5c3d0b83-63da-35ae-8b70-75cc8d6c23b6", name: "Centre-Val de Loire", locationCount: 266, locations: [] },
    { id: "0a4d91d4-a66f-3092-85a6-6fe96684860e", name: "Corse", locationCount: 13, locations: [] },
    { id: "cee32323-737b-3d0b-8312-6321436e6638", name: "Grand Est", locationCount: 418, locations: [] },
    { id: "a34ebd55-5b79-35f7-b40e-9c9690a7f0a5", name: "Hauts-de-France", locationCount: 627, locations: [] },
    { id: "6f1dc4d0-e914-304b-93b6-9059bac20bc5", name: "Martinique", locationCount: 1, locations: [] },
    { id: "0bebf367-038a-302a-ae57-c06b823fb6f6", name: "Normandie", locationCount: 288, locations: [] },
    { id: "56edfdd2-16a5-34ee-8bbb-b7503a9153a2", name: "Nouvelle-Aquitaine", locationCount: 512, locations: [] },
    { id: "393e90ec-9806-38b9-a47c-0bb16599cac9", name: "Occitanie", locationCount: 370, locations: [] },
    { id: "61138f2c-6052-3223-8e1a-ce1153308290", name: "Pays de la Loire", locationCount: 186, locations: [] },
    { id: "2f251fdf-70e0-35de-b04d-08dfa40f9bb8", name: "Provence-Alpes-Côte d'Azur", locationCount: 339, locations: [] },
    { id: "af2b5ddf-3f89-38e5-af99-fbdda10ed2e5", name: "Île-de-France", locationCount: 900, locations: [] },
  ],
  },
  {
    id: "c4c22b17-a15c-33cb-a7bf-4f9681485c98",
    name: "FR - Région Nielsen",
    country: "FR",
    createdAt: "Mon, Aug 5, 2024 9:30 AM",
    updatedAt: "Mon, Aug 5, 2024 9:30 AM",
    sets: [
    { id: "1c81fef8-dd39-363d-85b5-e7db872ed4b5", name: "Nielsen 1 - Grand Est", locationCount: 247, locations: [] },
    { id: "6f07cee3-2df2-31f2-9eef-c8cfbbec44c8", name: "Nielsen 2 - Bourgogne-Franche-Comté", locationCount: 156, locations: [] },
    { id: "feccc91f-fac5-36bb-9262-5553c2be21a0", name: "Nielsen 3 - Centre-Val de Loire", locationCount: 128, locations: [] },
    { id: "62c72eda-8a33-39f5-b3b3-a2de7b410ecb", name: "Nielsen 3 - Pays de la Loire", locationCount: 138, locations: [] },
    { id: "6cd93e80-8be7-3c8a-bce7-2000841a2904", name: "Nielsen 4 - Occitanie", locationCount: 260, locations: [] },
    { id: "35bd23b7-98b4-3e1b-afe4-045a1248960b", name: "Nielsen 5 - Nouvelle-Aquitaine", locationCount: 253, locations: [] },
    { id: "5a0d8b73-2611-3b66-9724-4244b9547695", name: "Nielsen 6 - Provence-Alpes-Côte d'Azur", locationCount: 186, locations: [] },
    { id: "7d286d1d-e5eb-3565-aa7e-9dd81ca48dfd", name: "Nielsen 7 - Auvergne-Rhône-Alpes", locationCount: 274, locations: [] },
    { id: "cee5713f-4d0a-307c-a601-b5f3dba12352", name: "Nielsen 7 - Bretagne", locationCount: 178, locations: [] },
    { id: "b3265fc7-7820-3345-ae25-2672c65555fe", name: "Nielsen 8 - Hauts-de-France", locationCount: 405, locations: [] },
    { id: "d88c3aeb-6878-392a-b42d-69a481af7163", name: "Nielsen 8 - Normandie", locationCount: 200, locations: [] },
    { id: "64eaaaa6-2de1-3c8d-8d28-e90571749623", name: "Nielsen 9 - Corse", locationCount: 12, locations: [] },
    { id: "85231aa9-f253-3fc1-8b6f-0e69611899e8", name: "Nielsen 9 - Guadeloupe", locationCount: 0, locations: [] },
    { id: "186e6e01-3956-3901-9737-8fa68a1f054e", name: "Nielsen 9 - Guyane", locationCount: 0, locations: [] },
    { id: "aaafc7cf-a978-3bd8-a0c9-217be18d5188", name: "Nielsen 9 - La Réunion", locationCount: 0, locations: [] },
    { id: "c963c3cb-880e-3812-8ba8-931c042605cb", name: "Nielsen 9 - Martinique", locationCount: 1, locations: [] },
    { id: "5f662142-9a85-3652-8322-83e985a2396c", name: "Nielsen 9 - Mayotte", locationCount: 0, locations: [] },
    { id: "feb73734-24fe-3735-8f96-430c56fa18ba", name: "Nielsen 9 - Saint-Barthélemy", locationCount: 0, locations: [] },
    { id: "261c1b43-4752-3aa5-9177-5fc19b90ed29", name: "Nielsen 9 - Saint-Martin", locationCount: 0, locations: [] },
    { id: "829bfb48-824c-3020-89ad-fbc94fe212d3", name: "Nielsen 9 - Saint-Pierre-et-Miquelon", locationCount: 0, locations: [] },
    { id: "485984fc-9eeb-3ebb-b857-09af14b1366d", name: "Nielsen 9 - Wallis-et-Futuna", locationCount: 0, locations: [] },
    { id: "f51bc486-088c-3027-b6e6-aa233d1565dc", name: "Nielsen 9 - Île-de-France", locationCount: 379, locations: [] },
  ],
  },
  {
    id: "ddc6c213-9d84-3e12-ae86-ae4e4f36fbe5",
    name: "GT - Coke Bottlers",
    country: "GT",
    createdAt: "Mon, May 19, 2025 8:57 AM",
    updatedAt: "Mon, May 19, 2025 8:57 AM",
    sets: [
    { id: "8a1c43a6-c4c1-3918-a565-a368664c682c", name: "FEMSA GT", locationCount: 66, locations: [] },
  ],
  },
  {
    id: "b88ea455-6632-3197-81e2-2420880330a1",
    name: "GT - Departamentos",
    country: "GT",
    createdAt: "Sun, May 25, 2025 7:32 PM",
    updatedAt: "Sun, May 25, 2025 7:32 PM",
    sets: [
    { id: "633f6386-79ec-327e-a833-d883bd08c560", name: "Departamento de Alta Verapaz", locationCount: 0, locations: [] },
    { id: "116c9f66-6798-3202-8748-6bc3decbfbc8", name: "Departamento de Baja Verapaz", locationCount: 0, locations: [] },
    { id: "aedc899a-b36f-3567-a340-43845f41ed46", name: "Departamento de Chimaltenango", locationCount: 0, locations: [] },
    { id: "8fa929ea-3464-3b8e-a617-a681b286c195", name: "Departamento de Chiquimula", locationCount: 0, locations: [] },
    { id: "5e006747-910d-3e15-8848-1017adb04d59", name: "Departamento de El Progreso", locationCount: 0, locations: [] },
    { id: "7bc43379-7e2a-391f-b57e-4c342e6220b4", name: "Departamento de Escuintla", locationCount: 0, locations: [] },
    { id: "e7704d7d-fbc9-3e64-918e-8a0540f90f85", name: "Departamento de Guatemala", locationCount: 11, locations: [] },
    { id: "7f42ef4e-43c3-3ca0-bcba-5284b7252224", name: "Departamento de Huehuetenango", locationCount: 0, locations: [] },
    { id: "8c15c327-c2d0-326d-98c6-2cbbaf666f32", name: "Departamento de Izabal", locationCount: 0, locations: [] },
    { id: "ece9a818-ced5-34a1-8ff8-8556dc727140", name: "Departamento de Jalapa", locationCount: 0, locations: [] },
    { id: "ae84f769-b01a-394b-bc4d-7377fa3c2cb0", name: "Departamento de Jutiapa", locationCount: 0, locations: [] },
    { id: "81020468-62d6-3b30-9e25-054a4f2e04b4", name: "Departamento de Petén", locationCount: 0, locations: [] },
    { id: "47b6a077-d864-380d-a80f-2a5e88ad1e81", name: "Departamento de Quetzaltenango", locationCount: 1, locations: [] },
    { id: "867ed7ca-d14f-337c-9c88-0eb1a16a357d", name: "Departamento de Quiché", locationCount: 0, locations: [] },
    { id: "77cf9d1a-6145-3087-9d4a-1170b2a31aa9", name: "Departamento de Retalhuleu", locationCount: 0, locations: [] },
    { id: "9d1893c7-fb12-386e-b9d6-8eecb8337115", name: "Departamento de Sacatepéquez", locationCount: 0, locations: [] },
    { id: "5da32232-d8d6-31e2-a0fd-c30f908e3c93", name: "Departamento de San Marcos", locationCount: 0, locations: [] },
    { id: "da62990e-8a2b-344c-a95d-3eeea1484c63", name: "Departamento de Santa Rosa", locationCount: 0, locations: [] },
    { id: "94a2d46c-6083-3524-90f2-c88f716a1197", name: "Departamento de Sololá", locationCount: 0, locations: [] },
    { id: "c0a8665c-e8df-35c2-9630-cca75add9cdf", name: "Departamento de Suchitepéquez", locationCount: 0, locations: [] },
    { id: "fba587ff-8842-3391-803f-db1688e36928", name: "Departamento de Totonicapán", locationCount: 0, locations: [] },
    { id: "e6f53420-1eb5-3101-bcf8-a7d233ca3446", name: "Departamento de Zacapa", locationCount: 0, locations: [] },
  ],
  },
  {
    id: "e609e27e-25ca-3618-aa80-2c43295d2761",
    name: "Heineken IE",
    country: "IE",
    createdAt: "Mon, Jun 3, 2024 12:08 PM",
    updatedAt: "Mon, Jun 3, 2024 12:08 PM",
    sets: [
    { id: "e0dcbe5e-941e-3aff-a332-42a500391bd0", name: "Abbeyquarter North", locationCount: 1, locations: [] },
    { id: "44a64d9c-ebf0-3934-9e12-0c20ecf38fb5", name: "Ashbourne", locationCount: 1, locations: [] },
    { id: "770b6a8b-6efe-3bd3-a412-0789d387f82e", name: "Ballyhooly Rd", locationCount: 1, locations: [] },
    { id: "32b58a8a-b31e-360f-98c2-564904658f27", name: "Castlebar", locationCount: 1, locations: [] },
    { id: "b3b215f8-766d-3153-a8be-06c3c6dc195c", name: "Centre", locationCount: 1, locations: [] },
    { id: "9fcb1122-2560-3c2b-97f9-ff43b5537845", name: "Clondalkin", locationCount: 2, locations: [] },
    { id: "40466786-4387-3911-a729-f2b8f48edf6d", name: "Clonmacken Rd", locationCount: 1, locations: [] },
    { id: "cd99fbf0-f24b-3090-840d-077a1cb24901", name: "Clonmel", locationCount: 1, locations: [] },
    { id: "09c421d5-c723-3fbd-ac86-358cd7d41f87", name: "County Laois", locationCount: 1, locations: [] },
    { id: "d5c9cc48-9a83-3e7a-b873-7fbc36f25306", name: "Dundalk", locationCount: 1, locations: [] },
    { id: "c5ac5882-ec0a-39bc-b738-71daa641aafb", name: "Dún Laoghaire", locationCount: 1, locations: [] },
    { id: "33a932dd-bdce-3ef4-a0d6-e560f3bed597", name: "Gorey", locationCount: 2, locations: [] },
    { id: "bb2ac378-7dbe-3a50-9648-89b8903434d4", name: "Headford Road", locationCount: 1, locations: [] },
    { id: "4f6afe22-570d-310a-a471-ff7d5ead6849", name: "Limerick", locationCount: 1, locations: [] },
    { id: "67d5131d-c180-3ffd-af95-51129c945117", name: "Mahon", locationCount: 1, locations: [] },
    { id: "8ccc44c5-58dc-3581-bebb-44d24bce43cc", name: "Maynooth", locationCount: 1, locations: [] },
    { id: "00da6fdb-bb64-3433-be5a-9389b2486ec8", name: "Mullingar", locationCount: 2, locations: [] },
    { id: "dd2876b4-fbc5-3d4e-be15-198de519106a", name: "Nass", locationCount: 1, locations: [] },
    { id: "9d3c20c9-b7c7-3946-8468-89018cfcdf1b", name: "Nenagh", locationCount: 1, locations: [] },
    { id: "052c84c8-3538-3b00-845c-252588169c02", name: "Portlaiose", locationCount: 1, locations: [] },
    { id: "6216f7f3-3282-3855-94f4-edebf58cad7c", name: "Ring Rd", locationCount: 1, locations: [] },
  ],
  },
  {
    id: "fd803518-df89-3ad4-9a65-4c748e8dacb9",
    name: "KW - Governorates",
    country: "KW",
    createdAt: "Sun, Dec 29, 2024 9:36 PM",
    updatedAt: "Sun, Dec 29, 2024 9:36 PM",
    sets: [
    { id: "c7011a0f-0b33-329b-a158-a1608afdd9fc", name: "Al-Ahmadi", locationCount: 4, locations: [] },
    { id: "371c55ea-3b84-3b99-8b0d-907e31ef5412", name: "Al-Asima", locationCount: 1, locations: [] },
    { id: "5e1f9afb-5203-350e-a957-dde95748e6ba", name: "Al-Farwaniya", locationCount: 3, locations: [] },
    { id: "746472e1-17b8-3b84-879d-2ea758217918", name: "Al-Jahra", locationCount: 1, locations: [] },
    { id: "94f60b2a-f2f1-3810-86cd-5c5b7525df5a", name: "Hawally", locationCount: 3, locations: [] },
    { id: "628bebac-c00f-322a-bcd1-8f396df52335", name: "Mubarak Al-Kabeer", locationCount: 1, locations: [] },
  ],
  },
  {
    id: "04ef502a-ae34-3e37-bf4a-62b8e52e1d7b",
    name: "LT - Administrative Region",
    country: "LT",
    createdAt: "Tue, Apr 8, 2025 2:49 PM",
    updatedAt: "Tue, Apr 8, 2025 2:49 PM",
    sets: [
    { id: "f4824bb4-c84f-32ae-8877-be640f738867", name: "Alytus", locationCount: 1, locations: [] },
    { id: "255d9f34-3427-3db4-a6e6-ce98654197e0", name: "Kaunas", locationCount: 2, locations: [] },
    { id: "d6012360-95e8-3487-929d-cb2004d6a473", name: "Klaipėda", locationCount: 1, locations: [] },
    { id: "390a9866-1e17-3d8c-af15-88204baea0b4", name: "Marijampolė", locationCount: 1, locations: [] },
    { id: "a69ecc07-5733-3797-a181-b7f3705ec0f6", name: "Panevėžys", locationCount: 1, locations: [] },
    { id: "d4d14a66-95fc-33ae-92d0-419acd7e44d6", name: "Tauragė", locationCount: 0, locations: [] },
    { id: "79703a7d-247f-3aca-9f7a-7b34cb9a15c5", name: "Telšiai", locationCount: 0, locations: [] },
    { id: "02dde239-18f0-31ac-aa86-e101e4f1a3c1", name: "Utena", locationCount: 0, locations: [] },
    { id: "1f2252ec-ca24-3234-ad86-74b4846bcee5", name: "Vilna", locationCount: 3, locations: [] },
    { id: "88c0fa20-1437-3594-92a7-08710e0c4d2e", name: "Šiauliai", locationCount: 1, locations: [] },
  ],
  },
  {
    id: "562f7e68-3b18-3844-8415-f9c5b8394f34",
    name: "MX - Areas Nielsen",
    country: "MX",
    createdAt: "Thu, Jun 20, 2024 11:10 AM",
    updatedAt: "Mon, Jun 24, 2024 10:33 AM",
    sets: [
    { id: "df0725ee-3b40-361b-aa77-332bf62da045", name: "Area Nielsen I", locationCount: 270, locations: [] },
    { id: "0e91c6d8-7a98-32fa-8cc0-d2cf76b86aee", name: "Area Nielsen II", locationCount: 498, locations: [] },
    { id: "6a399077-b057-3a04-98e6-21eeafaa281f", name: "Area Nielsen III", locationCount: 969, locations: [] },
    { id: "cff9e392-ab9d-3556-a719-12907a0fea8d", name: "Area Nielsen IV", locationCount: 523, locations: [] },
    { id: "7348f0c4-8be5-3b4f-bb73-6304ed92545e", name: "Area Nielsen V", locationCount: 615, locations: [] },
    { id: "c5b005a9-06ff-3899-9ddb-d68ad4675aa4", name: "Area Nielsen VI", locationCount: 768, locations: [] },
  ],
  },
  {
    id: "de91dfb1-1af9-3b96-9c72-b5eadd6dfdc0",
    name: "MX - Coke Bottlers",
    country: "MX",
    createdAt: "Mon, May 19, 2025 8:57 AM",
    updatedAt: "Mon, May 19, 2025 8:57 AM",
    sets: [
    { id: "6a1a9aa3-a0a3-4b6e-a1bc-59c7ed1ae089", name: "Arca MX", locationCount: 2499, locations: [] },
    { id: "36379cfd-05b0-45d5-99c3-e5c0cbbcb519", name: "Bepensa MX", locationCount: 366, locations: [] },
    { id: "b8a9404a-a1bd-4c8e-94b9-89d3fd6e0e49", name: "CDF MX", locationCount: 45, locations: [] },
    { id: "3d32c281-c7f7-41e7-a62e-3aa8f56e0440", name: "Colima MX", locationCount: 37, locations: [] },
    { id: "9f6fc813-58ef-4486-a269-e2b663a2c1dd", name: "FEMSA MX", locationCount: 2909, locations: [] },
    { id: "39e847c7-0904-487a-bca8-04809b70ec5b", name: "Nogales MX", locationCount: 137, locations: [] },
    { id: "c8702480-40d0-4ec9-b000-39794e55728e", name: "Rica MX", locationCount: 32, locations: [] },
    { id: "3c7b772f-b0fb-4690-848a-fec969f36d78", name: "TepicNayar MX", locationCount: 71, locations: [] },
  ],
  },
  {
    id: "84c15014-0320-326b-bdf0-24244551253f",
    name: "NI - Coke Bottlers",
    country: "NI",
    createdAt: "Mon, May 19, 2025 8:58 AM",
    updatedAt: "Mon, May 19, 2025 8:58 AM",
    sets: [
    { id: "1f26ccc0-302a-3b47-8461-4c54e720eae0", name: "FEMSA NI", locationCount: 2, locations: [] },
  ],
  },
  {
    id: "409b42d1-befc-3db0-b7d8-e61d2707714b",
    name: "NO USAR - ES - Cities",
    country: "ES",
    createdAt: "Mon, Jun 24, 2024 8:29 PM",
    updatedAt: "Sun, Jul 21, 2024 4:19 PM",
    sets: [
    { id: "e5e2cf1a-aeff-33cc-805c-3edca32807bc", name: "A Coruña", locationCount: 5, locations: [] },
    { id: "069b361f-f4d6-32eb-996e-42b8010dc73b", name: "Albacete", locationCount: 1, locations: [] },
    { id: "b2a1830d-eb51-396d-9e86-f1ccc4627a73", name: "Alcalá de Henares", locationCount: 1, locations: [] },
    { id: "05d61e29-aed5-3b41-b6a3-4beedc53116a", name: "Alcañiz", locationCount: 1, locations: [] },
    { id: "5d300e7a-ba6a-32e6-bb33-e1f01d991571", name: "Alcorcón", locationCount: 1, locations: [] },
    { id: "0950521f-fdfa-3ff5-88f3-38c1e17b63a8", name: "Alicante", locationCount: 5, locations: [] },
    { id: "d73a2cc8-06aa-39a5-8b88-5ca391dd62cb", name: "Almería", locationCount: 4, locations: [] },
    { id: "6fe25d49-cc0d-3be2-b279-79f34b705b0f", name: "Aranda de Duero", locationCount: 1, locations: [] },
    { id: "039c4e5f-38b4-3bad-a73d-429468bd7134", name: "Asturias", locationCount: 0, locations: [] },
    { id: "bc17a0ae-3f69-3268-9308-e843a998a80c", name: "Badajoz", locationCount: 1, locations: [] },
    { id: "dde16bea-ab8b-37fd-aec2-b5b5b2610e07", name: "Baleares", locationCount: 2, locations: [] },
    { id: "831eb98c-0d4f-3c83-a4ca-b22371a3fa9e", name: "Barcelona", locationCount: 29, locations: [] },
    { id: "e8d82c1e-f3a5-3f02-bb38-0ea2f7f40531", name: "Bilbao", locationCount: 4, locations: [] },
    { id: "73e20fc1-7181-3454-971e-f897fc1a3c73", name: "Bizkaia", locationCount: 2, locations: [] },
    { id: "49cebd2c-fa3a-3c8a-96cc-b9ddd34f5bb5", name: "Burgos", locationCount: 1, locations: [] },
    { id: "921203f2-4f64-378a-ab2f-2f61988f5ffc", name: "Calatayud", locationCount: 1, locations: [] },
    { id: "661bbe42-f836-3ad3-bfaa-a5e5ce0f2fde", name: "Cantabria", locationCount: 1, locations: [] },
    { id: "e1df82c8-c4cd-3984-a4ea-6e2fd92e774c", name: "Carrocera", locationCount: 1, locations: [] },
    { id: "b92afd76-3677-3a7e-824f-b60d6a010148", name: "Castellón de la Plana", locationCount: 3, locations: [] },
    { id: "38b9ca72-9567-3d07-9f83-1f1dd4080dd2", name: "Churra", locationCount: 1, locations: [] },
    { id: "b2512f57-c996-3a26-a42f-105a1aca0447", name: "Colmenar Viejo", locationCount: 1, locations: [] },
    { id: "69936624-6117-33b6-9264-80f44f878d22", name: "Cuenca", locationCount: 1, locations: [] },
    { id: "89c5ea06-e708-3cbe-8da0-1032d2321095", name: "Cáceres", locationCount: 2, locations: [] },
    { id: "ae0aeb5f-a706-3c4a-8495-0e4d9f83d39f", name: "Cádiz", locationCount: 6, locations: [] },
    { id: "8e3418f4-2752-35aa-9a43-ea56c46a4739", name: "Córdoba", locationCount: 4, locations: [] },
    { id: "bec945fa-79eb-3abc-97ea-b6558fc05556", name: "Dos Hermanas", locationCount: 1, locations: [] },
    { id: "c9b92a54-900e-3202-8e28-e146a0dc3872", name: "Erandio Vizcaya", locationCount: 0, locations: [] },
    { id: "67b6c7e3-d586-310f-b44a-236bda232a54", name: "Ferrol", locationCount: 1, locations: [] },
    { id: "f16e504c-306b-3a44-bb08-11b3c9aa1b54", name: "Fuenlabrada", locationCount: 1, locations: [] },
    { id: "da2d6eb8-cfb6-3f09-a2c4-600dcf23b31e", name: "Getafe", locationCount: 1, locations: [] },
    { id: "46563ca3-02f3-39cb-8ec1-88b7ada5dcfd", name: "Gijón", locationCount: 1, locations: [] },
    { id: "30354fb2-3801-3a41-b18f-82d7856c92de", name: "Gipuzkoa", locationCount: 2, locations: [] },
    { id: "4627be08-6f3a-35f7-a043-8826f4c069ab", name: "Girona", locationCount: 3, locations: [] },
    { id: "66941553-daff-3c9d-bf1c-2ce75c9c4339", name: "Gran Canaria", locationCount: 1, locations: [] },
    { id: "5e543706-7d6f-3a60-83d8-b3791f405585", name: "Granada", locationCount: 6, locations: [] },
    { id: "0f47c8b9-01b7-348e-a989-182a6ba0d786", name: "Huesca", locationCount: 1, locations: [] },
    { id: "010f643f-c51c-34b0-b4bb-0aa01788a5e1", name: "Irún", locationCount: 0, locations: [] },
    { id: "2234feb1-c991-3478-9d54-86605cf1d3b3", name: "Jaén", locationCount: 2, locations: [] },
    { id: "8ca14b19-ccc9-30a0-bb09-5cd154cef59f", name: "Jerez de la Frontera", locationCount: 0, locations: [] },
    { id: "49ecd0a1-9738-3ccc-95d6-d6618cf041d4", name: "La Laguna", locationCount: 1, locations: [] },
    { id: "4084ea08-a040-3925-b5c1-0ad2afaa9da5", name: "La Orotava", locationCount: 1, locations: [] },
    { id: "e5b3b9ee-7845-3532-aacb-8d9869e294ed", name: "La Zenia", locationCount: 1, locations: [] },
    { id: "46cb5ab2-49bb-3689-bb90-3bc25d7635ed", name: "Las Palmas", locationCount: 3, locations: [] },
    { id: "7af2d9a0-a93d-3b55-9753-c231cd9df349", name: "Leganés", locationCount: 1, locations: [] },
    { id: "94680e72-a66d-3047-9cbb-04070f2206f4", name: "León", locationCount: 1, locations: [] },
    { id: "686e30d3-6040-3e9d-a1ae-eed4928193d8", name: "Linares", locationCount: 1, locations: [] },
    { id: "806577d6-819f-3395-9267-dbc46a97cb69", name: "Lleida", locationCount: 2, locations: [] },
    { id: "6197aa5a-cfc1-3642-8679-3b1ce28dba97", name: "Logroño", locationCount: 1, locations: [] },
    { id: "3cdf38fa-8f7d-38d4-af51-71c560dd8e41", name: "Lugar Nuevo de la Corona", locationCount: 1, locations: [] },
    { id: "582633fa-6f1c-32bf-81b7-2fb5bcc84064", name: "Lugo", locationCount: 1, locations: [] },
    { id: "5e2e1453-5bc4-323e-957a-00da6fb70654", name: "Madrid", locationCount: 67, locations: [] },
    { id: "c3d5ecdc-109f-392b-ac75-3af0e75d2386", name: "Majadahonda", locationCount: 1, locations: [] },
    { id: "18c2faba-f5e1-3096-aa08-0121b99dab8e", name: "Mallorca", locationCount: 1, locations: [] },
    { id: "8db7d661-aec8-3996-aba6-54fa066a7838", name: "Marbella", locationCount: 1, locations: [] },
    { id: "a26a26fd-2ec5-351d-9cb8-766217f99a24", name: "Mataró", locationCount: 1, locations: [] },
    { id: "24329cf0-9ea3-3663-b96d-7ae19520b5ec", name: "Murcia", locationCount: 4, locations: [] },
    { id: "60dc13e1-75f7-3f37-86e3-f200e9470a29", name: "Málaga", locationCount: 8, locations: [] },
    { id: "fc387f1b-cedb-36e6-8a05-ba8190c96061", name: "Palma de Mallorca", locationCount: 1, locations: [] },
    { id: "6b40043e-0292-39c8-b77b-7d904d7f0db5", name: "Pamplona", locationCount: 1, locations: [] },
    { id: "f6f3aaa7-b1d6-348a-ba46-13913773ba0a", name: "Pontevedra", locationCount: 2, locations: [] },
    { id: "772efa64-b2db-38b2-a163-9f283164e7a3", name: "San Sebastián", locationCount: 6, locations: [] },
    { id: "e2cdc302-d1fa-3fb4-af3c-f3f4e558c518", name: "Santa Cruz de Tenerife", locationCount: 1, locations: [] },
    { id: "acf7014d-ac56-33b9-b6eb-bfb80ebf48c6", name: "Santander", locationCount: 5, locations: [] },
    { id: "40b306fb-f1a0-3a4e-81ab-541161701bb1", name: "Santiago de Compostela", locationCount: 1, locations: [] },
    { id: "fa401202-63fb-3735-9c1c-16557d956fd9", name: "Segovia", locationCount: 0, locations: [] },
    { id: "68b58302-a5ae-3deb-8422-c1a7c6dcb929", name: "Sestao", locationCount: 1, locations: [] },
    { id: "da7dbaac-2d8f-3f6f-ac47-0eca9fdf907c", name: "Sevilla", locationCount: 9, locations: [] },
    { id: "9617dc86-2bae-33fe-a0cf-ba4297a0ecd1", name: "Tarragona", locationCount: 14, locations: [] },
    { id: "f34c2700-1b86-3e9f-ac27-2c4ac0152c03", name: "Tauste", locationCount: 1, locations: [] },
    { id: "99f65288-6b0b-32b7-888d-8130815df498", name: "Toledo", locationCount: 1, locations: [] },
    { id: "27e3d8d5-864c-322b-83f7-272e9645e340", name: "Torrejón de Ardoz", locationCount: 1, locations: [] },
    { id: "9ed0c4f9-8df5-3666-88a3-190b34df3b83", name: "Torrelodones", locationCount: 1, locations: [] },
    { id: "78b422bf-36e9-3504-bbf0-97d3297ff3cc", name: "Valencia", locationCount: 9, locations: [] },
    { id: "4790a01b-a3d3-3cce-9db9-a5bd41845215", name: "Valladolid", locationCount: 4, locations: [] },
    { id: "7b4f31fd-bffc-33f9-bb15-e2dfa34d15bb", name: "Vigo", locationCount: 2, locations: [] },
    { id: "04e2a003-bac5-3faa-999a-36c7897da94d", name: "Vilagarcía de Arousa", locationCount: 0, locations: [] },
    { id: "1496bfbc-3a25-3c43-ac59-b2a3557ff875", name: "Vilanova i la Geltrú", locationCount: 1, locations: [] },
    { id: "0c02c3f0-b633-3a1e-80ee-763564176119", name: "Vitoria", locationCount: 1, locations: [] },
    { id: "91c675b1-b686-36ea-a363-986950c46879", name: "Zaragoza", locationCount: 5, locations: [] },
    { id: "b8c8a670-316f-36ce-9cb1-9acc99039cd3", name: "Álava", locationCount: 1, locations: [] },
  ],
  },
  {
    id: "c81e1a61-549d-3336-a594-b97dd63cf4ba",
    name: "NO USAR - Heineken UK",
    country: "GB",
    createdAt: "Thu, Jun 20, 2024 11:09 AM",
    updatedAt: "Sun, Jul 21, 2024 4:19 PM",
    sets: [
    { id: "9df97cd0-2224-3bd4-b5a8-011894a0ec73", name: "Adeyfield", locationCount: 1, locations: [] },
    { id: "39c1a123-e5ab-3e78-afd0-9ccca2e5b60f", name: "Altrincham", locationCount: 1, locations: [] },
    { id: "0e22a795-5a7d-3c1d-97c8-a7e52e2ba4c8", name: "Ariel Way", locationCount: 1, locations: [] },
    { id: "7c1dda25-341d-3a02-88a4-2256f36f1b7d", name: "Askew Road", locationCount: 1, locations: [] },
    { id: "85d575f4-7759-3221-951f-cc0e42947af6", name: "Basildon", locationCount: 1, locations: [] },
    { id: "523fc79e-a481-3376-bb56-d173ae6674fa", name: "Battersea Bridge Rd", locationCount: 1, locations: [] },
    { id: "491e8577-e829-395c-a4c0-e00b5fa8883c", name: "Battersea Park Rd", locationCount: 1, locations: [] },
    { id: "4390411e-fb3f-31b7-a442-2a85a4f189e7", name: "Bearsden", locationCount: 2, locations: [] },
    { id: "d521615e-7f66-3430-a7f7-c696ab57db0e", name: "Berkshire", locationCount: 3, locations: [] },
    { id: "bd7ca2d4-bae5-3be9-b468-ae9ef6c88ff7", name: "Berwick St", locationCount: 1, locations: [] },
    { id: "03df27eb-265a-310a-9e07-10e520b619cd", name: "Birmingham", locationCount: 1, locations: [] },
    { id: "ea3fb20d-84cc-3f53-9eeb-fbc6bf7646dc", name: "Bradford", locationCount: 2, locations: [] },
    { id: "a9eadb7f-e1fa-3348-94dc-0bd216bc2f85", name: "Brixton Hill", locationCount: 1, locations: [] },
    { id: "da021f65-e29a-3f8a-8ae7-1f030482d744", name: "Brixton Road", locationCount: 1, locations: [] },
    { id: "2abab6cc-bc56-3c57-9798-686283e01163", name: "Buckinghamshire", locationCount: 2, locations: [] },
    { id: "38accc7f-c44a-3868-9661-d20823d5502a", name: "Canada Square", locationCount: 1, locations: [] },
    { id: "df9d7bfc-0e90-3d94-b3f1-0f382e1f82ef", name: "Canal Way", locationCount: 1, locations: [] },
    { id: "08dffcac-caa8-3d53-ae42-8e9768c1dc72", name: "Cheadle", locationCount: 1, locations: [] },
    { id: "0c47d8cb-acf6-3263-ac5d-3c80cd15048d", name: "Chiswick", locationCount: 2, locations: [] },
    { id: "4179f28a-5fee-33f3-8850-0187cd883cdc", name: "City Rd", locationCount: 1, locations: [] },
    { id: "e9d37790-504d-3c7b-a964-91389461e946", name: "Cornwall", locationCount: 2, locations: [] },
    { id: "a8a29de7-da2b-3c1c-bf9f-e9190aec286a", name: "Croydon", locationCount: 2, locations: [] },
    { id: "76bac094-3b99-3ab4-a010-d2c4bc8e962d", name: "Cumbria", locationCount: 1, locations: [] },
    { id: "db72ea7a-5313-343c-ad13-de6053b592e6", name: "Derbyshire", locationCount: 1, locations: [] },
    { id: "3d95c321-7384-368b-9bb8-94ac43371f57", name: "Devon", locationCount: 2, locations: [] },
    { id: "df9f9033-a13f-32dc-9bfd-7f4701797f2f", name: "Dukinfield", locationCount: 1, locations: [] },
    { id: "07069fa0-4aaa-35c1-bd1d-6a0054f75dcb", name: "Dundee", locationCount: 1, locations: [] },
    { id: "d882e4e5-ee04-39c7-b750-80d126e241ba", name: "Durham", locationCount: 1, locations: [] },
    { id: "16f883ee-f349-3920-92a5-3fa6a1554cfa", name: "East Kilbride", locationCount: 1, locations: [] },
    { id: "10a908e5-484d-3b15-b2c8-b59fa2284d4d", name: "East Midlands", locationCount: 15, locations: [] },
    { id: "a78230e2-7a97-3f94-923f-e6281b10e519", name: "East Sussex", locationCount: 1, locations: [] },
    { id: "c17fb1b6-8639-36f8-b1fd-06d0d974871b", name: "Eccles", locationCount: 1, locations: [] },
    { id: "399fc3f0-465d-36b6-8655-c404f34bd244", name: "Edgware Rd", locationCount: 1, locations: [] },
    { id: "d17eef63-3356-355c-adb7-48c635089742", name: "Edinburgh", locationCount: 1, locations: [] },
    { id: "183f6011-8826-3de5-847f-39e447731ba5", name: "Essex", locationCount: 2, locations: [] },
    { id: "bffd01e8-2985-3126-bbb9-e765db5bd78a", name: "Failsworth", locationCount: 1, locations: [] },
    { id: "df208a09-a3e8-37e0-afbf-65cc09b0cf19", name: "Glasgow", locationCount: 1, locations: [] },
    { id: "63c0104b-e786-3565-b9a0-bfa12877bc05", name: "Greater Manchester", locationCount: 2, locations: [] },
    { id: "771df12f-533c-3a08-a7c7-a87c3b835488", name: "Hampshire", locationCount: 2, locations: [] },
    { id: "6f55be89-42e0-377d-b735-eef036d487bf", name: "Harbour Exchange Square", locationCount: 1, locations: [] },
    { id: "126ba851-3b45-3cf0-be32-8bbecd6617d9", name: "Havering", locationCount: 1, locations: [] },
    { id: "103a9f0a-03a9-3caf-8723-4d956495f8c0", name: "Hertfordshire", locationCount: 2, locations: [] },
    { id: "2f684d5a-acbd-3dde-b4a3-3048384dd429", name: "Highbury Cres", locationCount: 1, locations: [] },
    { id: "6dfb4d25-ea43-3a21-b721-d315e9acae82", name: "Inverness", locationCount: 1, locations: [] },
    { id: "663fee25-1354-3e41-8367-7417dc21dc81", name: "Isle of Anglesey", locationCount: 1, locations: [] },
    { id: "6eb84c27-90d7-3625-88be-db460e024dde", name: "Keighley", locationCount: 1, locations: [] },
    { id: "53962c72-9fc3-3013-aac9-e68bc829c314", name: "Kent", locationCount: 5, locations: [] },
    { id: "01473566-7c98-3708-b74f-15429c554b59", name: "Kingston Upon Thames", locationCount: 1, locations: [] },
    { id: "f9093707-55ef-3327-af19-889a0b8302e7", name: "Kingsway", locationCount: 1, locations: [] },
    { id: "60260fb4-f252-3d95-9fdd-85a8dd8f93a6", name: "Lambeth", locationCount: 1, locations: [] },
    { id: "813927e8-aaaf-30f1-a11b-e72bf3c1b295", name: "Lancashire", locationCount: 1, locations: [] },
    { id: "a59df590-05ba-3876-8812-19ff79452c6f", name: "Leeds", locationCount: 3, locations: [] },
    { id: "a81ce483-620a-3693-b701-f8239aa31e83", name: "London", locationCount: 34, locations: [] },
    { id: "edb1ba27-27b5-3f48-a2b4-b719010831c3", name: "Marsham St", locationCount: 1, locations: [] },
    { id: "5fa2e23d-13e6-3808-aa3b-af65152f072a", name: "Marylebone High St", locationCount: 1, locations: [] },
    { id: "d17bab7f-d296-3cab-9bf1-87fd7092d52f", name: "Mayfair", locationCount: 1, locations: [] },
    { id: "de8fef8b-c2ff-3e1f-b5d3-362564f1f9f2", name: "Mortimer St", locationCount: 1, locations: [] },
    { id: "f657c098-d288-377d-a3de-91d9b7e153d8", name: "Newton Mearns", locationCount: 1, locations: [] },
    { id: "41b3d1a1-4354-3842-9851-147fc9ba8afa", name: "Norfolk", locationCount: 1, locations: [] },
    { id: "399c901b-911b-30cf-8299-5c84791bb170", name: "North End Crescent", locationCount: 1, locations: [] },
    { id: "9a8b7b1f-f054-3421-8b1b-acdc8b71465a", name: "Northumberland", locationCount: 1, locations: [] },
    { id: "0c70e069-7ceb-37ff-9686-5c3de872671c", name: "Notting Hill", locationCount: 1, locations: [] },
    { id: "e23101df-eb51-3826-afad-4b04df57a595", name: "Notting Hill Gate", locationCount: 1, locations: [] },
    { id: "27a60cf1-c1a6-33df-baa9-fae35c3f784d", name: "Nottinghamshire", locationCount: 2, locations: [] },
    { id: "de748a32-e332-3fb4-9753-cf7f0bc03411", name: "Old Town", locationCount: 1, locations: [] },
    { id: "9ffe8119-f584-3cae-91e4-d436c9116b2e", name: "Park Road", locationCount: 0, locations: [] },
    { id: "20aa4ebc-8ec8-30ee-9d65-2af16c1eae2a", name: "Redditch", locationCount: 1, locations: [] },
    { id: "55b55bb8-9252-3c82-a644-8e7d2b895781", name: "Richmond", locationCount: 1, locations: [] },
    { id: "5498b634-4ce0-33f2-92ac-d7755076caa1", name: "Saint Helens", locationCount: 1, locations: [] },
    { id: "07e218cd-11fc-3796-aea1-0929518751b6", name: "Scarborough", locationCount: 1, locations: [] },
    { id: "f8c6ed98-b280-3075-9c4e-0fd10fc89653", name: "Sheldon Square", locationCount: 1, locations: [] },
    { id: "3d0d2edc-8f6d-3056-8b2e-e614d6f2cb35", name: "Shepherd's Bush", locationCount: 1, locations: [] },
    { id: "b850ca3c-298e-3fbc-bc89-dccc608f50f3", name: "South Bank Tower", locationCount: 1, locations: [] },
    { id: "b830d47c-2ad6-38de-b7eb-185cdbf623ee", name: "South East", locationCount: 9, locations: [] },
    { id: "c10b418e-3d32-39bf-a202-cc39f61af13b", name: "South Hampstead", locationCount: 1, locations: [] },
    { id: "30c5d84f-f1dd-3b87-9528-9d16d39a02e7", name: "South Kensignton", locationCount: 1, locations: [] },
    { id: "6b23fac4-d014-3a93-8fc0-5136daeecae6", name: "South West", locationCount: 3, locations: [] },
    { id: "b2a71971-512e-374a-901a-82765004b28b", name: "South Yorkshire", locationCount: 4, locations: [] },
    { id: "10cb7914-d542-345d-8890-ccb3cbff8ae4", name: "St John's Rd", locationCount: 1, locations: [] },
    { id: "01377553-c123-38c8-9127-9641382ccc53", name: "St John's Street Oldham", locationCount: 1, locations: [] },
    { id: "5ec454b9-2dbc-32df-804a-f23a78962e3b", name: "Stockport", locationCount: 1, locations: [] },
    { id: "18047980-cf01-38de-b44c-5e6a24b99e5d", name: "Stourbridge", locationCount: 1, locations: [] },
    { id: "0ef2905e-77e8-38d2-b7e8-6a20b529bad5", name: "Strand", locationCount: 1, locations: [] },
    { id: "f4d0de8b-2241-353c-a38d-5033e88802d2", name: "Suffolk", locationCount: 1, locations: [] },
    { id: "2419b4c9-158c-3c4f-9baf-de79a44707d0", name: "Surrey", locationCount: 2, locations: [] },
    { id: "a963783b-154f-3184-9f99-611daba17f2e", name: "Sutton Coldfield", locationCount: 1, locations: [] },
    { id: "99351842-b600-307c-8e52-219a3e91d129", name: "Thornbury", locationCount: 1, locations: [] },
    { id: "11ad7c4d-92ab-3ee2-a183-e2ece45ecddb", name: "Tyne & Wear", locationCount: 3, locations: [] },
    { id: "c7f3bb12-ad4a-3b81-8d16-e71a3e3839b5", name: "UK", locationCount: 7, locations: [] },
    { id: "fba8248e-bc88-3ac2-8d19-310b0637d715", name: "Uxbridge Rd", locationCount: 1, locations: [] },
    { id: "dccf7b3a-735d-3302-a7b9-bede2e852927", name: "Wakefield", locationCount: 0, locations: [] },
    { id: "499d69c1-4b32-3914-a8a2-bb31c05f442e", name: "Walsall", locationCount: 1, locations: [] },
    { id: "c0e7d740-4685-30fd-b044-1b5d594ef56f", name: "Wembley", locationCount: 1, locations: [] },
    { id: "7134b4c8-4e3c-3bbe-ae5e-83c684870caa", name: "West Bromwich", locationCount: 1, locations: [] },
    { id: "fd499923-9163-3e26-adb4-b2844caf5ccd", name: "West Ealing", locationCount: 1, locations: [] },
    { id: "8be66c88-c2bd-3dd9-943a-8a109fcfc7c0", name: "West Lothian", locationCount: 1, locations: [] },
    { id: "0b539220-8b6e-3e87-b7af-a52cfd5c34e1", name: "West Midlands", locationCount: 10, locations: [] },
    { id: "65419fe3-e8d1-3c26-b9f8-df445b817a7c", name: "West Sussex", locationCount: 3, locations: [] },
    { id: "834dd298-6f4f-3542-918f-0607cb784aaf", name: "West Yorkshire", locationCount: 5, locations: [] },
    { id: "3e7523ff-fd59-3c8c-a588-d409acc79ba8", name: "Westminster", locationCount: 2, locations: [] },
    { id: "6fb2bf8e-4da4-37ac-bed7-2749439cdf5a", name: "Wharf Road", locationCount: 1, locations: [] },
    { id: "4199643e-00dc-33c0-8e9a-f2863c95144b", name: "Wilmslow", locationCount: 1, locations: [] },
    { id: "04a37350-abd2-318d-942a-5d70c9fc6eba", name: "Wiltshire", locationCount: 2, locations: [] },
    { id: "5f137331-d8af-3ded-977b-817adf5818a7", name: "Wimbledon", locationCount: 1, locations: [] },
    { id: "963ce9f9-f2dd-3350-91e4-d0f88b2c1599", name: "Yorkshire", locationCount: 1, locations: [] },
  ],
  },
  {
    id: "71945e5c-c404-303e-b0ec-a04d212cd9e0",
    name: "NO USAR - MX - Areas Nielsen names",
    country: "MX",
    createdAt: "Thu, Jun 20, 2024 11:10 AM",
    updatedAt: "Sun, Jul 21, 2024 4:19 PM",
    sets: [
    { id: "18db0da5-0b51-3ccc-96cb-4a76a4112a85", name: "Area 1: Pacífico", locationCount: 6, locations: [] },
    { id: "c3fa5846-a0d6-3342-9ab6-f526120f2c58", name: "Area 2: Norte", locationCount: 44, locations: [] },
    { id: "9a1120d5-6e3c-33db-9d42-e48a3c7e0a7f", name: "Area 3: Oeste Centro", locationCount: 7, locations: [] },
    { id: "524c2d00-f3da-38ba-93ed-5c4da15a9d43", name: "Area 4: Centro", locationCount: 8, locations: [] },
    { id: "2476a1eb-7a80-3778-97ef-12f52c8d320a", name: "Area 5: Valle de Mexico", locationCount: 45, locations: [] },
    { id: "c41db3cf-ee88-3cae-bb90-d9045b0fa325", name: "Area 6: Sureste", locationCount: 10, locations: [] },
  ],
  },
  {
    id: "2d11f2b4-b72d-349c-8973-c419e8031826",
    name: "PA - Coke Bottlers",
    country: "PA",
    createdAt: "Mon, May 19, 2025 8:58 AM",
    updatedAt: "Mon, May 19, 2025 8:58 AM",
    sets: [
    { id: "bc2c9536-d5ea-39f9-a5b5-1ce9d41ed86d", name: "FEMSA PA", locationCount: 61, locations: [] },
  ],
  },
  {
    id: "5f5b863a-a0e3-39db-a8e5-d35d07434f7a",
    name: "PE - Coke Bottlers",
    country: "PE",
    createdAt: "Mon, May 19, 2025 8:56 AM",
    updatedAt: "Mon, May 19, 2025 8:56 AM",
    sets: [
    { id: "9ba35e80-9ac3-3091-a28b-96889fb0503c", name: "Arca PE", locationCount: 448, locations: [] },
  ],
  },
  {
    id: "caf36d1d-0187-31d9-8540-3a1708c95beb",
    name: "PE - Departamentos",
    country: "PE",
    createdAt: "Sun, May 25, 2025 7:25 PM",
    updatedAt: "Sun, May 25, 2025 7:25 PM",
    sets: [
    { id: "33b62e94-76fd-3cc7-8424-29f526197bb2", name: "Amazonas", locationCount: 0, locations: [] },
    { id: "fddb52bc-3f1a-3d9f-8300-030c028927bf", name: "Apurímac", locationCount: 0, locations: [] },
    { id: "af0f9d91-af05-35d6-8d90-d575ac12178e", name: "Arequipa", locationCount: 11, locations: [] },
    { id: "215ea40e-bd77-30e4-93f0-bc8c0220c74b", name: "Ayacucho", locationCount: 0, locations: [] },
    { id: "a58bc1a5-cc21-32f6-98ae-1678f4e84524", name: "Cajamarca", locationCount: 2, locations: [] },
    { id: "a9136745-182a-305f-a51e-16dbb5b03cca", name: "Callao", locationCount: 10, locations: [] },
    { id: "980afd65-3fa3-3a75-833c-63cfde989b5a", name: "Cusco", locationCount: 2, locations: [] },
    { id: "38351fe5-4a65-36fb-9262-364e132fbc0a", name: "Huancavelica", locationCount: 0, locations: [] },
    { id: "d5025b5f-87e8-3ebc-b6a6-fced4953245e", name: "Huánuco", locationCount: 2, locations: [] },
    { id: "3256e8f0-f17c-309a-87b6-a3a8be2d2e79", name: "Ica", locationCount: 4, locations: [] },
    { id: "305ec7c7-878a-380b-955c-dd00a181b6af", name: "Junín", locationCount: 2, locations: [] },
    { id: "b9b08065-0c7e-35f0-85eb-a64fcaa79674", name: "La Libertad", locationCount: 13, locations: [] },
    { id: "34751664-b74b-3864-a1a7-63611b0b9661", name: "Lambayeque", locationCount: 5, locations: [] },
    { id: "a3ca710e-759e-3197-b171-8253620665e1", name: "Lima", locationCount: 170, locations: [] },
    { id: "3f295907-5503-3afa-a931-45d0f76647d6", name: "Loreto", locationCount: 0, locations: [] },
    { id: "46c8f0d6-518f-39d8-a8cd-ed6687481c95", name: "Madre de Dios", locationCount: 0, locations: [] },
    { id: "aa47521a-8eec-3d0a-8911-9a33097bf9ae", name: "Moquegua", locationCount: 0, locations: [] },
    { id: "a0c9e45d-d40b-3451-9057-6f24cf6ab283", name: "Pasco", locationCount: 0, locations: [] },
    { id: "bbac7dae-c4e4-39df-ab60-e8cb48a794a8", name: "Piura", locationCount: 5, locations: [] },
    { id: "2053ad94-f26c-30e6-9212-3f124f86f663", name: "Puno", locationCount: 0, locations: [] },
    { id: "ae4621b7-f511-3904-9048-3b87fff0bcda", name: "San Martín", locationCount: 0, locations: [] },
    { id: "cd374c16-8649-3bf2-a339-087b4f9cc887", name: "Tacna", locationCount: 0, locations: [] },
    { id: "a3dbae8e-04ad-3e6e-a5ca-0b7e6e251d55", name: "Tumbes", locationCount: 0, locations: [] },
    { id: "e8ef9c3c-39c3-31f9-a425-6415631a8945", name: "Ucayali", locationCount: 2, locations: [] },
    { id: "8a40e080-80e9-3075-a463-ae5c5453d683", name: "Áncash", locationCount: 2, locations: [] },
  ],
  },
  {
    id: "30ab1048-2bb9-339f-b731-c17ebc6e1327",
    name: "QA - Municipality",
    country: "QA",
    createdAt: "Tue, Dec 24, 2024 6:36 PM",
    updatedAt: "Thu, Dec 26, 2024 6:44 PM",
    sets: [
    { id: "508311dd-7d14-36e1-9165-5d9492f05e7c", name: "Al Daayen", locationCount: 1, locations: [] },
    { id: "d78096aa-96f8-3285-91ed-3133ff685a5a", name: "Al Khor", locationCount: 1, locations: [] },
    { id: "f2a8d9db-a617-3b36-aabb-248cbe4e9d1f", name: "Al Rayyan", locationCount: 1, locations: [] },
    { id: "b8116e71-d978-30d1-87a0-6bc58dab6289", name: "Al Shamal", locationCount: 0, locations: [] },
    { id: "0a3f8aa1-2ae6-3714-ab84-dd0c4705acc2", name: "Al Wakrah", locationCount: 1, locations: [] },
    { id: "fd24627f-d29a-3ebd-9ecf-2199f6d7a25b", name: "Al-Shahaniya", locationCount: 0, locations: [] },
    { id: "64f33622-6a84-389d-a15f-7795e68e6bea", name: "Doha", locationCount: 3, locations: [] },
    { id: "610d0cf2-ab25-35c5-a740-c7de8fd22b75", name: "Umm Salal", locationCount: 0, locations: [] },
  ],
  },
  {
    id: "f4a184f1-7459-31c3-94d5-15230e781b8d",
    name: "SA - PVM",
    country: "SA",
    createdAt: "Thu, Nov 28, 2024 1:51 PM",
    updatedAt: "Thu, Nov 28, 2024 1:51 PM",
    sets: [
    { id: "f3f4c1fc-bd67-39ad-a0b1-86d9a4b7d8ac", name: "Damam and Eastern Region", locationCount: 38, locations: [] },
    { id: "8e584356-9ad5-3665-bbdd-006e0a0488cd", name: "Jeddah and Western Region", locationCount: 100, locations: [] },
    { id: "6308bcdc-51ce-3f64-9ccf-180091b5d09d", name: "Riyadh and Central Region", locationCount: 377, locations: [] },
  ],
  },
  {
    id: "f88db9a1-120f-3dcf-afd0-d7b4fc8e2ea1",
    name: "UK - Counties",
    country: "GB",
    createdAt: "Mon, Jul 22, 2024 4:14 PM",
    updatedAt: "Mon, Jul 22, 2024 4:14 PM",
    sets: [
    { id: "879e4f8d-39c4-3695-b7c0-c596770f3293", name: "Aberdeen City", locationCount: 2, locations: [] },
    { id: "7ce33677-4d2f-36d2-9da5-5cef64d14801", name: "Aberdeenshire", locationCount: 0, locations: [] },
    { id: "3f6ed4b7-4fcb-3255-b772-4d3fde558424", name: "Anglesey/Sir Fon", locationCount: 1, locations: [] },
    { id: "123c19bf-7056-3641-bcf2-822b4b0f0b61", name: "Angus", locationCount: 2, locations: [] },
    { id: "04b4fd0d-069e-3ed7-97e3-e0a03d10de01", name: "Argyll and Bute", locationCount: 1, locations: [] },
    { id: "33a59313-cec0-3408-832c-a05c28b07128", name: "Bedfordshire", locationCount: 1, locations: [] },
    { id: "8fda2d26-2a22-3922-95fb-3089b8905368", name: "Berkshire", locationCount: 4, locations: [] },
    { id: "01ae9226-e249-3670-8544-439dc5791f1d", name: "Blaenau Gwent", locationCount: 0, locations: [] },
    { id: "40b175d2-38a4-3edf-81e6-1888fb9dc2b9", name: "Bridgend", locationCount: 0, locations: [] },
    { id: "b2bedee0-43ad-35ad-b116-369fe25357d2", name: "Bristol", locationCount: 5, locations: [] },
    { id: "4c8ad54b-6dc2-3984-926d-bb36bda23fb7", name: "Buckinghamshire", locationCount: 2, locations: [] },
    { id: "286666e0-06e3-31dd-8e05-048c46be8cb0", name: "Caerphilly", locationCount: 0, locations: [] },
    { id: "e774184e-d815-32c8-bb81-7cae450f17a2", name: "Cambridgeshire", locationCount: 1, locations: [] },
    { id: "890b74c7-cbf3-35d6-8d36-d5d528ca791c", name: "Cardiff", locationCount: 0, locations: [] },
    { id: "9d7e8719-b8d9-3676-8765-99d924eeb0d6", name: "Carmarthenshire", locationCount: 0, locations: [] },
    { id: "adc00028-db04-3b96-9b86-909fab6e2141", name: "Ceredigion", locationCount: 0, locations: [] },
    { id: "280229b0-9b75-3933-8fd1-73ec45f94fa4", name: "Cheshire", locationCount: 10, locations: [] },
    { id: "07e5e0a8-5e03-3290-bb7b-79a30d070448", name: "Clackmannanshire", locationCount: 1, locations: [] },
    { id: "1d5f71d3-681c-3695-a87b-ade6e4f250f6", name: "Conwy", locationCount: 0, locations: [] },
    { id: "b2066a73-b03f-3338-8462-a3ea4521e7fe", name: "Cornwall", locationCount: 2, locations: [] },
    { id: "d6205b85-67fb-3280-99a1-72581021fb79", name: "County Antrim", locationCount: 0, locations: [] },
    { id: "d25438cd-e765-3c21-bb03-fda4efee04aa", name: "County Armagh", locationCount: 0, locations: [] },
    { id: "be5114ee-0be8-3db3-8720-9d9fafc72fa7", name: "County Down", locationCount: 0, locations: [] },
    { id: "8f4e1629-335c-3559-9aa4-d5cf4ee6971b", name: "County Fermanagh", locationCount: 0, locations: [] },
    { id: "23bc2118-cc6e-368d-b8c2-0fb9c30a5030", name: "County Londonderry", locationCount: 0, locations: [] },
    { id: "fb979c69-a7e5-3003-914d-5aa14b2b4341", name: "County Tyrone", locationCount: 0, locations: [] },
    { id: "d53c5e99-1dbd-3481-a79d-d47f0eadbac1", name: "Cumbria", locationCount: 1, locations: [] },
    { id: "d2438645-75a5-313a-9a47-4e876ee961e9", name: "Denbighshire", locationCount: 0, locations: [] },
    { id: "dd2bc436-a06b-3715-a550-c707dbe4c63a", name: "Derbyshire", locationCount: 1, locations: [] },
    { id: "b2a54fc7-42bb-3cbc-89d3-5ebabaf8253d", name: "Devon", locationCount: 1, locations: [] },
    { id: "f6c0fb0b-493c-3176-b28a-4e85ebc92cbc", name: "Dorset", locationCount: 1, locations: [] },
    { id: "cc56229f-86b9-325b-9fc7-0c7aef0fc0c5", name: "Dumfries and Galloway", locationCount: 0, locations: [] },
    { id: "c9b53b31-3636-344e-bc1d-7b54c17c41e1", name: "Dundee", locationCount: 1, locations: [] },
    { id: "b7d47622-3f82-3178-a5bb-184ed10ecb43", name: "Durham", locationCount: 1, locations: [] },
    { id: "c4b6629f-3a30-3ec9-a133-2f98f4277616", name: "East Ayrshire", locationCount: 0, locations: [] },
    { id: "c58c4e88-8afd-3130-81f3-8dfcef438ac3", name: "East Dunbartonshire", locationCount: 0, locations: [] },
    { id: "af8bbd65-fc6c-3851-bb5f-3c98b97a71a1", name: "East Lothian", locationCount: 2, locations: [] },
    { id: "c6d2aea2-a15e-3c6a-ad73-9f0a9e7e1447", name: "East Renfrewshire", locationCount: 1, locations: [] },
    { id: "373b2c20-2f08-37cc-b9ba-f42bcb18468e", name: "East Riding of Yorkshire", locationCount: 1, locations: [] },
    { id: "0b41d903-172b-3586-a33c-3594f0ca834a", name: "East Sussex", locationCount: 4, locations: [] },
    { id: "69c6e132-abf4-3eed-a2c6-4fc15d07d87b", name: "Edinburgh", locationCount: 2, locations: [] },
    { id: "9b6c5e3b-adb1-36ac-bfcf-97e408e5db04", name: "Essex", locationCount: 5, locations: [] },
    { id: "e2b0b2eb-4edf-3ee5-b73d-56d6fbbff46f", name: "Falkirk", locationCount: 0, locations: [] },
    { id: "1bf468c4-1568-3da7-89e2-4060eaabe7e7", name: "Fife", locationCount: 0, locations: [] },
    { id: "58802509-7c9b-3f46-8ed4-588a74db770c", name: "Flintshire", locationCount: 0, locations: [] },
    { id: "675c9f31-22bf-32aa-a501-f7dd81ac5677", name: "Glamorgan", locationCount: 1, locations: [] },
    { id: "9523fd18-9dc1-329a-9eba-fcbe396a5311", name: "Glasgow", locationCount: 6, locations: [] },
    { id: "90c1eded-b1e8-3b66-8b59-2327003f8b44", name: "Gloucestershire", locationCount: 1, locations: [] },
    { id: "0c815fa4-8345-3041-b00f-7c73ff96ed3f", name: "Greater London", locationCount: 94, locations: [] },
    { id: "3a82656e-3929-3a38-bce5-16cbd196e053", name: "Greater Manchester", locationCount: 7, locations: [] },
    { id: "dc6d7755-5fc0-3f12-a5ee-5634708d856c", name: "Gwynedd", locationCount: 0, locations: [] },
    { id: "36cc5c42-6174-3ae8-8d1d-858cee272835", name: "Hampshire", locationCount: 2, locations: [] },
    { id: "a232e272-c33b-3dd9-abcd-fdaf69afef72", name: "Herefordshire", locationCount: 1, locations: [] },
    { id: "689d69c4-6cf1-3bb5-8d3b-cdc0825f0967", name: "Hertfordshire", locationCount: 2, locations: [] },
    { id: "a9a8209f-5587-3e71-b512-03caa7711a65", name: "Highland", locationCount: 3, locations: [] },
    { id: "5ad435e6-e1d8-389c-aa61-4a7ee6cadf98", name: "Inverclyde", locationCount: 0, locations: [] },
    { id: "dc16da1e-4000-3b45-b592-6628057a5025", name: "Isle of Wight", locationCount: 0, locations: [] },
    { id: "ccfa7874-0701-323d-9073-820caccde201", name: "Kent", locationCount: 4, locations: [] },
    { id: "18cdb24b-5c87-36ca-bb3e-90b65ac14ca7", name: "Lancashire", locationCount: 5, locations: [] },
    { id: "9e77f512-1eda-3da9-8c18-d4168f18f62b", name: "Leicestershire", locationCount: 17, locations: [] },
    { id: "2be808e2-88cb-37a5-8d26-9954e81b2f31", name: "Lincolnshire", locationCount: 0, locations: [] },
    { id: "67ff3d3e-be56-3132-b1bc-987142c6c847", name: "Merseyside", locationCount: 3, locations: [] },
    { id: "077b8b31-8d53-36f3-b90a-0c781f904e98", name: "Merthyr Tydfil", locationCount: 0, locations: [] },
    { id: "5a668146-412e-3b7b-aa20-39d5e624eea2", name: "Middlesex", locationCount: 3, locations: [] },
    { id: "068ed3ed-8554-3c88-b95d-7a152c6fd254", name: "Midlothian", locationCount: 4, locations: [] },
    { id: "b6c68756-2e88-3553-9aca-91bca8a0ce04", name: "Monmouthshire", locationCount: 1, locations: [] },
    { id: "12270459-a97f-38ef-881b-1b691ff59ede", name: "Moray", locationCount: 0, locations: [] },
    { id: "610c2807-1ba0-323b-817c-84bdfd3e3205", name: "Neath Port Talbot", locationCount: 1, locations: [] },
    { id: "52852298-192d-3760-892d-b4bb9eaf3eb9", name: "Newport", locationCount: 1, locations: [] },
    { id: "de03183e-2e2d-3c7f-acfe-e54ccff5dd97", name: "Newport City", locationCount: 0, locations: [] },
    { id: "a96cd43d-3550-3704-90ca-8772f814265b", name: "Norfolk", locationCount: 2, locations: [] },
    { id: "a4658388-f861-3e83-9195-3d3e99550d26", name: "North Ayrshire", locationCount: 0, locations: [] },
    { id: "d5ee0882-22f9-3967-ab86-67852986042c", name: "North Lanarkshire", locationCount: 0, locations: [] },
    { id: "2d0da3ac-b162-36b6-9f49-e68f0aa3e8c7", name: "North Yorkshire", locationCount: 6, locations: [] },
    { id: "d265de7a-0273-346e-b0e0-36dd76590b54", name: "Northamptonshire", locationCount: 2, locations: [] },
    { id: "6460bc4d-2946-3df1-afb4-1dff122da878", name: "Northumberland", locationCount: 4, locations: [] },
    { id: "ac177b1f-623f-3829-8d29-556a510c2526", name: "Nottinghamshire", locationCount: 8, locations: [] },
    { id: "adb410d9-56b3-362e-b835-b11e1da4afdc", name: "Orkney", locationCount: 2, locations: [] },
    { id: "bc35a36e-9288-38f0-b0d3-863e48ad9102", name: "Oxfordshire", locationCount: 1, locations: [] },
    { id: "7eb63611-ef1a-330e-bde6-c57c0ba4fc0a", name: "Pembrokeshire", locationCount: 0, locations: [] },
    { id: "0c05cd0c-49fd-3952-83df-f3bbb3988703", name: "Perth and Kinross", locationCount: 0, locations: [] },
    { id: "7ca270fd-1e55-3a87-8941-dc57c9ec5567", name: "Powys", locationCount: 0, locations: [] },
    { id: "5f0f0322-0cc3-35d5-b893-8267e2ef0bc5", name: "Renfrewshire", locationCount: 0, locations: [] },
    { id: "68165c04-d64c-3455-8a7a-e48d9de9fd11", name: "Rhondda Cynon Taff", locationCount: 0, locations: [] },
    { id: "ba23aac7-a7e7-32e2-8afd-101609ca532c", name: "Rutland", locationCount: 0, locations: [] },
    { id: "20bab522-6a54-3558-b514-62cc9459e8d6", name: "Scottish Borders", locationCount: 0, locations: [] },
    { id: "880cadf4-693f-36cd-95ff-72af127aef8b", name: "Shetland Isles", locationCount: 0, locations: [] },
    { id: "227cb799-2eda-3235-bd29-885ce9236e71", name: "Shropshire", locationCount: 1, locations: [] },
    { id: "ba60bd9f-ab66-38f3-84bb-062fd99d9b49", name: "Somerset", locationCount: 0, locations: [] },
    { id: "bf780628-53ca-37c7-bd17-5f22857b9e3d", name: "South Ayrshire", locationCount: 0, locations: [] },
    { id: "6f47ff88-9e21-3fb8-8d7d-939819fee5f5", name: "South Lanarkshire", locationCount: 0, locations: [] },
    { id: "a0391ecc-fb37-3437-8533-a5b4b4ea6cab", name: "South Yorkshire", locationCount: 5, locations: [] },
    { id: "f80a4489-8fde-339d-8c77-79543f11a1a5", name: "Staffordshire", locationCount: 9, locations: [] },
    { id: "f1acee37-80e9-31b4-b7be-b9103aa3a6a8", name: "Stirlingshire", locationCount: 2, locations: [] },
    { id: "a1023967-8756-3ed9-99a6-26e58d712ed1", name: "Suffolk", locationCount: 2, locations: [] },
    { id: "88471463-3804-39de-b799-fbb667e6fe41", name: "Surrey", locationCount: 1, locations: [] },
    { id: "bb97a7f1-5cd6-3518-bb1f-f591f6f691c1", name: "Swansea", locationCount: 0, locations: [] },
    { id: "8199dfaf-ded5-3788-9894-5a7d732da1e2", name: "Torfaen", locationCount: 0, locations: [] },
    { id: "038996c9-8d91-3260-9ee5-7b2d0ed4f36a", name: "Tyne and Wear", locationCount: 4, locations: [] },
    { id: "b6beebcb-d2f5-3d7f-ab2b-532ea72bcf56", name: "Warwickshire", locationCount: 1, locations: [] },
    { id: "0b187b3d-d9f0-3a3b-8c0b-f508acb089b9", name: "West Dunbartonshire", locationCount: 0, locations: [] },
    { id: "5900e238-384f-3503-bac8-d1d02465c1b2", name: "West Lothian", locationCount: 1, locations: [] },
    { id: "64202a0c-002d-368f-bce1-09709e8984c5", name: "West Midlands", locationCount: 13, locations: [] },
    { id: "341e6721-770b-318b-b6f4-82d7d984e1cf", name: "West Sussex", locationCount: 6, locations: [] },
    { id: "bc281493-1077-3225-9e43-6b3d2022d32f", name: "West Yorkshire", locationCount: 17, locations: [] },
    { id: "18c71543-9462-3e2f-9223-f1d7ae089fe1", name: "Western Isles", locationCount: 4, locations: [] },
    { id: "0172f8d1-335d-37f0-84d6-ddf7fab0949c", name: "Wiltshire", locationCount: 3, locations: [] },
    { id: "5260f7d6-612e-3b2d-9b66-3fd2ebb3a34a", name: "Worcestershire", locationCount: 0, locations: [] },
    { id: "7895d880-87f0-399d-9361-723c59f7b81d", name: "Wrexham", locationCount: 0, locations: [] },
  ],
  },
  {
    id: "566e7d57-0180-4bd5-bfee-793b3bd6b2c4",
    name: "UK - McCormick",
    country: "GB",
    createdAt: "Fri, Apr 17, 2026 9:09 AM",
    updatedAt: "Fri, Apr 17, 2026 9:09 AM",
    sets: [
    { id: "6b783d8b-0cbc-4450-aaf3-35dffae2da07", name: "North", locationCount: 0, locations: [] },
    { id: "926a9e30-bc32-4369-a9b7-0100d262f771", name: "South", locationCount: 0, locations: [] },
  ],
  },
  {
    id: "964bc9a9-0980-3ed2-bba2-33f79bd7f49a",
    name: "US - Coke Bottlers",
    country: "US",
    createdAt: "Thu, May 15, 2025 8:37 AM",
    updatedAt: "Thu, May 15, 2025 8:37 AM",
    sets: [
    { id: "1f6e5b5b-d168-38cb-991d-224d1ba71047", name: "ABARTA Coca-Cola Beverages", locationCount: 123, locations: [] },
    { id: "2c3672da-cad0-3bb4-8b03-51d242e948ac", name: "Aberdeen Coca-Cola Bottling Company", locationCount: 2, locations: [] },
    { id: "e4ad7854-8e43-3d39-8786-0300d1303622", name: "Ada Coca-Cola Bottling Company", locationCount: 5, locations: [] },
    { id: "0ad8c7c5-1f09-3018-8e94-4e4f7bc8e0e3", name: "Atlantic Bottling Company", locationCount: 59, locations: [] },
    { id: "61a38375-db5f-3f29-a045-95b4a2c690f3", name: "Binks Coca-Cola Bottling Company", locationCount: 2, locations: [] },
    { id: "e4cda8f9-5592-3257-9b01-33c06a673b35", name: "CCBC of Hot Springs", locationCount: 5, locations: [] },
    { id: "48b8e8f7-2ee1-3d09-8f0c-0a03aff693b5", name: "CCBC of Yakima & Tri-Cities", locationCount: 6, locations: [] },
    { id: "7d95910b-b922-33d9-a2e4-d15b4b0c2cd2", name: "Cedar City Coca-Cola Bottling Company", locationCount: 4, locations: [] },
    { id: "c38f401f-9a97-3d61-9054-9961024399b5", name: "Chesterman Company", locationCount: 58, locations: [] },
    { id: "50932cff-5ccd-32eb-8eef-1948cdd08742", name: "Clark Beverage Group", locationCount: 44, locations: [] },
    { id: "72b0f261-41cf-3573-9ba0-9ffce5ec8d4d", name: "Coca-Cola Beverages Florida", locationCount: 305, locations: [] },
    { id: "5e498c1e-1d21-3dff-90a3-a2d37d250197", name: "Coca-Cola Beverages Northeast, Inc", locationCount: 222, locations: [] },
    { id: "c952b143-de54-3eb9-8061-0beb52d3e0c4", name: "Coca-Cola Bottling Company High Country", locationCount: 41, locations: [] },
    { id: "68e17cf5-1923-37f9-98d3-36d686ec21ec", name: "Coca-Cola Bottling Company of Bemidji", locationCount: 2, locations: [] },
    { id: "ae55f0ce-c4db-3f30-a44e-80ae3a273c47", name: "Coca-Cola Bottling Company of Columbus", locationCount: 1, locations: [] },
    { id: "052aca80-abc9-328a-83c5-97cde9d04024", name: "Coca-Cola Bottling Company of Dickinson", locationCount: 1, locations: [] },
    { id: "91553ab1-c43e-3869-b7e4-98acb5753a86", name: "Coca-Cola Bottling Company of Fort Smith", locationCount: 14, locations: [] },
    { id: "fe2463bd-6edb-30a9-af60-b637e1aa1966", name: "Coca-Cola Bottling Company of Kokomo", locationCount: 4, locations: [] },
    { id: "96d91e60-ab01-383e-9914-b6c77df0ee6d", name: "Coca-Cola Bottling Company of Nashville", locationCount: 3, locations: [] },
    { id: "eb9f08be-75d4-351e-817b-447650662e6e", name: "Coca-Cola Bottling Company of Santa Fe", locationCount: 4, locations: [] },
    { id: "595392f6-7687-304a-837d-502f7784f91d", name: "Coca-Cola Bottling Company of Williston", locationCount: 1, locations: [] },
    { id: "cc908eb0-b489-3200-8d66-acd79455c460", name: "Coca-Cola Bottling Company of Winfield", locationCount: 3, locations: [] },
    { id: "4f1ec166-af88-3653-b4fb-b00ab8208110", name: "Coca-Cola Bottling Company of Winona", locationCount: 1, locations: [] },
    { id: "680660d5-73b7-3c04-83f5-35fd00f4d527", name: "Coca-Cola Bottling Company United", locationCount: 489, locations: [] },
    { id: "9c312819-cd4e-3142-b601-47556a79f0e4", name: "Coca-Cola Bottling of Emporia", locationCount: 1, locations: [] },
    { id: "e0f2516f-33e7-3f25-9598-c035e16f1fb9", name: "Coca-Cola Bottling of Minden", locationCount: 2, locations: [] },
    { id: "2bec650a-a69b-30fb-8f34-3d4cf8075340", name: "Coca-Cola Bottling Works of Tullahoma", locationCount: 14, locations: [] },
    { id: "5babe139-66c7-390b-b6fd-968e5b80fb3e", name: "Coca-Cola Consolidated, Inc", locationCount: 952, locations: [] },
    { id: "21dd836e-6fe2-37c6-89a0-edcea9da14dd", name: "Coca-Cola Southwest Beverages", locationCount: 634, locations: [] },
    { id: "cc200d42-9bfa-3e85-bc8e-6a4f6990aa2c", name: "Corinth Coca-Cola Bottling Works", locationCount: 38, locations: [] },
    { id: "e729e057-9d5e-3001-b5d1-c5e7278f9b76", name: "Decatur Coca-Cola Bottling Company", locationCount: 4, locations: [] },
    { id: "e0876062-351c-3f57-a1a2-82ed166e36fc", name: "Deming Coca-Cola Bottling Company", locationCount: 2, locations: [] },
    { id: "47f5c487-5a25-3630-a09c-3744047da8b0", name: "Durango Coca-Cola Bottling Company", locationCount: 7, locations: [] },
    { id: "4fcb277f-cc57-396f-b619-6204a06d38db", name: "Durham Coca-Cola Bottling Company", locationCount: 11, locations: [] },
    { id: "4eda5faf-0a5f-3b1b-b3f2-74eff2a1f2a5", name: "Hancock Bottling Company", locationCount: 1, locations: [] },
    { id: "a788b61c-9e8c-3812-aac9-df6e8519b115", name: "Heartland Coca-Cola Bottling Company", locationCount: 201, locations: [] },
    { id: "9f9ec2c2-c7a7-3580-827c-c8e8b4d70d94", name: "Huntsville Coca-Cola Bottling Company", locationCount: 15, locations: [] },
    { id: "a4012f44-dde9-37d5-b327-988f61f35046", name: "Idabel Coca-Cola Bottling Company", locationCount: 2, locations: [] },
    { id: "c5427fa0-40f5-3365-9268-680767c9f9a7", name: "Jefferson City CCBC", locationCount: 5, locations: [] },
    { id: "4b3b2a17-7ff8-3131-87f8-5002d5bf31a7", name: "Ketchikan Soda Works", locationCount: 1, locations: [] },
    { id: "89314366-98e9-38b1-af84-bfd30d8ed00d", name: "Lehrkinds Coca-Cola", locationCount: 2, locations: [] },
    { id: "087b93ed-0046-38f5-a04d-5cbbdc3ebbb0", name: "Liberty Coca-Cola Beverages", locationCount: 104, locations: [] },
    { id: "c4615abc-bda7-3f45-b5d1-070e2eb470af", name: "Love Bottling Company", locationCount: 10, locations: [] },
    { id: "361e84d3-efec-366b-9447-477bef7c29ae", name: "Lufkin Coca-Cola Bottling Company", locationCount: 2, locations: [] },
    { id: "820b671f-265e-3da7-af57-e58e7ff3e0fa", name: "Macon Coca-Cola Bottling Company", locationCount: 4, locations: [] },
    { id: "67fb9da7-0c3c-33d4-9a21-f022948d119e", name: "Magnolia Coca-Cola Bottling Company", locationCount: 1, locations: [] },
    { id: "d22c514e-b7f0-3911-ad3a-a1671f9ea36b", name: "Maui Soda & Ice Works", locationCount: 1, locations: [] },
    { id: "83ba550b-bc05-3b56-b80a-39c5dbdb49e7", name: "Meridian Coca-Cola Bottling Company", locationCount: 7, locations: [] },
    { id: "8f1dd165-8452-319b-a336-5f69261e8e48", name: "Middlesboro Coca-Cola Bottling Works", locationCount: 12, locations: [] },
    { id: "21fca7b8-8f75-31cc-9f57-1d00c550f53b", name: "Mile High Beverages", locationCount: 1, locations: [] },
    { id: "6a5fc258-26f7-3706-a2de-8d99c7a086d2", name: "Orangeburg Coca-Cola Bottling Company", locationCount: 2, locations: [] },
    { id: "61c18fe1-14c4-35f8-8f7e-2de1490f19c0", name: "Ozarks Coca-Cola Bottling Company", locationCount: 95, locations: [] },
    { id: "08aee1ac-b2cd-39ce-9724-19199cd68a39", name: "Reyes Beverage Group", locationCount: 605, locations: [] },
    { id: "0e3496b3-3b8b-3c16-81ba-83c4d35219b5", name: "Rock Hill Coca-Cola Bottling Company", locationCount: 8, locations: [] },
    { id: "e424e1bc-0d80-3835-9676-893611aad68c", name: "Swire Coca-Cola, USA", locationCount: 412, locations: [] },
    { id: "eaff4590-9e6f-34a7-9f59-4e7ad4576e94", name: "The Odom Corporation", locationCount: 17, locations: [] },
    { id: "ebf6a23a-e1aa-3360-b87f-a4d0588897d1", name: "Timber Country Coca-Cola", locationCount: 9, locations: [] },
    { id: "7fe1fc35-7c27-36f8-a313-cb4ca894ecdf", name: "Trenton Coca-Cola Bottling Company", locationCount: 2, locations: [] },
    { id: "94fcd5ed-ec56-32ff-8ddd-8cf09f2c1eda", name: "Union City Coca-Cola Bottling Company", locationCount: 2, locations: [] },
    { id: "d044c742-dc9d-353e-8cf9-3b793c967234", name: "Viking Coca-Cola Bottling Company", locationCount: 35, locations: [] },
  ],
  },
  {
    id: "8b5ec206-dc68-3a0d-9d76-d47448a862eb",
    name: "US - States",
    country: "US",
    createdAt: "Tue, Oct 29, 2024 10:19 AM",
    updatedAt: "Tue, Feb 18, 2025 2:01 PM",
    sets: [
    { id: "859cb2b8-5091-36be-b0c6-9be9b8da70ba", name: "Alabama", locationCount: 34, locations: [] },
    { id: "fc9161a7-518c-329b-8db3-f52a48f8a432", name: "Alaska", locationCount: 8, locations: [] },
    { id: "725d0806-eecc-3fa2-b50a-2b1689c22b66", name: "Arizona", locationCount: 109, locations: [] },
    { id: "70f32025-ae4e-3af2-99d4-4ec329f54a62", name: "Arkansas", locationCount: 27, locations: [] },
    { id: "39171870-2aa8-33c8-b83e-a6d9c040cf22", name: "California", locationCount: 462, locations: [] },
    { id: "b8081cf9-9a27-3e57-aa2d-f19019907ac6", name: "Colorado", locationCount: 72, locations: [] },
    { id: "bf26ae70-4628-31f2-86ec-4edcd7c21dbc", name: "Connecticut", locationCount: 17, locations: [] },
    { id: "e80ca975-1724-363c-8f60-e55dab82d0de", name: "Delaware", locationCount: 10, locations: [] },
    { id: "3ceb84a4-8108-3bbc-8eab-afd6a0415da8", name: "District of Columbia", locationCount: 11, locations: [] },
    { id: "41df9bc2-bc37-3a7e-91c2-5def67f4723a", name: "Florida", locationCount: 256, locations: [] },
    { id: "3485f1df-69e4-3daf-88b9-0522f3409171", name: "Georgia", locationCount: 188, locations: [] },
    { id: "429808a6-77f7-3264-8ff5-4d42e37303f3", name: "Hawaii", locationCount: 11, locations: [] },
    { id: "0572b7a7-93f2-3871-b76b-d43ccc478f05", name: "Idaho", locationCount: 16, locations: [] },
    { id: "a2c47e8b-9812-37ec-95e6-5cfeccf8efd8", name: "Illinois", locationCount: 87, locations: [] },
    { id: "663f54e3-f6b2-312d-9e5d-6c38194eebcd", name: "Indiana", locationCount: 77, locations: [] },
    { id: "726fae77-6711-3cf0-a612-abd82979a06f", name: "Iowa", locationCount: 13, locations: [] },
    { id: "26aadaa3-d7ed-31ef-a9b7-df2a30a9a1c3", name: "Kansas", locationCount: 25, locations: [] },
    { id: "9b4141b1-9155-3cd8-962b-ce33dff78bdf", name: "Kentucky", locationCount: 66, locations: [] },
    { id: "a51a8876-4f2b-302b-8e2f-cea9779c215e", name: "Louisiana", locationCount: 36, locations: [] },
    { id: "173ab18c-0b52-301f-b314-559e14696148", name: "Maine", locationCount: 8, locations: [] },
    { id: "6f899011-8e22-3743-915d-254a37207e0e", name: "Maryland", locationCount: 35, locations: [] },
    { id: "6f7c471c-e0b5-3a4e-b596-dd56f3e85a2a", name: "Massachusetts", locationCount: 47, locations: [] },
    { id: "ff056d6a-58e4-34ba-911e-cce8d7e08a7e", name: "Michigan", locationCount: 99, locations: [] },
    { id: "603a8e19-a0fb-3592-bf94-b049750f086c", name: "Minnesota", locationCount: 43, locations: [] },
    { id: "15fb718a-0304-383e-af25-a20277502ade", name: "Mississippi", locationCount: 24, locations: [] },
    { id: "e9ff9444-91ed-39ca-a180-0afd22dbfa7c", name: "Missouri", locationCount: 44, locations: [] },
    { id: "044df113-9d06-3c59-ac62-c33f95ffd4c7", name: "Montana", locationCount: 11, locations: [] },
    { id: "41d203c3-8f35-32c8-84db-b5293b83a90b", name: "Nebraska", locationCount: 19, locations: [] },
    { id: "04e2107c-5fb0-31bd-87c9-8e2a23958c75", name: "Nevada", locationCount: 55, locations: [] },
    { id: "604a46de-0f81-331a-b400-99f32d4dca1a", name: "New Hampshire", locationCount: 8, locations: [] },
    { id: "fa3d3de3-0d7f-3950-9ada-7de4c1328953", name: "New Jersey", locationCount: 48, locations: [] },
    { id: "b1f667ef-cb43-3894-b692-c29b1b93ebc7", name: "New Mexico", locationCount: 27, locations: [] },
    { id: "4424bb88-4fc7-3e91-b316-54a34db7569f", name: "New York", locationCount: 125, locations: [] },
    { id: "c631b821-2bcd-3364-b904-8f46393da3c6", name: "North Carolina", locationCount: 106, locations: [] },
    { id: "2579714e-9950-36fd-8011-ff35f8eebc0b", name: "North Dakota", locationCount: 11, locations: [] },
    { id: "a319e6cd-f804-3c81-bfea-101ce028ce13", name: "Ohio", locationCount: 109, locations: [] },
    { id: "5a771b6e-7453-385b-9a67-417413a57a71", name: "Oklahoma", locationCount: 46, locations: [] },
    { id: "cc2087e2-99b2-3a50-a00f-0dd88e1fa2c6", name: "Oregon", locationCount: 33, locations: [] },
    { id: "c6751520-a1d4-3683-9011-0fb96488ac32", name: "Pennsylvania", locationCount: 43, locations: [] },
    { id: "55bf2e8b-2c10-32c7-9adb-dc9fbd5183d0", name: "Rhode Island", locationCount: 10, locations: [] },
    { id: "c969daaa-ac1c-3197-b893-d521f834bf6b", name: "South Carolina", locationCount: 53, locations: [] },
    { id: "cf0e7f9c-1ae9-3467-a9ee-ffea530a46e4", name: "South Dakota", locationCount: 11, locations: [] },
    { id: "ba6e9f00-c2ef-3c4f-b7c7-9cb25746881a", name: "Tennessee", locationCount: 119, locations: [] },
    { id: "e59abadc-f677-3c12-aaa6-68d780654465", name: "Texas", locationCount: 490, locations: [] },
    { id: "bf7046dd-b12e-3c8d-b917-f2fd4817f763", name: "Utah", locationCount: 24, locations: [] },
    { id: "01bd8cbc-bc5d-317a-8339-95a2c58923bf", name: "Vermont", locationCount: 6, locations: [] },
    { id: "b19ca1ab-fe12-33d7-8856-bcae93effeea", name: "Virginia", locationCount: 113, locations: [] },
    { id: "07b3175d-15fc-355d-9da6-e0cd3402f381", name: "Washington", locationCount: 71, locations: [] },
    { id: "9e0460b4-bfb9-3227-b570-76c8b5acf11f", name: "West Virginia", locationCount: 15, locations: [] },
    { id: "0ac17f10-b385-3de5-b735-b7bd4d0e2a12", name: "Wisconsin", locationCount: 29, locations: [] },
    { id: "217ce2e8-991c-3530-9933-985fcd95ef9f", name: "Wyoming", locationCount: 11, locations: [] },
  ],
  },
  {
    id: "22393712-e348-3e34-b0a7-47ae7cc15d4e",
    name: "UY - Coke Bottlers",
    country: "UY",
    createdAt: "Mon, May 19, 2025 8:55 AM",
    updatedAt: "Mon, May 19, 2025 8:55 AM",
    sets: [
    { id: "4b67b468-ffbe-39eb-99f6-7c8e0bbff2aa", name: "FEMSA Monresa UY", locationCount: 157, locations: [] },
  ],
  },
  {
    id: "ad577b20-bae6-3f0d-8b45-a4557b29c225",
    name: "VE - Coke Bottlers",
    country: "VE",
    createdAt: "Mon, May 19, 2025 8:57 AM",
    updatedAt: "Mon, May 19, 2025 8:57 AM",
    sets: [
    { id: "8d11cc0f-369f-3571-91e9-db8c4054a72f", name: "FEMSA VE", locationCount: 206, locations: [] },
  ],
  },
  {
    id: "c9651ff3-aef1-3ab6-8f85-72b6473687e6",
    name: "VN - Wards",
    country: "VN",
    createdAt: "Tue, Jun 4, 2024 9:37 PM",
    updatedAt: "Mon, Jul 22, 2024 7:37 AM",
    sets: [
    { id: "13645260-1a37-353d-b70b-09c660c6985d", name: "Phường 1", locationCount: 2, locations: [] },
    { id: "8dbba4b4-37f7-3243-b3e4-5943ebb7a565", name: "Phường 10", locationCount: 1, locations: [] },
    { id: "41122a2d-4124-3bfd-84bc-41bb41bc1419", name: "Phường 11", locationCount: 2, locations: [] },
    { id: "6850d81e-4aa8-337f-99ba-b6cffbb3cd74", name: "Phường 12", locationCount: 1, locations: [] },
    { id: "b8f14171-8b8c-3ae3-b656-fadc5fcecee0", name: "Phường 14", locationCount: 1, locations: [] },
    { id: "29bdf776-8f4b-3ba5-9e3d-c8acc406ca93", name: "Phường 15", locationCount: 1, locations: [] },
    { id: "0e600ec8-d276-3767-9a61-f6a22275606f", name: "Phường 2", locationCount: 1, locations: [] },
    { id: "b337c9a0-df24-3601-9ce8-cdd7c597b68e", name: "Phường 25", locationCount: 1, locations: [] },
    { id: "d9c7c448-8084-3aba-9df2-e5ab29c654b5", name: "Phường 7", locationCount: 1, locations: [] },
    { id: "11c5b9ba-3909-3f70-b8d4-49cb73e71e64", name: "Phường 9", locationCount: 1, locations: [] },
    { id: "6d61e204-e297-3f40-a1ee-012e173401e8", name: "Phường Bình Trưng Tây", locationCount: 1, locations: [] },
    { id: "d1450bff-d4e2-3943-86b2-c6012c856a4a", name: "Phường Hiệp Tân", locationCount: 1, locations: [] },
    { id: "3368232e-9dde-313c-8127-047b29cdeb0f", name: "Phường Linh Đông", locationCount: 1, locations: [] },
    { id: "e10a581d-5997-30c7-9f25-951a190129b7", name: "Phường Phú Thuận", locationCount: 1, locations: [] },
    { id: "bda25d57-e585-32b8-994c-703b09fc738d", name: "Phường Phú Thọ Hòa", locationCount: 1, locations: [] },
    { id: "5ac4fa27-3550-3c36-8834-9462ec39f5b2", name: "Phường Phước Long A", locationCount: 1, locations: [] },
    { id: "a54bd8c5-ab99-3e7f-a8de-669f661095d2", name: "Phường Thới An", locationCount: 1, locations: [] },
    { id: "6db754be-ee33-3aee-a023-99043dc487a7", name: "Phường Tân Chánh Hiệp", locationCount: 1, locations: [] },
    { id: "1be02f7b-405d-3d8d-92e6-d150f9a07552", name: "Phường Tân Kiểng", locationCount: 1, locations: [] },
  ],
  },
  {
    id: "07ecd54e-9a9d-394f-883f-a9b6cbf73c28",
    name: "ZA - Provinces",
    country: "ZA",
    createdAt: "Mon, Aug 12, 2024 8:32 PM",
    updatedAt: "Mon, Aug 12, 2024 8:38 PM",
    sets: [
    { id: "5a28d72f-6739-38b1-a1aa-e6d6666fcc8e", name: "Eastern Cape", locationCount: 0, locations: [] },
    { id: "78ba8fd2-b99d-3ecd-8564-ad88b8427fd0", name: "Free State", locationCount: 0, locations: [] },
    { id: "c5b7a1ff-262c-38ea-bd02-f2fa118aabd9", name: "Gauteng", locationCount: 37, locations: [] },
    { id: "d3b25286-71ba-3ea0-b7ed-f0080068d5f0", name: "KwaZulu-Natal", locationCount: 7, locations: [] },
    { id: "f350b007-491c-3b1a-9ab4-da57defa10aa", name: "Limpopo", locationCount: 0, locations: [] },
    { id: "a7a03429-14cb-31ab-b292-46b9001a0564", name: "Mpumalanga", locationCount: 0, locations: [] },
    { id: "325d2ae0-f42f-347a-9401-5ed37155179b", name: "North West", locationCount: 0, locations: [] },
    { id: "9c23e795-ad66-3afd-9919-0e0a1a7c8835", name: "Northern Cape", locationCount: 0, locations: [] },
    { id: "7c8e43da-e523-3e0a-8ea3-d83abc0a0898", name: "Western Cape", locationCount: 13, locations: [] },
  ],
  },
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
    // Persistence is namespaced per app version (/v1 | /v2 | /v3) — see lib/appVersion.
    const raw = window.localStorage.getItem(versionedKey(key));
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}
