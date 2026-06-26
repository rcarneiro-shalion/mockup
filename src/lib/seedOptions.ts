import { REAL_LOCATION_SETS } from "./scenarioSeedData";

export const STORE_OPTIONS = [
  "Amazon US",
  "Walmart US",
  "Target US",
  "Kroger US",
];

export const GEOLOC_OPTIONS = ["NO_GEOLOC", "AUTOMATIC", "MANUAL"];

export const CATEGORY_OPTIONS = [
  "Pantry > Chocolate > Chocolate Boxes",
  "Beverages > Waters > Other",
  "Pantry > Coffee > Beans",
  "Beauty > Hair Care > Shampoo",
  "Others",
];

export const BUSINESS_UNIT_OPTIONS = [
  "Select a value",
  "CMI",
  "FSA",
  "DSM",
  "RMM",
  "MSH",
  "GEN",
];

export const EXTRACTION_TYPE_OPTIONS = [
  "SEARCH",
  "SHELF",
  "AD",
  "DIGITAL_SHELF_PLP",
  "DIGITAL_SHELF_PDP",
  "MEDIA",
];

// Client options are no longer static — derive them from the Clients store via
// getClientNames() in src/lib/clients.ts so dropdowns stay in sync with the
// Clients datagrid.

export const SEED_FREQUENCY_OPTIONS = [
  "NO_ROTATE_DAILY",
  "ROTATE_WEEKLY",
  "ROTATE_MONTHLY",
];

export const LOCATION_FREQUENCY_OPTIONS = ["NO_ROTATE_DAILY", "ROTATE_MONTHLY"];

// --- Scrapping Options / Stuff (2026 reframe) ---

// Timeframes a scrapping option can run under (mock values).
export const TIMEFRAME_OPTIONS = [
  "All Day (1 x day)",
  "Morning (1 x day)",
  "Twice Daily (2 x day)",
  "Weekly (1 x week)",
];

// Disjoint option: modalities (mutually exclusive distribution modes).
export const MODALITY_OPTIONS = ["pickup", "delivery", "shipping"];

// Disjoint option: sorting — encoded as a URL parameter appended to the seed URL.
export const SORT_OPTIONS = [
  "best_seller",
  "price_low_high",
  "price_high_low",
  "relevance",
  "newest",
];

// Scrapping option: how often it re-runs. "Custom" unlocks a simple Days field + a
// times-per-day selector (TIMES_PER_DAY_OPTIONS). (Frequency lives on the scrapping option,
// not the subscription; rotation stays on the subscription.)
export const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly", "Custom"];
// Custom frequency: how many runs per day.
export const TIMES_PER_DAY_OPTIONS = ["1x", "2x", "3x", "4x"];

// Subscription: what the rotation cycles through — a MULTI-select. Picking both
// Locations + Seeds is the intrinsic "both" condition (no separate value).
// (Zipcode was dropped — it was equivalent to Locations.)
export const ROTATION_OPTIONS = ["Locations", "Seeds"];

// Location SET — a named group of locations referenced by a Stuff.
export const LOCATION_SET_OPTIONS = [
  "Amazon US — All locations",
  "Walmart East Coast — 50 locations",
  "Walmart East Coast — 100 locations",
  "No geolocation",
  // Real store location sets pulled from backoffice-api (store > locations).
  ...REAL_LOCATION_SETS.map((s) => s.name),
];

// New seed model (3+1): seed type + scrapping type (PDP carries no scrapping type).
export const SEED_TYPE_OPTIONS = ["PDP", "URL", "API", "Keyword"];
export const SCRAPPING_TYPE_OPTIONS = ["SHELF/SEARCH", "PLP", "AD", "MEDIA"];

// Page type for a seed (used by the seed form).
export const PAGE_TYPE_OPTIONS = ["SUBCATEGORY", "CATEGORY", "HOME", "OFFERS", "BRAND_STORE", "LEGACY"];

export function readPersistedList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}