// Retailer LABELS — a user-defined classification of retailers by the kind of
// dashboard sections they receive (STANDARD, AMAZON, LANGUAGE, GEOLOC, GEOSTORE…).
// Called "label" (not "group") to avoid clashing with dashboard GROUPS (the
// app→group→section hierarchy). Used in the Massive update Agency tab to filter
// the retailer list so a whole label can be selected at once for insert/remove.
// Not an API concept — persisted in localStorage, managed via the labels modal.

// Full literal class strings so Tailwind keeps them (no dynamic class names).
export const LABEL_COLOR_CLASSES = {
  amber: "border-amber-200 bg-amber-100 text-amber-800",
  green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  rose: "border-rose-200 bg-rose-100 text-rose-800",
  orange: "border-orange-200 bg-orange-100 text-orange-800",
  violet: "border-violet-200 bg-violet-100 text-violet-800",
  blue: "border-blue-200 bg-blue-100 text-blue-800",
  slate: "border-slate-200 bg-slate-100 text-slate-700",
  pink: "border-pink-200 bg-pink-100 text-pink-800",
  teal: "border-teal-200 bg-teal-100 text-teal-800",
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-500",
} as const;
export type LabelColor = keyof typeof LABEL_COLOR_CLASSES;
export const LABEL_COLOR_KEYS = Object.keys(LABEL_COLOR_CLASSES) as LabelColor[];

/** A label holds the retailer NAMES that belong to it (names are stable across
 * environments; live retailer ids differ between prod/dev). */
export type RetailerLabel = { id: string; name: string; color: LabelColor; retailers: string[] };

// The default catch-all: any retailer NOT explicitly in another label is
// "NON-CLASSIFIED" (e.g. retailers not present in groups_of_retailers.xlsx).
// STANDARD is now a normal label with its own explicit members from the sheet.
export const DEFAULT_LABEL_ID = "lbl-non-classified";

// Full classification from groups_of_retailers.xlsx (84 classified retailers).
// Everything else falls into NON-CLASSIFIED (the default).
export const SEED_RETAILER_LABELS: RetailerLabel[] = [
  { id: DEFAULT_LABEL_ID, name: "NON-CLASSIFIED", color: "zinc", retailers: [] },
  {
    id: "lbl-standard",
    name: "STANDARD",
    color: "amber",
    retailers: [
      "Alcampo ES", "Asda UK", "Auchan FR", "Best Buy US", "Bol NL", "Boots UK", "Carrefour ES",
      "Carrefour FR", "Carrefour IT", "Chewy US", "Coop IT", "Costco US", "CVS US", "Dia ES",
      "Dollar General US", "Douglas DE", "Douglas ES", "Druni ES", "eBay US", "El Corte Ingles ES",
      "Eroski ES", "Flipkart IN", "Giant Eagle US", "Glovo ES", "GoPuff US", "HEB US", "Home Depot US",
      "Intermarche FR", "Kaufland DE", "Leclerc FR", "Media Markt DE", "Media Markt ES", "Media World IT",
      "Meijer US", "Morrisons UK", "Noon AE", "Noon Minutes AE", "Ocado UK", "Otto DE", "Petco US",
      "Petsmart US", "Primor ES", "Rewe DE", "Sainsburys UK", "Tesco UK", "Tigros IT", "Ulta US",
      "Walgreens US", "Walmart CA", "Wayfair US", "Zooplus DE", "Zooplus UK", "Priceline AU",
      "Chemist Warehouse AU",
    ],
  },
  {
    id: "lbl-amazon",
    name: "AMAZON",
    color: "green",
    retailers: [
      "Amazon AE", "Amazon DE", "Amazon ES", "Amazon FR", "Amazon IN", "Amazon IT",
      "Amazon JP", "Amazon NL", "Amazon SE", "Amazon TR", "Amazon UK", "Amazon US", "Amazon AU",
    ],
  },
  { id: "lbl-amazon-flagship", name: "AMAZON - FLAGSHIP", color: "teal", retailers: [] },
  { id: "lbl-amazon-flagship-language", name: "AMAZON - FLAGSHIP - LANGUAGE", color: "rose", retailers: ["Amazon BE"] },
  { id: "lbl-amazon-language", name: "AMAZON - LANGUAGE", color: "orange", retailers: ["Amazon SA"] },
  {
    id: "lbl-language",
    name: "LANGUAGE",
    color: "violet",
    retailers: [
      "Lazada ID", "Lazada MY", "Lazada TH", "Lazada VN", "Noon Minutes SA", "Noon SA",
      "Shopee ID", "Shopee MY", "Shopee TH", "Shopee VN", "Tokopedia ID",
    ],
  },
  { id: "lbl-geostore-app", name: "GEOSTORE APP", color: "slate", retailers: ["Instacart US"] },
  { id: "lbl-geostore-web", name: "GEOSTORE WEB", color: "blue", retailers: ["Kroger US"] },
  { id: "lbl-geoloc", name: "GEOLOC", color: "pink", retailers: ["Target US", "Walmart US"] },
];

/** The label a retailer (by name) belongs to — its explicit label, else NON-CLASSIFIED. */
export function labelForRetailer(labels: RetailerLabel[], retailerName: string): RetailerLabel {
  const explicit = labels.find((l) => l.id !== DEFAULT_LABEL_ID && l.retailers.includes(retailerName));
  const fallback = labels.find((l) => l.id === DEFAULT_LABEL_ID);
  return explicit ?? fallback ?? labels[0];
}

/** Assign a retailer (by name) to a label — single membership (removed from others).
 * Assigning to the default (NON-CLASSIFIED) just clears it from every other label. */
export function assignRetailerToLabel(labels: RetailerLabel[], retailerName: string, labelId: string): RetailerLabel[] {
  return labels.map((l) => {
    const without = l.retailers.filter((r) => r !== retailerName);
    if (l.id === labelId && l.id !== DEFAULT_LABEL_ID) return { ...l, retailers: [...without, retailerName] };
    return { ...l, retailers: without };
  });
}

/** Assign MANY retailers (by name) to a label at once (single membership).
 * labelId === default just clears them from every other label. */
export function assignManyToLabel(labels: RetailerLabel[], retailerNames: string[], labelId: string): RetailerLabel[] {
  const set = new Set(retailerNames);
  return labels.map((l) => {
    const without = l.retailers.filter((r) => !set.has(r));
    if (l.id === labelId && l.id !== DEFAULT_LABEL_ID) return { ...l, retailers: [...without, ...retailerNames] };
    return { ...l, retailers: without };
  });
}

/** Remove MANY retailers (by name) from a specific label (→ NON-CLASSIFIED). */
export function clearManyFromLabel(labels: RetailerLabel[], retailerNames: string[], labelId: string): RetailerLabel[] {
  const set = new Set(retailerNames);
  return labels.map((l) => (l.id === labelId ? { ...l, retailers: l.retailers.filter((r) => !set.has(r)) } : l));
}

export function makeLabelId(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `lbl-${slug || "label"}`;
}
