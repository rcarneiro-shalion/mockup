import { nowStamp } from "./clients";
import { readPersistedList } from "./seedOptions";
import { BULK_PROJECTS } from "./projectsBulk";

// project-scrapingPlan relationship: a scrapingPlan assigned to a project.
export type AssignedScrapingPlan = {
  id: string;
  name: string;
  store: string;
  geo: string;
  type: string; // a ScrapingPlan type from Settings › ScrapingPlan type (e.g. Select Assortment, Matching)
  expiration: string;
};

export type Project = {
  id: string;
  name: string;
  bom: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  assignedScrapingPlans?: AssignedScrapingPlan[];
};

export const PROJECTS_KEY = "seeds-api:projects";

// A scrapingPlan's "type" is derived from its NAME prefix (the part before the first
// "_") — it maps to a ScrapingPlan type in Settings › ScrapingPlan type. Used to
// "replay" the Type when a scrapingPlan is assigned to a project (and by the scenario
// simulator). Unknown prefixes resolve to "" (no type). Values MUST match the catalog
// names in src/lib/settings.ts (INITIAL_SCRAPING_PLAN_TYPES).
const TYPE_BY_PREFIX: Record<string, string> = {
  SA: "Select Assortment (SA)",
  MAG: "Matching (MAG)",
  GEO: "GEO",
  SE: "Search (SE)",
  ME: "Media (ME)",
  PLP: "Product Listing Page (PLP)",
  PDP: "Product Detail Page (PDP)",
  AD: "Advertising (AD)",
  SH: "Shelf (SH)",
};

/** Resolve a scrapingPlan/job NAME to its ScrapingPlan type via the leading prefix. */
export function typeFromName(name: string): string {
  const prefix = (name.split("_")[0] || "").trim().toUpperCase();
  return TYPE_BY_PREFIX[prefix] ?? "";
}

const EC = "ecometry@shalion.com";

// Coca Cola projects (client↔project relationship — mirrored in clients.ts COCA_PROJECTS).
const CC = (id: string, name: string, bom: string, from: string, status: Project["status"] = "Active"): Project => ({
  id, name, bom, status, createdAt: `${from} 08:00`, updatedAt: "Tue, Jun 2, 2026 7:14", createdBy: EC, updatedBy: EC,
});

// Seeded from the production mockup.
const CURATED_PROJECTS: Project[] = [
  { id: "p1", name: "PHA > HEA_Tokopedia ID_en", bom: "GRPM_02", status: "Active", createdAt: "Mon, Sep 23, 2024 10:14", updatedAt: "Mon, Oct 27, 2025 2:00", createdBy: EC, updatedBy: EC },
  { id: "p2", name: "Diageo MK", bom: "SHL0024", status: "Inactive", createdAt: "Thu, Dec 14, 2023 2:13", updatedAt: "Mon, Oct 27, 2025 9:42", createdBy: EC, updatedBy: "sulloa@shalion.com" },
  { id: "p3", name: "BEV>SDR_Instacart US - CVS", bom: "GRPM_02", status: "Active", createdAt: "Fri, May 3, 2024 8:27", updatedAt: "Mon, Oct 27, 2025 1:30", createdBy: EC, updatedBy: EC },
  { id: "p4", name: "PAN>REA_Walmart CA", bom: "SHL0104", status: "Active", createdAt: "Tue, Feb 3, 2026 2:45", updatedAt: "Thu, Feb 12, 2026 12:00", createdBy: "aquesada@shalion.com", updatedBy: "sulloa@shalion.com" },
  { id: "p5", name: "BEA>SHA_Amazon US", bom: "GRPM_02", status: "Active", createdAt: "Thu, May 2, 2024 3:21", updatedAt: "Mon, Oct 27, 2025 1:30", createdBy: EC, updatedBy: EC },
  { id: "p6", name: "PAN>TEA_Carrefour FR", bom: "GRPM_02", status: "Active", createdAt: "Fri, Jun 28, 2024 1:47", updatedAt: "Mon, Oct 27, 2025 1:50", createdBy: EC, updatedBy: EC },
  { id: "p7", name: "PAN>CON_Alcampo ES", bom: "GRPM_02", status: "Active", createdAt: "Tue, Jun 25, 2024 1:40", updatedAt: "Mon, Oct 27, 2025 1:50", createdBy: EC, updatedBy: EC },
  { id: "p8", name: "CLE>AIR_Lazada VN_vn", bom: "GRPM_02", status: "Active", createdAt: "Tue, Oct 1, 2024 1:20", updatedAt: "Mon, Oct 27, 2025 1:30", createdBy: "anavas@shalion.com", updatedBy: EC },
  { id: "p9", name: "PAN>SNA_Instacart US - Target", bom: "GRPM_02", status: "Active", createdAt: "Fri, May 3, 2024 8:26", updatedAt: "Mon, Oct 27, 2025 1:50", createdBy: EC, updatedBy: EC },
  { id: "p10", name: "ELE>WEA_Lazada VN_en", bom: "GRPM_02", status: "Active", createdAt: "Tue, Oct 1, 2024 1:19", updatedAt: "Mon, Oct 27, 2025 1:40", createdBy: "anavas@shalion.com", updatedBy: EC },
  { id: "p11", name: "BAB>GEA_CVS US", bom: "GRPM_02", status: "Active", createdAt: "Thu, May 2, 2024 3:21", updatedAt: "Mon, Oct 27, 2025 1:20", createdBy: EC, updatedBy: EC },
  { id: "p12", name: "FRE>YOG_Carrefour ES", bom: "GRPM_02", status: "Active", createdAt: "Tue, Jun 25, 2024 1:30", updatedAt: "Mon, Oct 27, 2025 1:40", createdBy: EC, updatedBy: EC },
  { id: "p13", name: "PAN>COF_Amazon SE", bom: "GRPM_02", status: "Active", createdAt: "Tue, Jun 25, 2024 1:40", updatedAt: "Mon, Oct 27, 2025 1:50", createdBy: EC, updatedBy: EC },
  {
    id: "abinmx", name: "Ab Inbev MX", bom: "SHL0131", status: "Active",
    createdAt: "Wed, Jun 25, 2025 10:00", updatedAt: "Mon, Oct 27, 2025 1:50", createdBy: EC, updatedBy: EC,
    assignedScrapingPlans: [
      { id: "asu1", name: "ME_KW_WATER — Amazon US", store: "Amazon US", geo: "MANUAL", type: "Media (ME)", expiration: "-" },
      { id: "asu2", name: "PDP_BEAM_US — Amazon US", store: "Amazon US", geo: "AUTOMATIC", type: "Product Detail Page (PDP)", expiration: "-" },
    ],
  },
  CC("cc1", "DSM - Coca Cola FR (inactivo)", "demo_coca_fr_dsm", "Mon, Jan 6, 2025", "Inactive"),
  CC("cc2", "DSO - Coca Cola Latam", "SHL0054_DSM", "Sun, Mar 12, 2023"),
  CC("cc3", "DSM - Coca Cola CCH", "SHL0113", "Tue, Feb 10, 2026"),
  CC("cc4", "FSA - Coca Cola UK-MX-IN", "demo_coca_global_fsa", "Sun, Apr 14, 2024"),
  CC("cc5", "FSA - Coca Cola NA 1st party Uber", "demo_coke_1st_party_uber", "Thu, Jan 1, 2026"),
  CC("cc6", "BSB Coca Cola US Marketshare Interno", "SHL0110", "Thu, Mar 12, 2026"),
  CC("cc7", "FSA - Coca Cola INSWA", "SHL0056", "Mon, Jan 1, 2024"),
  CC("cc8", "QCA - Coca Cola ASP", "SHL0084_QCA", "Mon, Jan 1, 2024"),
  CC("cc9", "FSA - Coca Cola Africa", "coca_advanced_FSA_Africa", "Mon, Jan 1, 2024"),
  CC("cc10", "FSA - Coca Cola MENA", "coca_advanced_FSA_MENA", "Mon, Jan 1, 2024"),
  CC("cc11", "FSA - Coca Cola NA", "coca_advanced_FSA_NAx6", "Mon, Jan 1, 2024"),
  CC("cc12", "FSA - Coca Cola APAC - 5 star", "SHL0114", "Thu, Jan 1, 2026"),
  CC("cc13", "FSA - Coca Cola Oceania", "SHL0084_FSA", "Mon, Jan 1, 2024"),
  CC("cc14", "DSM - Coca Cola RFP", "SHL0110", "Sun, Mar 12, 2023"),
  CC("cc15", "FSA - Coca Cola Europe", "coca_advanced_FSA_Europa", "Wed, Jan 1, 2025"),
  CC("cc16", "FSA - Coca Cola APAC", "SHL0084_FSA", "Mon, Jan 1, 2024"),
  CC("cc17", "BSL Coca Cola BR Marketshare", "demo_coca_marketsh", "Wed, Jan 1, 2025"),
  CC("cc18", "FSA - Coca Cola Latam", "SHL0054_FSA", "Wed, Jan 1, 2025"),
  CC("cc19", "FSA - Coca Cola NA 1st party", "SHL0090", "Wed, Oct 1, 2025"),
  CC("cc20", "DSO - Coca Cola US", "demo_coca_watik_us", "Sat, Mar 1, 2025"),
];

// The persisted/writable default stays SMALL (curated demo projects only). The 8,138
// real projects pulled from the live tasks-api are a READ-ONLY overlay (BULK_PROJECTS_EXTRA)
// merged in only for DISPLAY via getAllProjects — never persisted, because persisting an
// ~4MB catalog blows the localStorage quota and breaks scenario generation (which
// re-persists getProjects()). /clients is dead, so a real project carries its client only
// via `bom`.
const curatedNames = new Set(CURATED_PROJECTS.map((p) => p.name));
export const INITIAL_PROJECTS: Project[] = CURATED_PROJECTS;

/** Read-only overlay: every real live project not already covered by a curated one. */
export const BULK_PROJECTS_EXTRA: Project[] = BULK_PROJECTS.filter((p) => !curatedNames.has(p.name));

/** Projects list (WRITABLE set), sourced from the persisted store (SSR-safe fallback to
 *  the small curated seed). Use for writes (scenario persist, edits). */
export function getProjects(): Project[] {
  const list = readPersistedList<Project>(PROJECTS_KEY);
  return list.length ? list : INITIAL_PROJECTS;
}

/** All projects for DISPLAY/lookup: the writable set + the read-only live bulk overlay
 *  (deduped by name). Never persist this — use getProjects() as the write base. */
export function getAllProjects(): Project[] {
  const persisted = getProjects();
  const names = new Set(persisted.map((p) => p.name));
  return [...persisted, ...BULK_PROJECTS_EXTRA.filter((p) => !names.has(p.name))];
}

export function emptyProject(): Project {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: "",
    bom: "",
    status: "Active",
    createdAt: nowStamp(),
    updatedAt: nowStamp(),
    createdBy: EC,
    updatedBy: EC,
  };
}
