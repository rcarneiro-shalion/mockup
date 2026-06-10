import { nowStamp } from "./clients";
import { readPersistedList } from "./seedOptions";

// project-storepackage relationship: a store package assigned to a project.
export type AssignedStorePackage = {
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
  assignedStorePackages?: AssignedStorePackage[];
};

export const PROJECTS_KEY = "seeds-api:projects";

export const ASSIGN_TYPE_OPTIONS = ["BASE", "ADDON"];

const EC = "ecometry@shalion.com";

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
    assignedStorePackages: [
      { id: "asp1", name: "PKG Amazon US", store: "Amazon US", geo: "MANUAL", type: "BASE", expiration: "-" },
      { id: "asp2", name: "PKG - MAT Amazon US", store: "Amazon US", geo: "VIRTUAL STORE", type: "BASE", expiration: "-" },
    ],
  },
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
