// Section ORDER per dashboard target. In the real platform the order is the
// `position` field on the assignment records (datagroup-dashboardsections /
// retailer-dashboardsections); here it's modelled as an ordered list of section
// ids per target, edited from the "Section position" page and reflected in the
// order the client sees the sections in their dashboard.

export type PosTargetKind = "datagroup" | "retailer";
export type PosTarget = {
  id: string;
  kind: PosTargetKind;
  name: string;
  /** Owning client (datagroups) — shown as the secondary line. */
  client?: string;
};

// A small sample of targets to order against (Brand → datagroups, Agency →
// retailers). Alcampo ES mirrors the reference console.
export const POSITION_TARGETS: PosTarget[] = [
  { id: "ret-alcampo-es", kind: "retailer", name: "Alcampo ES" },
  { id: "ret-amazon-us", kind: "retailer", name: "Amazon US" },
  { id: "ret-carrefour-fr", kind: "retailer", name: "Carrefour FR" },
  { id: "ret-walmart-us", kind: "retailer", name: "Walmart US" },
  { id: "ret-tesco-uk", kind: "retailer", name: "Tesco UK" },
  { id: "dg-coca-brand", kind: "datagroup", name: "BRAND", client: "Coca Cola" },
  { id: "dg-coca-multicompset", kind: "datagroup", name: "Multicompset", client: "Coca Cola" },
  { id: "dg-abinbev-brand", kind: "datagroup", name: "BRAND", client: "Ab Inbev" },
  { id: "dg-diageo-brand", kind: "datagroup", name: "BRAND", client: "Diageo" },
];

export const SECTION_POSITIONS_KEY = "settings:dash-section-positions:v2";

/** Order is per dashboard application AND target — the client's dashboard for a
 *  given app shows that app's sections in this order. Keyed `appId::targetId`. */
export type PositionMap = Record<string, string[]>;

export const posKey = (appId: string, targetId: string) => `${appId}::${targetId}`;

// Alcampo ES (RMMS app) starts with the Retail Media Maestro Stretch sections in
// order, matching the reference dashboard (Category · Brand · Keyword · Item · Audit & Setup).
export const SEED_POSITIONS: PositionMap = {
  [posKey("rmms", "ret-alcampo-es")]: ["sec-rmms-cat", "sec-rmms-brand", "sec-rmms-kw", "sec-rmms-item", "sec-rmms-audit"],
  [posKey("dsm", "dg-coca-brand")]: ["sec-dsm-score", "sec-dsm-vis", "sec-dsm-audit", "sec-dsm-raw"],
};
