// Data for the "Visual massive updates — Clients × Dashboard × Datagroups" tool
// (spec TECH-14795). Lets the Product team push a dashboard SECTION into many
// clients' datagroups at once (and remove), instead of the one-by-one,
// Tech-team-scripted process (see scripts/dashboardSection.js etc.).
//
// Seeded with the real shapes/names from the prod Visualization API
// (dashboardapplications, dashboardgroups, dashboardsections, datagroups,
// datagroup-dashboardsections). The page works with no tokens; with a token
// pair it can pull the live catalog (apps + datagroups/clients) via the proxy.
// Assignment changes are SIMULATED (no real prod writes).

export type MuApp = { id: string; label: string; slug: string };
// Groups are keyed by the app SLUG (not id) so seeded groups still match when the
// apps come from the live endpoint (which has different ids but the same slugs).
export type MuGroup = { id: string; label: string; appSlug: string };
export type MuSection = { id: string; label: string; path: string; groupId: string };
export type MuClient = { id: string; name: string };
export type MuDataGroup = {
  id: string;
  name: string;
  clientId: string;
  dashboardType: "BRAND" | "AGENCY";
  country: string;
};
/** Retailers — used when sending a section to a datagroup + retailer (Agency). */
export type MuRetailer = { id: string; name: string };
export type MuCatalog = {
  apps: MuApp[];
  groups: MuGroup[];
  sections: MuSection[];
  clients: MuClient[];
  dataGroups: MuDataGroup[];
  retailers: MuRetailer[];
  /** Existing assignments as `${sectionId}::${dataGroupId}`. */
  assignments: string[];
};

export const pairKey = (sectionId: string, dataGroupId: string) => `${sectionId}::${dataGroupId}`;

// The current dashboard applications (from the live /v1.0/admin/dashboardapplications
// endpoint, ordered by position). Maestro is disabled on RMM Stretch.
const apps: MuApp[] = [
  { id: "app-dsm", label: "Digital Shelf Maestro", slug: "dsm" },
  { id: "app-asm", label: "Amazon Shelf Maestro", slug: "asm" },
  { id: "app-odm", label: "Outlet Distribution Maestro", slug: "odm" },
  { id: "app-cmi", label: "CMI", slug: "cmi" },
  { id: "app-rmm", label: "Retail Media Maestro", slug: "rmm" },
  { id: "app-rmms", label: "Retail Media Maestro Stretch", slug: "rmms" },
];

const groups: MuGroup[] = [
  { id: "g-dsm-scorecard", label: "Scorecard", appSlug: "dsm" },
  { id: "g-dsm-marketplaces", label: "Marketplaces", appSlug: "dsm" },
  { id: "g-dsm-price", label: "Price & promotions", appSlug: "dsm" },
  { id: "g-dsm-brand", label: "Brand Dashboard", appSlug: "dsm" },
  { id: "g-dsm-content", label: "Content performance", appSlug: "dsm" },
  { id: "g-dsm-audit", label: "Audit setup", appSlug: "dsm" },
  { id: "g-dsm-planning", label: "Planning workspace", appSlug: "dsm" },
  { id: "g-dsm-sov", label: "Share of voice", appSlug: "dsm" },
  { id: "g-rmm-campaigns", label: "Campaigns", appSlug: "rmm" },
  { id: "g-rmm-sov", label: "Share of voice", appSlug: "rmm" },
  { id: "g-cmi-health", label: "Content health", appSlug: "cmi" },
  { id: "g-asm-distribution", label: "Distribution", appSlug: "asm" },
  { id: "g-odm-promos", label: "Promotions", appSlug: "odm" },
  { id: "g-rmms-overview", label: "Overview", appSlug: "rmms" },
  { id: "g-rmms-keywords", label: "Keyword intelligence", appSlug: "rmms" },
];

const S = (id: string, label: string, path: string, groupId: string): MuSection => ({ id, label, path, groupId });
const sections: MuSection[] = [
  S("s-sc-1", "Scorecard", "/dse-scorecard/scorecard-1", "g-dsm-scorecard"),
  S("s-sc-2", "Scorecard (v2)", "/dse-scorecard/scorecard-2", "g-dsm-scorecard"),
  S("s-sc-old", "Scorecard (old)", "/dse-scorecard/scorecard-old", "g-dsm-scorecard"),
  S("s-sc-new", "Scorecard (new)", "/dse-scorecard/scorecard-new", "g-dsm-scorecard"),
  S("s-mp-vis", "Marketplace visibility", "/dse-marketplace/visibility", "g-dsm-marketplaces"),
  S("s-mp-bb", "Buy box", "/dse-marketplace/buybox", "g-dsm-marketplaces"),
  S("s-pr-idx", "Price index", "/dse-price/price-index", "g-dsm-price"),
  S("s-pr-promo", "Promo depth", "/dse-price/promo-depth", "g-dsm-price"),
  S("s-br-ov", "Brand overview", "/dse-brand/overview", "g-dsm-brand"),
  S("s-br-sos", "Share of search", "/dse-brand/share-of-search", "g-dsm-brand"),
  S("s-ct-health", "Content health", "/dse-content/health", "g-dsm-content"),
  S("s-ct-comp", "Content compliance", "/dse-content/compliance", "g-dsm-content"),
  S("s-au-setup", "Audit setup", "/dse-audit/setup", "g-dsm-audit"),
  S("s-pl-ws", "Planning workspace", "/dse-planning/workspace", "g-dsm-planning"),
  S("s-sov-share", "Share of voice", "/dse-sov/share-of-voice", "g-dsm-sov"),
  S("s-rmm-camp", "Campaigns", "/rmm/campaigns", "g-rmm-campaigns"),
  S("s-rmm-spend", "Ad spend", "/rmm/spend", "g-rmm-campaigns"),
  S("s-rmm-sov", "Ad share of voice", "/rmm/share-of-voice", "g-rmm-sov"),
  S("s-cmi-health", "Content index", "/cmi/health", "g-cmi-health"),
  S("s-asm-dist", "Distribution", "/asm/distribution", "g-asm-distribution"),
  S("s-odm-promo", "Promotions", "/odm/promotions", "g-odm-promos"),
  S("s-rmms-ov", "Overview", "/rmms/overview", "g-rmms-overview"),
  S("s-rmms-kw", "Keyword intelligence", "/rmms/keywords", "g-rmms-keywords"),
];

const clients: MuClient[] = [
  { id: "c-pepsico", name: "Pepsico" },
  { id: "c-affinity", name: "Affinity" },
  { id: "c-jde", name: "JDE" },
  { id: "c-bacardi", name: "Bacardi" },
  { id: "c-bayer", name: "Bayer" },
  { id: "c-perfetti", name: "Perfetti" },
  { id: "c-cocacola", name: "Coca-Cola" },
  { id: "c-unilever", name: "Unilever" },
];

const DG = (
  id: string,
  name: string,
  clientId: string,
  country: string,
  dashboardType: "BRAND" | "AGENCY" = "BRAND",
): MuDataGroup => ({ id, name, clientId, country, dashboardType });
const dataGroups: MuDataGroup[] = [
  DG("dg-pep-mx", "Pepsico MX", "c-pepsico", "Mexico"),
  DG("dg-pep-pe", "Pepsico PE", "c-pepsico", "Peru"),
  DG("dg-pep-us", "Pepsico US", "c-pepsico", "United States"),
  DG("dg-pep-co", "Pepsico CO", "c-pepsico", "Colombia"),
  DG("dg-aff-es", "Affinity ES", "c-affinity", "Spain"),
  DG("dg-jde-pl", "JDE PL", "c-jde", "Poland"),
  DG("dg-bac-es", "Bacardi ES", "c-bacardi", "Spain"),
  DG("dg-bac-us", "Bacardi US", "c-bacardi", "United States"),
  DG("dg-bay-de", "Bayer DE", "c-bayer", "Germany"),
  DG("dg-per-it", "Perfetti IT", "c-perfetti", "Italy"),
  DG("dg-per-fr", "Perfetti FR", "c-perfetti", "France"),
  DG("dg-cc-agency", "Coca-Cola Agency", "c-cocacola", "United Kingdom", "AGENCY"),
  DG("dg-uni-uk", "Unilever UK", "c-unilever", "United Kingdom"),
  DG("dg-uni-br", "Unilever BR", "c-unilever", "Brazil"),
];

const assignments: string[] = [
  pairKey("s-sc-1", "dg-pep-mx"),
  pairKey("s-sc-1", "dg-pep-us"),
  pairKey("s-sc-1", "dg-aff-es"),
  pairKey("s-sc-1", "dg-jde-pl"),
  pairKey("s-sc-2", "dg-pep-mx"),
  pairKey("s-sc-2", "dg-aff-es"),
  pairKey("s-mp-vis", "dg-pep-us"),
  pairKey("s-mp-vis", "dg-bac-us"),
  pairKey("s-pr-idx", "dg-pep-mx"),
  pairKey("s-pr-idx", "dg-pep-pe"),
  pairKey("s-br-ov", "dg-aff-es"),
  pairKey("s-br-ov", "dg-per-it"),
  pairKey("s-ct-health", "dg-uni-uk"),
];

const retailers: MuRetailer[] = [
  { id: "ret-amazon", name: "Amazon" },
  { id: "ret-walmart", name: "Walmart" },
  { id: "ret-carrefour", name: "Carrefour" },
  { id: "ret-tesco", name: "Tesco" },
  { id: "ret-kroger", name: "Kroger" },
  { id: "ret-mercadolibre", name: "Mercado Libre" },
  { id: "ret-jumbo", name: "Jumbo" },
  { id: "ret-coto", name: "Coto" },
];

export const MU_SEED: MuCatalog = { apps, groups, sections, clients, dataGroups, retailers, assignments };

// ---- live mappers (prod Visualization API → catalog) ---------------------
function pickArray(json: unknown): Record<string, unknown>[] {
  if (Array.isArray(json)) return json as Record<string, unknown>[];
  const o = (json ?? {}) as Record<string, unknown>;
  const cand = o.data ?? o.content ?? o.items ?? o.results;
  return Array.isArray(cand) ? (cand as Record<string, unknown>[]) : [];
}
const str = (v: unknown): string => (v == null ? "" : String(v));

export function mapLiveApps(json: unknown): MuApp[] {
  return pickArray(json).map((a) => ({ id: str(a.id), label: str(a.label), slug: str(a.slug) }));
}

/** Map dashboardgroups → groups (each row nests its dashboardApplication.slug). */
export function mapLiveGroups(json: unknown): MuGroup[] {
  return pickArray(json)
    .map((g) => {
      const app = (g.dashboardApplication ?? {}) as Record<string, unknown>;
      return { id: str(g.id), label: str(g.label), appSlug: str(app.slug) };
    })
    .filter((g) => g.id && g.appSlug);
}

/** Map dashboardsections → sections (each row nests its dashboardGroup.id). */
export function mapLiveSections(json: unknown): MuSection[] {
  return pickArray(json)
    .map((s) => {
      const grp = (s.dashboardGroup ?? {}) as Record<string, unknown>;
      return { id: str(s.id), label: str(s.label), path: str(s.path), groupId: str(grp.id) };
    })
    .filter((s) => s.id && s.groupId);
}

// ---- existing assignments (so the matrix shows real state + deletes can
//      resolve the record id) and the datagroup↔retailer join (agency) -------

/** A live section↔datagroup assignment (Brand: datagroup-dashboardsections). */
export type MuBrandAssignment = { id: string; dataGroupId: string; sectionId: string; position: number };
/** The datagroup×retailer join (Agency): its id is the dataGroupRetailerId. */
export type MuDgRetailer = { id: string; dataGroupId: string; retailerId: string; retailerName: string };
/** A live section↔(datagroup×retailer) assignment (Agency). */
export type MuAgencyAssignment = { id: string; dataGroupRetailerId: string; sectionId: string };

export function mapBrandAssignments(json: unknown): MuBrandAssignment[] {
  return pickArray(json)
    .map((r) => {
      const dg = (r.dataGroup ?? {}) as Record<string, unknown>;
      const sec = (r.dashboardSection ?? {}) as Record<string, unknown>;
      return { id: str(r.id), dataGroupId: str(dg.id), sectionId: str(sec.id), position: Number(r.position) || 0 };
    })
    .filter((a) => a.id && a.dataGroupId && a.sectionId);
}

export function mapDatagroupRetailers(json: unknown): MuDgRetailer[] {
  return pickArray(json)
    .map((r) => {
      const dg = (r.dataGroup ?? {}) as Record<string, unknown>;
      const ret = (r.retailer ?? {}) as Record<string, unknown>;
      return { id: str(r.id), dataGroupId: str(dg.id), retailerId: str(ret.id), retailerName: str(ret.name) };
    })
    .filter((x) => x.id && x.dataGroupId && x.retailerId);
}

export function mapAgencyAssignments(json: unknown): MuAgencyAssignment[] {
  return pickArray(json)
    .map((r) => {
      const dgr = (r.dataGroupRetailer ?? {}) as Record<string, unknown>;
      const sec = (r.dashboardSection ?? {}) as Record<string, unknown>;
      return { id: str(r.id), dataGroupRetailerId: str(dgr.id), sectionId: str(sec.id) };
    })
    .filter((a) => a.id && a.dataGroupRetailerId && a.sectionId);
}

/**
 * Agency section assignment (retailer-dashboardsections): keyed by RETAILER, not
 * datagroup. An agency datagroup's sections come from the retailers it has, so the
 * Massive update tool writes here per retailerId (matches the bulk scripts).
 */
export type MuRetailerAssignment = { id: string; retailerId: string; sectionId: string };
export function mapRetailerAssignments(json: unknown): MuRetailerAssignment[] {
  return pickArray(json)
    .map((r) => {
      const ret = (r.retailer ?? {}) as Record<string, unknown>;
      const sec = (r.dashboardSection ?? {}) as Record<string, unknown>;
      return { id: str(r.id), retailerId: str(ret.id), sectionId: str(sec.id) };
    })
    .filter((a) => a.id && a.retailerId && a.sectionId);
}

/** Map the datagroups array into clients + dataGroups (deriving the client list). */
export function mapLiveDataGroups(json: unknown): { clients: MuClient[]; dataGroups: MuDataGroup[] } {
  const rows = pickArray(json);
  const clientMap = new Map<string, MuClient>();
  const dgs: MuDataGroup[] = [];
  for (const r of rows) {
    const c = (r.client ?? {}) as Record<string, unknown>;
    const clientId = str(c.id);
    if (clientId && !clientMap.has(clientId)) clientMap.set(clientId, { id: clientId, name: str(c.name) });
    const countries = Array.isArray(r.countries) ? (r.countries as Record<string, unknown>[]) : [];
    const country = countries.length ? str(countries[0].name || countries[0].code) : "";
    dgs.push({
      id: str(r.id),
      name: str(r.name),
      clientId,
      dashboardType: str(r.dashboardType) === "AGENCY" ? "AGENCY" : "BRAND",
      country,
    });
  }
  return { clients: [...clientMap.values()].sort((a, b) => a.name.localeCompare(b.name)), dataGroups: dgs };
}
