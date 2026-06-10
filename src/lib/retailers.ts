import { nowStamp } from "./clients";

// ---------- shared options ----------

export const STORE_TYPE_OPTIONS = ["GEOLOC", "FLAGSHIP"];
export const STORE_CLASS_OPTIONS = ["BRICK_AND_CLICK", "MARKETPLACE", "SPECIALIST", "AGGREGATOR"];
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

export const INITIAL_RETAILERS: Retailer[] = [
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
  return list.length ? list : INITIAL_RETAILERS;
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
  createdAt: string;
  updatedAt: string;
};

export const STORES_KEY = "retailers:stores";

export const INITIAL_STORES: Store[] = [
  { id: "st1", name: "Walmart Mismo Dia MX", domain: "walmart.com.mx", retailer: "Walmart MX", type: "GEOLOC", klass: "BRICK_AND_CLICK", device: "WEB", country: "MX", status: "Active", ecometryId: "4530", timezone: "America/Mexico_City", locale: "es-MX", logoUrl: "https://media.shalion.com/console-images/stores/walmart.svg", meta: "{}", locations: [
    { id: "loc1", name: "Villahermosa I - 88060", locator: "{\"cookie\":\"...\"}", address: "Blvd. Adolfo Ruiz Cortinez 496 Col. Casa", city: "Tabasco", postal: "86060", status: "Active" },
    { id: "loc2", name: "Av Patria No 2051, Col Real Acueducto", locator: "{\"cookie\":\"...\"}", address: "Av Patria No 2051, Col Real Acueducto", city: "Jalisco", postal: "45116", status: "Active" },
    { id: "loc3", name: "Navarte - Superama - Navarte", locator: "{\"cookie\":\"...\"}", address: "Superama - Calzada de Tlalpan", city: "Ciudad de Mexico", postal: "03650", status: "Active" },
    { id: "loc4", name: "WE BOSQUES DE MINAS", locator: "{\"isExplicitInterc\":true}", address: "BOSQUES DE MINAS A XX HUIXQUILUC", city: "Estado de Mexico", postal: "52785", status: "Active" },
    { id: "loc5", name: "Cd Jardin - Walmart - Av. Bord...", locator: "{\"cookie\":\"...\"}", address: "Walmart - Av. Bordo de Xochiaca 3", city: "Estado de Mexico", postal: "50000", status: "Active" },
  ], createdAt: "Mon, Jan 9, 2023 8:00", updatedAt: "Mon, Jan 9, 2023 8:00" },
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
  return { id: genId(), name: "", domain: "", retailer: "", type: "GEOLOC", klass: "BRICK_AND_CLICK", device: "WEB", country: "", status: "Active", ecometryId: "", timezone: "", locale: "", logoUrl: "", meta: "{}", locations: [], createdAt: nowStamp(), updatedAt: nowStamp() };
}

// ---------- Region system ----------

export type RegionLocation = {
  id: string;
  name: string;
  city: string;
  address: string;
  postal: string;
  store: string;
};

export type Region = {
  id: string;
  name: string;
  locations: RegionLocation[];
};

export type RegionSystem = {
  id: string;
  name: string;
  country: string;
  regions?: Region[];
  createdAt: string;
  updatedAt: string;
};

const BR_STATE_NAMES = [
  "Paraíba", "Rondônia", "Alagoas", "Mato Grosso", "Minas Gerais", "Mato Grosso do Sul",
  "Rio Grande do Sul", "Rio de Janeiro", "São Paulo", "Bahia", "Ceará", "Pará", "Paraná",
  "Pernambuco", "Santa Catarina", "Goiás", "Maranhão", "Espírito Santo", "Amazonas",
  "Rio Grande do Norte", "Piauí", "Distrito Federal", "Sergipe", "Tocantins", "Acre",
];

const BR_STATES: Region[] = BR_STATE_NAMES.map((name, i) => ({
  id: `br-${i}`,
  name,
  locations: i === 0
    ? [
        { id: "rl1", name: "Pao de Acucar BR", city: "João Pessoa - Paraíba", address: "Av. Governador Flávio Ribeiro Coutinho", postal: "58037-000", store: "Pao de Acucar BR" },
        { id: "rl2", name: "João Pessoa - Carrefour BR", city: "João Pessoa - Paraíba", address: "Carrefour BR - R Brasília", postal: "58036-460", store: "Carrefour BR" },
      ]
    : [],
}));

export function emptyRegion(): Region {
  return { id: genId(), name: "New region", locations: [] };
}

// Pool of locations that can be assigned to a region (mock).
export const ASSIGNABLE_LOCATIONS = [
  "2041619 Mobile County Health Department Newburn Clinic",
  "208418 Dukuhan",
  "1085495 White Pond",
  "871713 Ashburnham State Forest",
  "133270 Kebonpala",
  "130565 Cemitério São Sebastião",
  "50577 Walker Spring",
  "Hytop",
  "Rinvyle House",
  "1003727 Township of Vesta",
  "994210 Praça da Sé",
  "77120 Riverside Market",
];

export const REGION_SYSTEMS_KEY = "retailers:region-systems";

export const INITIAL_REGION_SYSTEMS: RegionSystem[] = [
  { id: "rs1", name: "LT - Administrative Region", country: "LT", createdAt: "Tue, Apr 8, 2025 2:49", updatedAt: "Tue, Apr 8, 2025 2:49" },
  { id: "rs2", name: "ZA - Provinces", country: "ZA", createdAt: "Mon, Aug 12, 2024 8:00", updatedAt: "Mon, Aug 12, 2024 8:00" },
  { id: "rs3", name: "CO - Coke Bottlers", country: "CO", createdAt: "Mon, May 19, 2025 8:00", updatedAt: "Mon, May 19, 2025 8:00" },
  { id: "rs4", name: "BR - Unidades Federativas do Brasil", country: "BR", regions: BR_STATES, createdAt: "Thu, Jun 20, 2024 11:10", updatedAt: "Sun, Jul 21, 2024 9:30" },
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
  return { id: genId(), name: "", country: "", regions: [], createdAt: nowStamp(), updatedAt: nowStamp() };
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
