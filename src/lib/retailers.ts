import { nowStamp } from "./clients";
import { STORE_LOCATIONS } from "./scenarioSeedData";

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

const S = (
  id: string, name: string, domain: string, retailer: string,
  type: string, klass: string, device: string, country: string,
  status: Store["status"] = "Active",
): Store => ({
  id, name, domain, retailer, type, klass, device, country, status,
  ecometryId: "", timezone: "", locale: "", logoUrl: "", meta: "{}", locations: [],
  activeLocationsCount: STORE_LOCATIONS[name] ?? 0,
  createdAt: "Mon, Jan 9, 2023 8:05 AM", updatedAt: "Mon, Dec 11, 2023 11:24 AM",
});

export const INITIAL_STORES: Store[] = [
  { id: "st1", name: "Walmart Mismo Dia MX", domain: "walmart.com.mx", retailer: "Walmart MX", type: "GEOLOC", klass: "BRICK_AND_CLICK", device: "WEB", country: "MX", status: "Active", ecometryId: "4530", timezone: "America/Mexico_City", locale: "es-MX", logoUrl: "https://media.shalion.com/console-images/stores/walmart.svg", meta: "{}", locations: [
    { id: "loc1", name: "Villahermosa I - 88060", locator: "{\"cookie\":\"...\"}", address: "Blvd. Adolfo Ruiz Cortinez 496 Col. Casa", city: "Tabasco", postal: "86060", status: "Active" },
    { id: "loc2", name: "Av Patria No 2051, Col Real Acueducto", locator: "{\"cookie\":\"...\"}", address: "Av Patria No 2051, Col Real Acueducto", city: "Jalisco", postal: "45116", status: "Active" },
    { id: "loc3", name: "Navarte - Superama - Navarte", locator: "{\"cookie\":\"...\"}", address: "Superama - Calzada de Tlalpan", city: "Ciudad de Mexico", postal: "03650", status: "Active" },
    { id: "loc4", name: "WE BOSQUES DE MINAS", locator: "{\"isExplicitInterc\":true}", address: "BOSQUES DE MINAS A XX HUIXQUILUC", city: "Estado de Mexico", postal: "52785", status: "Active" },
    { id: "loc5", name: "Cd Jardin - Walmart - Av. Bord...", locator: "{\"cookie\":\"...\"}", address: "Walmart - Av. Bordo de Xochiaca 3", city: "Estado de Mexico", postal: "50000", status: "Active" },
  ], activeLocationsCount: STORE_LOCATIONS["Walmart Mismo Dia MX"] ?? 0, createdAt: "Mon, Jan 9, 2023 8:05 AM", updatedAt: "Mon, Jan 9, 2023 8:05 AM" },
  // Sourced from the Stores export (Ecometry / Shalion Console, Jun 2026). Representative
  // subset (~1,811 total). Created/Updated were truncated in the export → plausible dates.
  S("st2", "Magazine Luiza BR - The Bar", "magazineluiza.com.br/thebar", "Magazine Luiza BR", "GEOLOC", "MARKETPLACE", "WEB", "BR"),
  S("st3", "Fnac ES", "fnac.es", "Fnac ES", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "ES"),
  S("st4", "Petsmart US", "petsmart.com", "Petsmart US", "GEOLOC", "SPECIALIST", "WEB", "US"),
  S("st5", "Rossmann HU", "rossmann.hu", "Rossmann HU", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "HU"),
  S("st6", "Nagumo BR", "nagumo.com", "Nagumo BR", "GEOLOC", "AGGREGATOR", "WEB", "BR"),
  S("st7", "Costco MX", "costco.com.mx", "Costco MX", "GEOLOC", "BRICK_AND_CLICK", "WEB", "MX"),
  S("st8", "24 Pharma BE_nl", "24pharma.be.nl", "24 Pharma BE", "FLAGSHIP", "SPECIALIST", "WEB", "BE"),
  S("st9", "GrabFood MM - FSA", "food.grab.com/mm", "GrabFood MM", "GEOLOC", "AGGREGATOR", "WEB", "MM"),
  S("st10", "Woolworths ZA", "woolworths.co.za", "Woolworths ZA", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "ZA"),
  S("st11", "Idea Bellezza IT", "ideabellezza.it", "Idea Bellezza IT", "FLAGSHIP", "SPECIALIST", "WEB", "IT"),
  S("st12", "Amazon NL_nl", "amazon.nl", "Amazon NL", "FLAGSHIP", "MARKETPLACE", "WEB", "NL"),
  S("st13", "Viking DE", "viking.de", "Viking DE", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "DE"),
  S("st14", "Make Up PL", "makeup.pl", "Make Up PL", "GEOLOC", "SPECIALIST", "WEB", "PL"),
  S("st15", "Sabina ES Mobile", "sabina.com", "Sabina ES", "FLAGSHIP", "SPECIALIST", "WEB", "ES"),
  S("st16", "El Corte Ingles Supermercado", "elcorteingles.es/supermercado", "El Corte Ingles", "GEOLOC", "BRICK_AND_CLICK", "WEB", "ES"),
  S("st17", "iFood BR - Pague Menos", "ifood.com.br/paguemenos", "iFood BR", "GEOLOC", "AGGREGATOR", "WEB", "BR"),
  S("st18", "Rimi EE", "rimi.ee", "Rimi EE", "GEOLOC", "BRICK_AND_CLICK", "WEB", "EE"),
  S("st19", "GrabFood VN - QCA", "food.grab.com/vn", "GrabFood VN", "GEOLOC", "AGGREGATOR", "WEB", "VN"),
  S("st20", "Walmart ZA", "walmart.za", "Walmart ZA", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "ZA"),
  S("st21", "Gorillas APP NL", "gorillas.nl", "Gorillas NL", "GEOLOC", "DARK_STORE", "APP", "NL"),
  S("st22", "Farmacorp BO", "farmacorp.com", "Farmacorp BO", "FLAGSHIP", "SPECIALIST", "WEB", "BO"),
  S("st23", "Perfumeria Ana ES", "perfumeriaana.com", "Perfumeria Ana ES", "FLAGSHIP", "SPECIALIST", "WEB", "ES"),
  S("st24", "Club Vet Shop FR", "clubvetshop.fr", "Club Vet Shop FR", "FLAGSHIP", "SPECIALIST", "WEB", "FR"),
  S("st25", "WhiskyBrother ZA", "whiskybrother.com", "WhiskyBrother ZA", "FLAGSHIP", "SPECIALIST", "WEB", "ZA"),
  S("st26", "Office Depot MX", "officedepot.com.mx", "Office Depot MX", "FLAGSHIP", "SPECIALIST", "WEB", "MX"),
  S("st27", "Emag APP RO", "emag.ro", "Emag RO", "FLAGSHIP", "PURE_PLAYER", "APP", "RO"),
  S("st28", "Amica Farmacia IT", "amicafarmacia.com", "Amica Farmacia IT", "FLAGSHIP", "SPECIALIST", "WEB", "IT"),
  S("st29", "Bodega Aurrera Express MX", "bodegaaurrera.com.mx", "Bodega Aurrera MX", "GEOLOC", "BRICK_AND_CLICK", "WEB", "MX"),
  S("st30", "Corner Shop BR - Big", "cornershopapp.com/bbig", "Corner Shop BR", "GEOLOC", "BRICK_AND_CLICK", "WEB", "BR", "Inactive"),
  S("st31", "Rappi APP PE - Disco", "rappi.com.pe", "Rappi PE", "GEOLOC", "BRICK_AND_CLICK", "APP", "PE"),
  S("st32", "Gohuff US", "gopuff.com", "Gohuff US", "GEOLOC", "BRICK_AND_CLICK", "WEB", "US"),
  S("st33", "Amazon IT 1P", "amazon.it", "Amazon IT", "FLAGSHIP", "MARKETPLACE", "WEB", "IT"),
  S("st34", "Shopee VN - Pernod Ricard", "shopee.vn", "Shopee VN", "GEOLOC", "DIRECT_TO_CONSUMER", "WEB", "VN"),
  S("st35", "Vassallo AR", "vassallo.com", "Vassallo AR", "FLAGSHIP", "SPECIALIST", "WEB", "AR"),
  S("st36", "Albertsons US - Market Street", "marketstreetunited.com", "Albertsons US", "GEOLOC", "BRICK_AND_CLICK", "WEB", "US"),
  S("st37", "Norman GoodFellows ZA", "ngf.co.za", "Norman GoodFellows ZA", "FLAGSHIP", "SPECIALIST", "WEB", "ZA"),
  S("st38", "Justo BR", "soyjusto.com.br", "Justo BR", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "BR"),
  S("st39", "King RO", "king.ro", "King RO", "FLAGSHIP", "PURE_PLAYER", "WEB", "RO"),
  S("st40", "Licores Medellin CO", "licoresmedellin.com", "Licores Medellin CO", "FLAGSHIP", "SPECIALIST", "WEB", "CO"),
  S("st41", "Colis CO", "cubii.com.co", "Colis CO", "FLAGSHIP", "SPECIALIST", "WEB", "CO"),
  S("st42", "iFood BR - FSA", "ifood.com.br", "iFood BR", "GEOLOC", "AGGREGATOR", "WEB", "BR"),
  S("st43", "Talabat APP EG_en", "talabat.com/eg", "Talabat EG", "GEOLOC", "AGGREGATOR", "APP", "EG"),
  S("st44", "Dia ES", "dia.es", "Dia ES", "FLAGSHIP", "BRICK_AND_CLICK", "APP", "ES"),
  S("st45", "Picnic APP DE", "picnic.de", "Picnic DE", "GEOLOC", "BRICK_AND_CLICK", "APP", "DE"),
  S("st46", "Metro UA", "metro.zakaz.ua", "Metro UA", "FLAGSHIP", "PURE_PLAYER", "WEB", "UA"),
  S("st47", "Promuto BG", "promuto.bg", "Promuto BG", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "BG"),
  S("st48", "Mirriah Paglia IT", "mirriahpaglia.com", "Mirriah Paglia IT", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "IT"),
  S("st49", "Brezit SE", "brezit.com/se", "Brezit SE", "FLAGSHIP", "SPECIALIST", "WEB", "SE"),
  S("st50", "Uber Eats BR - Pao de Acucar", "ubereats.com.br", "Uber Eats BR", "GEOLOC", "AGGREGATOR", "WEB", "BR", "Inactive"),
  S("st51", "Redemix BR", "redemix.com.br", "Redemix BR", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "BR"),
  S("st52", "Foodpanda APP SG", "foodpanda.sg", "Foodpanda SG", "GEOLOC", "AGGREGATOR", "APP", "SG"),
  S("st53", "Di Marche BR", "marche.com.br", "Di Marche BR", "GEOLOC", "BRICK_AND_CLICK", "WEB", "BR"),
  S("st54", "Extra Bom App BR", "extrabom.app.br", "Extra Bom BR", "GEOLOC", "BRICK_AND_CLICK", "APP", "BR"),
  S("st55", "Rappi MX", "rappi.com.mx", "Rappi MX", "GEOLOC", "BRICK_AND_CLICK", "WEB", "MX"),
  S("st56", "La Torre GT", "latorre.com.gt", "La Torre GT", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "GT"),
  S("st57", "Amazon DE - 3P", "amazon.de", "Amazon DE", "GEOLOC", "DIRECT_TO_CONSUMER", "WEB", "DE"),
  S("st58", "MIfarma PE", "mifarma.com.pe", "MIfarma PE", "FLAGSHIP", "SPECIALIST", "WEB", "PE"),
  S("st59", "Uber Eats CR", "ubereats.com/cr", "Uber Eats CR", "GEOLOC", "AGGREGATOR", "WEB", "CR"),
  S("st60", "Uber Eats CH - FSA", "ubereats.com/ch", "Uber Eats CH", "FLAGSHIP", "AGGREGATOR", "WEB", "CH"),
  S("st61", "Lazada MX_en", "lazada.com.mx", "Lazada MX", "FLAGSHIP", "MARKETPLACE", "WEB", "MX"),
  S("st62", "Yasoir MA - FSA", "yasoir.com", "Yasoir MA", "GEOLOC", "AGGREGATOR", "WEB", "MA"),
  S("st63", "Mercado Libre AR - Vinos", "mercadolibre.com.ar", "Mercado Libre AR", "FLAGSHIP", "MARKETPLACE", "WEB", "AR"),
  S("st64", "Rappi APP AR - Vea", "rappi.com.ar", "Rappi AR", "GEOLOC", "BRICK_AND_CLICK", "APP", "AR"),
  S("st65", "Knuspr DE", "knuspr.de", "Knuspr DE", "FLAGSHIP", "SPECIALIST", "WEB", "DE"),
  S("st66", "Shopee ID_id", "shopee.co.id", "Shopee ID", "FLAGSHIP", "MARKETPLACE", "WEB", "ID"),
  S("st67", "Wine Brands ZA", "winebrands.co.za", "Wine Brands ZA", "FLAGSHIP", "SPECIALIST", "WEB", "ZA"),
  S("st68", "Walmart NI", "walmart.com.ni", "Walmart NI", "GEOLOC", "BRICK_AND_CLICK", "WEB", "NI"),
  S("st69", "Shopee MY - Luen Heng", "shopee.com.my", "Shopee MY", "GEOLOC", "DIRECT_TO_CONSUMER", "WEB", "MY"),
  S("st70", "Migros CH", "migros.ch", "Migros CH", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "CH"),
  S("st71", "Rappi BR - DSPD", "rappi.com.br", "Rappi BR", "GEOLOC", "BRICK_AND_CLICK", "WEB", "BR"),
  S("st72", "Chedraui MX", "chedraui.com.mx", "Chedraui MX", "GEOLOC", "BRICK_AND_CLICK", "WEB", "MX"),
  S("st73", "Beauty Plaza BE_nl", "beautyplaza.be.nl", "Beauty Plaza BE", "FLAGSHIP", "SPECIALIST", "WEB", "BE"),
  S("st74", "Tata UY", "tata.com.uy", "Tata UY", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "UY"),
  S("st75", "Hunger Station APP SA_ar", "hungerstation.com/sa", "Hunger Station SA", "GEOLOC", "AGGREGATOR", "APP", "SA"),
  S("st76", "Wine Lab RU", "winelab.ru", "Wine Lab RU", "FLAGSHIP", "SPECIALIST", "WEB", "RU"),
  S("st77", "Checkers Sixty60 APP ZA", "checkers.co.za/sixty60", "Checkers Sixty60 ZA", "GEOLOC", "BRICK_AND_CLICK", "APP", "ZA"),
  S("st78", "BonPon PR", "bonponpr.com", "BonPon PR", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "PR"),
  S("st79", "Fnac PT", "fnac.pt", "Fnac PT", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "PT"),
  S("st80", "e-Leclerc FR", "e-leclerc.com", "Leclerc FR", "FLAGSHIP", "BRICK_AND_CLICK", "WEB", "FR"),
  S("st81", "Olovo RO - FSA", "gotovaapp.com/ro", "Olovo RO", "GEOLOC", "AGGREGATOR", "WEB", "RO"),
  // Amazon stores (from the Stores export filtered by "amazon"). Amazon NL_nl / IT 1P /
  // DE - 3P already exist above. Retailers (Amazon XX) auto-merge via deriveStoreRetailers.
  S("st82", "Amazon APP TR", "amazon.com.tr.app", "Amazon TR", "FLAGSHIP", "MARKETPLACE", "APP", "TR"),
  S("st83", "Amazon BR - The Bar", "amazon.com.br-thebar", "Amazon BR", "GEOLOC", "MARKETPLACE", "WEB", "BR"),
  S("st84", "Amazon EG_en", "amazon.eg", "Amazon EG", "GEOLOC", "MARKETPLACE", "WEB", "EG"),
  S("st85", "Amazon AE_en", "amazon.ae", "Amazon AE", "GEOLOC", "MARKETPLACE", "WEB", "AE"),
  S("st86", "Amazon App BR", "amazon.com.br", "Amazon BR", "GEOLOC", "MARKETPLACE", "WEB", "BR"),
  S("st87", "Amazon BR - 1P", "amazon.com.br", "Amazon BR", "GEOLOC", "MARKETPLACE", "WEB", "BR"),
  S("st88", "Amazon UK 1P", "amazon.co.uk", "Amazon UK", "GEOLOC", "MARKETPLACE", "WEB", "UK"),
  S("st89", "Amazon APP SA", "amazon.sa.app", "Amazon SA", "FLAGSHIP", "MARKETPLACE", "APP", "SA"),
  S("st90", "Amazon JP_en", "amazon.co.jp", "Amazon JP", "GEOLOC", "MARKETPLACE", "WEB", "JP"),
  S("st91", "Amazon Fresh ES", "amazon.es", "Amazon ES", "GEOLOC", "PURE_PLAYER", "WEB", "ES"),
  S("st92", "Amazon US 1P", "amazon.com", "Amazon US", "GEOLOC", "MARKETPLACE", "WEB", "US"),
  S("st93", "Amazon TR", "amazon.com.tr", "Amazon TR", "FLAGSHIP", "MARKETPLACE", "WEB", "TR"),
  S("st94", "Amazon BE_en", "amazon.com.be", "Amazon BE", "FLAGSHIP", "MARKETPLACE", "WEB", "BE"),
  S("st95", "Amazon BE_fr", "amazon.com.be", "Amazon BE", "FLAGSHIP", "MARKETPLACE", "WEB", "BE"),
  S("st96", "Amazon APP ES", "amazon.es.app", "Amazon ES", "GEOLOC", "MARKETPLACE", "APP", "ES"),
  S("st97", "Amazon Fresh DE", "amznfresh.de", "Amazon DE", "GEOLOC", "PURE_PLAYER", "WEB", "DE"),
  S("st98", "Amazon IE", "amazon.ie", "Amazon IE", "GEOLOC", "MARKETPLACE", "WEB", "IE"),
  S("st99", "Amazon DE", "amazon.de", "Amazon DE", "GEOLOC", "MARKETPLACE", "WEB", "DE"),
  S("st100", "Amazon CA", "amazon.ca", "Amazon CA", "GEOLOC", "MARKETPLACE", "WEB", "CA"),
  S("st101", "Amazon App MX", "amazon.app.mx", "Amazon MX", "GEOLOC", "MARKETPLACE", "APP", "MX"),
  S("st102", "Amazon SA_ar", "amazon.sa", "Amazon SA", "GEOLOC", "MARKETPLACE", "WEB", "SA"),
  S("st103", "Amazon FR 1P", "amazon.fr", "Amazon FR", "GEOLOC", "MARKETPLACE", "WEB", "FR"),
  S("st104", "Amazon BR", "amazon.com.br", "Amazon BR", "GEOLOC", "MARKETPLACE", "WEB", "BR"),
  S("st105", "Amazon MX", "amazon.com.mx", "Amazon MX", "GEOLOC", "MARKETPLACE", "WEB", "MX"),
  S("st106", "Amazon APP DE", "amazon.de.app", "Amazon DE", "GEOLOC", "MARKETPLACE", "APP", "DE"),
  S("st107", "Amazon ES", "amazon.es", "Amazon ES", "GEOLOC", "MARKETPLACE", "WEB", "ES"),
  S("st108", "Amazon PL", "amazon.pl", "Amazon PL", "GEOLOC", "MARKETPLACE", "WEB", "PL"),
  S("st109", "Amazon Fresh US", "amazon.com", "Amazon US", "GEOLOC", "PURE_PLAYER", "WEB", "US"),
  S("st110", "Amazon APP PL", "amazon.pl.app", "Amazon PL", "FLAGSHIP", "MARKETPLACE", "APP", "PL"),
  S("st111", "Amazon IN_en", "amazon.in", "Amazon IN", "GEOLOC", "MARKETPLACE", "WEB", "IN"),
  S("st112", "Amazon CA - 1P", "amazon.ca", "Amazon CA", "GEOLOC", "MARKETPLACE", "WEB", "CA"),
  S("st113", "Amazon BR - seller oficial", "amazon.com.br_seller", "Amazon BR", "GEOLOC", "MARKETPLACE", "WEB", "BR"),
  S("st114", "Amazon Fresh UK", "amazon.co.uk", "Amazon UK", "GEOLOC", "PURE_PLAYER", "WEB", "UK"),
  S("st115", "Amazon APP AE", "amazon.ae.app", "Amazon AE", "FLAGSHIP", "MARKETPLACE", "APP", "AE"),
  S("st116", "Amazon FR", "amazon.fr", "Amazon FR", "GEOLOC", "MARKETPLACE", "WEB", "FR"),
  S("st117", "Amazon US", "amazon.com", "Amazon US", "GEOLOC", "MARKETPLACE", "WEB", "US"),
  S("st118", "Amazon BR - Engage", "amazon.com.br_engage", "Amazon BR", "GEOLOC", "MARKETPLACE", "WEB", "BR"),
  S("st119", "Amazon IT - Vital Protein", "amazon.it", "Amazon IT", "GEOLOC", "MARKETPLACE", "WEB", "IT"),
  S("st120", "Amazon SG", "amazon.sg", "Amazon SG", "GEOLOC", "MARKETPLACE", "WEB", "SG"),
  S("st121", "Amazon BE_nl", "amazon.com.be", "Amazon BE", "FLAGSHIP", "MARKETPLACE", "WEB", "BE"),
  S("st122", "Amazon SE", "amazon.se", "Amazon SE", "GEOLOC", "MARKETPLACE", "WEB", "SE"),
  S("st123", "Amazon AU", "amazon.com.au", "Amazon AU", "GEOLOC", "MARKETPLACE", "WEB", "AU"),
  S("st124", "Amazon ES 1P", "amazon.es", "Amazon ES", "GEOLOC", "MARKETPLACE", "WEB", "ES"),
  S("st125", "Amazon MX - 1P", "amazon.com.mx", "Amazon MX", "GEOLOC", "MARKETPLACE", "WEB", "MX"),
  S("st126", "Amazon IT", "amazon.it", "Amazon IT", "GEOLOC", "MARKETPLACE", "WEB", "IT"),
  S("st127", "Amazon BR - eFacil", "amazon.com.br.efacil", "Amazon BR", "GEOLOC", "MARKETPLACE", "WEB", "BR"),
  S("st128", "Amazon BR - Wine com", "amazon.com.br.wineco", "Amazon BR", "GEOLOC", "MARKETPLACE", "WEB", "BR"),
  S("st129", "Amazon UK", "amazon.co.uk", "Amazon UK", "GEOLOC", "MARKETPLACE", "WEB", "UK"),
  S("st130", "Amazon NL_en", "amazon.nl", "Amazon NL", "FLAGSHIP", "MARKETPLACE", "WEB", "NL"),
  S("st131", "Amazon SA_en", "amazon.sa", "Amazon SA", "GEOLOC", "MARKETPLACE", "WEB", "SA"),
  S("st132", "Amazon UK - Vital Protein", "amazon.co.uk", "Amazon UK", "GEOLOC", "MARKETPLACE", "WEB", "UK"),
  S("st133", "Amazon JP_jp", "amazon.co.jp", "Amazon JP", "GEOLOC", "MARKETPLACE", "WEB", "JP"),
];

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
  /** Location sets — same shape as a region; the dataset behind the "Location set" option. */
  locationSets?: Region[];
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

export function emptyLocationSet(): Region {
  return { id: genId(), name: "New location set", locations: [] };
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
  return { id: genId(), name: "", country: "", regions: [], locationSets: [], createdAt: nowStamp(), updatedAt: nowStamp() };
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
