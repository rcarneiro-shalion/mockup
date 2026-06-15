// Retailer groups — a user-defined classification of retailers by the kind of
// dashboard sections they receive (STANDARD, AMAZON, LANGUAGE, GEOSTORE…). Used
// in the Massive update Agency tab to filter the retailer list so a whole group
// can be selected at once for insert/remove. Not an API concept — persisted in
// localStorage and managed via the Retailer groups modal.

// Full literal class strings so Tailwind keeps them (no dynamic class names).
export const GROUP_COLOR_CLASSES = {
  amber: "border-amber-200 bg-amber-100 text-amber-800",
  green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  rose: "border-rose-200 bg-rose-100 text-rose-800",
  orange: "border-orange-200 bg-orange-100 text-orange-800",
  violet: "border-violet-200 bg-violet-100 text-violet-800",
  blue: "border-blue-200 bg-blue-100 text-blue-800",
  slate: "border-slate-200 bg-slate-100 text-slate-700",
  pink: "border-pink-200 bg-pink-100 text-pink-800",
  teal: "border-teal-200 bg-teal-100 text-teal-800",
} as const;
export type GroupColor = keyof typeof GROUP_COLOR_CLASSES;
export const GROUP_COLOR_KEYS = Object.keys(GROUP_COLOR_CLASSES) as GroupColor[];

/** A group holds the retailer NAMES that belong to it (names are stable across
 * environments; live retailer ids differ between prod/dev). */
export type RetailerGroup = { id: string; name: string; color: GroupColor; retailers: string[] };

export const STANDARD_GROUP_ID = "grp-standard";

// Seeded from the user's retailer↔group sheet. STANDARD is the catch-all default
// (its `retailers` list is ignored — any retailer not in another group is STANDARD).
export const SEED_RETAILER_GROUPS: RetailerGroup[] = [
  { id: STANDARD_GROUP_ID, name: "STANDARD", color: "amber", retailers: [] },
  {
    id: "grp-amazon",
    name: "AMAZON",
    color: "green",
    retailers: [
      "Amazon AE", "Amazon DE", "Amazon ES", "Amazon FR", "Amazon IN", "Amazon IT",
      "Amazon JP", "Amazon NL", "Amazon SE", "Amazon TR", "Amazon UK", "Amazon US",
    ],
  },
  { id: "grp-amazon-flagship-language", name: "AMAZON - FLAGSHIP - LANGUAGE", color: "rose", retailers: ["Amazon BE"] },
  { id: "grp-amazon-language", name: "AMAZON - LANGUAGE", color: "orange", retailers: ["Amazon SA"] },
  { id: "grp-language", name: "LANGUAGE", color: "violet", retailers: ["Lazada ID", "Lazada MY", "Lazada TH", "Lazada VN"] },
  { id: "grp-geostore-app", name: "GEOSTORE APP", color: "slate", retailers: ["Instacart US"] },
  { id: "grp-geostore-web", name: "GEOSTORE WEB", color: "blue", retailers: ["Kroger US"] },
];

/** The group a retailer (by name) belongs to — its explicit group, else STANDARD. */
export function groupForRetailer(groups: RetailerGroup[], retailerName: string): RetailerGroup {
  const explicit = groups.find((g) => g.id !== STANDARD_GROUP_ID && g.retailers.includes(retailerName));
  const standard = groups.find((g) => g.id === STANDARD_GROUP_ID);
  return explicit ?? standard ?? groups[0];
}

/** Assign a retailer (by name) to a group — single membership (removed from others).
 * Assigning to STANDARD just clears it from every non-standard group. */
export function assignRetailerToGroup(groups: RetailerGroup[], retailerName: string, groupId: string): RetailerGroup[] {
  return groups.map((g) => {
    const without = g.retailers.filter((r) => r !== retailerName);
    if (g.id === groupId && g.id !== STANDARD_GROUP_ID) return { ...g, retailers: [...without, retailerName] };
    return { ...g, retailers: without };
  });
}

export function makeGroupId(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `grp-${slug || "group"}`;
}
