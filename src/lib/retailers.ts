import { nowStamp } from "./clients";

// ---------- shared options ----------

export const STORE_TYPE_OPTIONS = ["GEOLOC", "FLAGSHIP"];
export const STORE_CLASS_OPTIONS = ["BRICK_AND_CLICK", "MARKETPLACE", "SPECIALIST", "AGGREGATOR"];
export const DEVICE_OPTIONS = ["WEB", "APP"];

export const COUNTRY_OPTIONS = [
  "US", "ES", "BR", "MX", "FR", "DE", "IT", "NL", "BE", "GR",
  "HU", "ZA", "TH", "PE", "RO", "CO", "UY", "PA", "QA", "AR", "CL", "CA", "EC", "MM", "LT",
];

/** Country code → flag emoji (regional indicator symbols). */
export function flag(code?: string): string {
  if (!code || code.length !== 2) return "";
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
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

export const INITIAL_RETAILERS: Retailer[] = [
  { id: "r1", name: "24 Pharma BE", logoUrl: "", meta: "{}", createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Tue, Dec 12, 2023 9:20" },
  { id: "r2", name: "7 - Eleven APP TH", logoUrl: "", meta: "{}", createdAt: "Wed, Aug 13, 2025 3:00", updatedAt: "Wed, Aug 13, 2025 3:00" },
  { id: "r3", name: "99Food BR", logoUrl: "", meta: "{}", createdAt: "Thu, Nov 13, 2025 11:00", updatedAt: "Thu, Nov 13, 2025 11:00" },
  { id: "r4", name: "Abacus ES", logoUrl: "", meta: "{}", createdAt: "Tue, Dec 19, 2023 11:50", updatedAt: "Tue, Dec 19, 2023 11:50" },
  { id: "r5", name: "AB-Delhaize GR", logoUrl: "", meta: "{}", createdAt: "Tue, Jan 14, 2025 7:20", updatedAt: "Tue, Jan 14, 2025 7:20" },
  { id: "r6", name: "Agora APP PE", logoUrl: "", meta: "{}", createdAt: "Wed, Apr 16, 2025 3:20", updatedAt: "Wed, Apr 16, 2025 3:20" },
  { id: "r7", name: "Ahorramas ES", logoUrl: "", meta: "{}", createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Mon, Dec 11, 2023 11:00" },
  { id: "r8", name: "AiqFome BR", logoUrl: "", meta: "{}", createdAt: "Sun, Feb 9, 2025 5:52", updatedAt: "Sun, Feb 9, 2025 5:52" },
  { id: "r9", name: "Albert Heijn BE", logoUrl: "", meta: "{}", createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Sun, Apr 7, 2024 9:53" },
  { id: "r10", name: "Albert Heijn NL", logoUrl: "", meta: "{}", createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Wed, Nov 6, 2024 12:00" },
  { id: "r11", name: "Albertsons US", logoUrl: "", meta: "{}", createdAt: "Tue, Aug 19, 2025 6:40", updatedAt: "Tue, Mar 17, 2026 2:10" },
  { id: "r12", name: "Alcampo ES", logoUrl: "", meta: "{}", createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Wed, Nov 6, 2024 12:00" },
  { id: "r13", name: "AlfaDrink RO", logoUrl: "", meta: "{}", createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Mon, Dec 11, 2023 11:00" },
];

export function getRetailers(): Retailer[] {
  const list = readList<Retailer>(RETAILERS_KEY);
  return list.length ? list : INITIAL_RETAILERS;
}

export function emptyRetailer(): Retailer {
  return { id: genId(), name: "", logoUrl: "", meta: "{}", createdAt: nowStamp(), updatedAt: nowStamp() };
}

// ---------- Store ----------

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
  createdAt: string;
  updatedAt: string;
};

export const STORES_KEY = "retailers:stores";

export const INITIAL_STORES: Store[] = [
  { id: "st1", name: "Walmart Mismo Dia MX", domain: "walmart.com.mx", retailer: "Walmart MX", type: "GEOLOC", klass: "BRICK_AND_CLICK", device: "WEB", country: "MX", status: "Active", createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Mon, Jan 9, 2023 8:00" },
  { id: "st2", name: "Magazine Luiza BR - The Bar", domain: "magazineluiza.com.br-th...", retailer: "Magazine Luiza BR", type: "GEOLOC", klass: "MARKETPLACE", device: "WEB", country: "BR", status: "Active", createdAt: "Wed, Jan 1, 2025 9:00", updatedAt: "Wed, Jan 1, 2025 9:00" },
  { id: "st3", name: "Fnac ES", domain: "fnac.es", retailer: "Fnac ES", type: "FLAGSHIP", klass: "BRICK_AND_CLICK", device: "WEB", country: "ES", status: "Active", createdAt: "Wed, Jan 1, 2025 9:00", updatedAt: "Wed, Jan 1, 2025 9:00" },
  { id: "st4", name: "Petsmart US", domain: "petsmart.com", retailer: "Petsmart US", type: "GEOLOC", klass: "SPECIALIST", device: "WEB", country: "US", status: "Active", createdAt: "Thu, Jan 2, 2025 9:00", updatedAt: "Thu, Jan 2, 2025 9:00" },
  { id: "st5", name: "Rossmann HU", domain: "rossmann.hu", retailer: "Rossmann HU", type: "FLAGSHIP", klass: "BRICK_AND_CLICK", device: "WEB", country: "HU", status: "Active", createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Mon, Jan 9, 2023 8:00" },
  { id: "st6", name: "Nagumo BR", domain: "nagumo.com", retailer: "Nagumo BR", type: "GEOLOC", klass: "AGGREGATOR", device: "WEB", country: "BR", status: "Active", createdAt: "Wed, Jan 1, 2025 9:00", updatedAt: "Wed, Jan 1, 2025 9:00" },
  { id: "st7", name: "Costco MX", domain: "costco.com.mx", retailer: "Costco MX", type: "GEOLOC", klass: "BRICK_AND_CLICK", device: "WEB", country: "MX", status: "Active", createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Mon, Jan 9, 2023 8:00" },
  { id: "st8", name: "24 Pharma BE_nl", domain: "24pharma.be.nl", retailer: "24 Pharma BE", type: "FLAGSHIP", klass: "SPECIALIST", device: "WEB", country: "BE", status: "Active", createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Mon, Jan 9, 2023 8:00" },
  { id: "st9", name: "GrabFood MM - FSA", domain: "food.grab.com/mm", retailer: "GrabFood MM", type: "GEOLOC", klass: "AGGREGATOR", device: "WEB", country: "MM", status: "Active", createdAt: "Wed, Jan 1, 2025 9:00", updatedAt: "Wed, Jan 1, 2025 9:00" },
  { id: "st10", name: "Woolworths ZA", domain: "woolworths.co.za", retailer: "Woolworths ZA", type: "FLAGSHIP", klass: "BRICK_AND_CLICK", device: "WEB", country: "ZA", status: "Active", createdAt: "Fri, Feb 7, 2025 9:00", updatedAt: "Fri, Feb 7, 2025 9:00" },
  { id: "st11", name: "Idea Bellezza IT", domain: "ideabellezza.it", retailer: "Idea Bellezza IT", type: "FLAGSHIP", klass: "SPECIALIST", device: "WEB", country: "IT", status: "Active", createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Mon, Jan 9, 2023 8:00" },
  { id: "st12", name: "Amazon NL_nl", domain: "amazon.nl", retailer: "Amazon NL", type: "FLAGSHIP", klass: "MARKETPLACE", device: "WEB", country: "NL", status: "Active", createdAt: "Thu, Apr 4, 2024 9:00", updatedAt: "Thu, Apr 4, 2024 9:00" },
  { id: "st13", name: "Viking DE", domain: "viking.de", retailer: "Viking DE", type: "FLAGSHIP", klass: "BRICK_AND_CLICK", device: "WEB", country: "DE", status: "Active", createdAt: "Fri, Nov 1, 2024 9:00", updatedAt: "Fri, Nov 1, 2024 9:00" },
];

export function getStores(): Store[] {
  const list = readList<Store>(STORES_KEY);
  return list.length ? list : INITIAL_STORES;
}

export function emptyStore(): Store {
  return { id: genId(), name: "", domain: "", retailer: "", type: "GEOLOC", klass: "BRICK_AND_CLICK", device: "WEB", country: "", status: "Active", createdAt: nowStamp(), updatedAt: nowStamp() };
}

// ---------- Region system ----------

export type RegionSystem = {
  id: string;
  name: string;
  country: string;
  createdAt: string;
  updatedAt: string;
};

export const REGION_SYSTEMS_KEY = "retailers:region-systems";

export const INITIAL_REGION_SYSTEMS: RegionSystem[] = [
  { id: "rs1", name: "LT - Administrative Region", country: "LT", createdAt: "Tue, Apr 8, 2025 2:49", updatedAt: "Tue, Apr 8, 2025 2:49" },
  { id: "rs2", name: "ZA - Provinces", country: "ZA", createdAt: "Mon, Aug 12, 2024 8:00", updatedAt: "Mon, Aug 12, 2024 8:00" },
  { id: "rs3", name: "CO - Coke Bottlers", country: "CO", createdAt: "Mon, May 19, 2025 8:00", updatedAt: "Mon, May 19, 2025 8:00" },
  { id: "rs4", name: "BR - Unidades Federativas do Brasil", country: "BR", createdAt: "Thu, Jun 20, 2024 11:10", updatedAt: "Sun, Jul 21, 2024 9:30" },
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

export function getRegionSystems(): RegionSystem[] {
  const list = readList<RegionSystem>(REGION_SYSTEMS_KEY);
  return list.length ? list : INITIAL_REGION_SYSTEMS;
}

export function emptyRegionSystem(): RegionSystem {
  return { id: genId(), name: "", country: "", createdAt: nowStamp(), updatedAt: nowStamp() };
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
