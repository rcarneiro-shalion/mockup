import type { Brand } from "./brands";

// ---------------------------------------------------------------------------
// Sample data for the richer Brand detail sections (Brand classification,
// Category selection, Edition selection regexes, Manufacturer selection).
// These mirror the real console-frontend brand editor, which is regex-driven.
// The mockup treats them as illustrative prototype data (managed in local
// component state), so they don't change the persisted Brand shape.
// ---------------------------------------------------------------------------

export type RegexEntry = { id: string; expr: string; isNegative: boolean };
export type CategorySel = { id: string; name: string; regexps: RegexEntry[] };
export type ManufacturerRow = { id: string; country: string; flag: string; manufacturer: string };

export type BrandSections = {
  classification: RegexEntry[];
  categories: CategorySel[];
  manufacturers: ManufacturerRow[];
  /** Edition regexes keyed by edition name. */
  editionRegexps: Record<string, RegexEntry[]>;
};

export const uid = (): string =>
  (typeof crypto !== "undefined" && crypto.randomUUID?.()) || Math.random().toString(36).slice(2);

const inc = (expr: string): RegexEntry => ({ id: uid(), expr, isNegative: false });
const neg = (expr: string): RegexEntry => ({ id: uid(), expr, isNegative: true });

// --- Coca-Cola: the fully-worked example (matches the real console content) ---
const COCA: BrandSections = {
  classification: [
    inc("(?i)coca[\\s\\-]?cola"),
    inc("(?i)coca-cola"),
    inc("(?i)cocacola"),
    inc("(?i)\\bcoke\\b"),
    inc("(?i)coca cola zero"),
    inc("(?i)coke zero( sugar)?"),
    inc("(?i)diet coke"),
    inc("(?i)coca[\\s\\-]?cola light"),
    inc("(?i)coca[\\s\\-]?cola sin azúcar"),
    inc("(?i)coca[\\s\\-]?cola (original|classic|sabor original)"),
    neg("(?i)cocaine"),
    neg("(?i)coca[\\s\\-]?cola (t-?shirt|merch|vintage|collectible)"),
    neg("(?i)(pepsi|rc\\s?cola|inca\\s?kola)"),
  ],
  categories: [
    {
      id: uid(),
      name: "Carbonated Soft Drinks",
      regexps: [inc("coca.?cola"), inc("fanta"), inc("sprite"), neg("pack|caja|24\\s?u")],
    },
    {
      id: uid(),
      name: "Colas",
      regexps: [inc("coca.?cola"), inc("coca.?cola\\s+(zero|light|sin azúcar)"), neg("pepsi|big\\s?cola")],
    },
    {
      id: uid(),
      name: "Sports & Energy Drinks",
      regexps: [inc("powerade"), inc("aquarius"), inc("monster")],
    },
    {
      id: uid(),
      name: "Water",
      regexps: [inc("dasani"), inc("smart\\s?water"), inc("\\bciel\\b"), inc("topo\\s?chico")],
    },
    {
      id: uid(),
      name: "Juices & Nectars",
      regexps: [inc("del\\s?valle"), inc("minute\\s?maid"), inc("jugo|zumo|néctar")],
    },
  ],
  manufacturers: [
    { id: uid(), country: "US", flag: "🇺🇸", manufacturer: "The Coca-Cola Company" },
    { id: uid(), country: "MX", flag: "🇲🇽", manufacturer: "Coca-Cola FEMSA" },
    { id: uid(), country: "ES", flag: "🇪🇸", manufacturer: "Coca-Cola Europacific Partners" },
    { id: uid(), country: "BR", flag: "🇧🇷", manufacturer: "Coca-Cola FEMSA Brasil" },
    { id: uid(), country: "CL", flag: "🇨🇱", manufacturer: "Embotelladora Andina" },
  ],
  editionRegexps: {
    "Coca-Cola Original": [inc("(?i)coca[- ]?cola"), inc("(?i)\\bcoke\\b"), neg("(?i)zero|sin azucar|light")],
    "Coca-Cola Zero": [inc("(?i)coca[- ]?cola\\s*zero"), inc("(?i)coke\\s*zero"), neg("(?i)cherry|vanilla")],
    "Coca-Cola Cherry": [inc("(?i)coca[- ]?cola\\s*cherry"), inc("(?i)coke\\s*cherry"), inc("(?i)cereza")],
  },
};

// --- Essence: a second multi-brand worked example ---
const ESSENCE: BrandSections = {
  classification: [
    inc("(?i)essence"),
    inc("(?i)essence cosmetics"),
    inc("(?i)ess\\.?\\s?cosmetics"),
    neg("(?i)(essie|the essence of)"),
  ],
  categories: [
    { id: uid(), name: "Face Makeup", regexps: [inc("essence.*(foundation|primer|concealer)")] },
    { id: uid(), name: "Lip Makeup", regexps: [inc("essence.*(lipstick|lip gloss|labial)")] },
  ],
  manufacturers: [
    { id: uid(), country: "DE", flag: "🇩🇪", manufacturer: "Cosnova" },
    { id: uid(), country: "ES", flag: "🇪🇸", manufacturer: "Cosnova Iberia" },
  ],
  editionRegexps: {
    "Essence Spring Collection": [inc("(?i)essence.*spring"), inc("(?i)essence.*(bloom|garden)")],
    "Essence Holiday Edition": [inc("(?i)essence.*(holiday|christmas|navidad)")],
  },
};

const RICH: Record<string, BrandSections> = {
  "br-coca": COCA,
  "br-essence": ESSENCE,
};

/** A light, derived fallback so every other brand still shows populated sections. */
function derived(brand: Brand): BrandSections {
  const nm = brand.name.trim();
  const slug = nm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape for a plausible regex
  const leaf = (brand.defaultCategory || "Category").split(">").pop()!.trim();
  const editionRegexps: Record<string, RegexEntry[]> = {};
  for (const e of brand.editions ?? []) {
    editionRegexps[e.name] = [inc(`(?i)${e.name.toLowerCase().replace(/\s+/g, "\\s*")}`)];
  }
  return {
    classification: [
      inc(`(?i)${slug.toLowerCase()}`),
      inc(`(?i)${slug.toLowerCase().replace(/\s+/g, "")}`),
    ],
    categories: [{ id: uid(), name: leaf, regexps: [inc(`(?i)${slug.toLowerCase()}`)] }],
    manufacturers: [{ id: uid(), country: "US", flag: "🇺🇸", manufacturer: brand.defaultManufacturer || "—" }],
    editionRegexps,
  };
}

/** Deep-ish clone so each mount gets its own editable copy (fresh ids). */
export function getBrandSections(brand: Brand): BrandSections {
  const src = RICH[brand.id] ?? derived(brand);
  return {
    classification: src.classification.map((r) => ({ ...r, id: uid() })),
    categories: src.categories.map((c) => ({ ...c, id: uid(), regexps: c.regexps.map((r) => ({ ...r, id: uid() })) })),
    manufacturers: src.manufacturers.map((m) => ({ ...m, id: uid() })),
    editionRegexps: Object.fromEntries(
      Object.entries(src.editionRegexps).map(([k, v]) => [k, v.map((r) => ({ ...r, id: uid() }))]),
    ),
  };
}
