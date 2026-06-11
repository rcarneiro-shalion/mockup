import { nowStamp } from "./clients";
import { readPersistedList } from "./seedOptions";

// project-subscription relationship: a subscription assigned to a project.
export type AssignedSubscription = {
  id: string;
  name: string;
  store: string;
  geo: string;
  type: string; // BASE, ADDON, ...
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
  assignedSubscriptions?: AssignedSubscription[];
};

export const PROJECTS_KEY = "seeds-api:projects";

export const ASSIGN_TYPE_OPTIONS = ["BASE", "ADDON"];

const EC = "ecometry@shalion.com";

// Coca Cola projects (client↔project relationship — mirrored in clients.ts COCA_PROJECTS).
const CC = (id: string, name: string, bom: string, from: string, status: Project["status"] = "Active"): Project => ({
  id, name, bom, status, createdAt: `${from} 08:00`, updatedAt: "Tue, Jun 2, 2026 7:14", createdBy: EC, updatedBy: EC,
});

// Seeded from the production mockup.
export const INITIAL_PROJECTS: Project[] = [
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
    assignedSubscriptions: [
      { id: "asu1", name: "ME_KW_WATER — Amazon US", store: "Amazon US", geo: "MANUAL", type: "BASE", expiration: "-" },
      { id: "asu2", name: "PDP_BEAM_US — Amazon US", store: "Amazon US", geo: "AUTOMATIC", type: "BASE", expiration: "-" },
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

/** Projects list, sourced from the persisted store (SSR-safe fallback to seed). */
export function getProjects(): Project[] {
  const list = readPersistedList<Project>(PROJECTS_KEY);
  return list.length ? list : INITIAL_PROJECTS;
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
