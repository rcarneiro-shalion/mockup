import { readPersistedList } from "./seedOptions";
import type { UseCase } from "./retailers";

// client-project relationship: a project assigned to a client for a date range.
export type AssignedProject = {
  projectId: string;
  name: string;
  bom: string;
  activeFrom: string;
  activeTo: string;
};

// A client data group (dashboard grouping).
export type DataGroup = {
  id: string;
  name: string;
  dashboardType: string; // BRAND, ...
  createdAt: string;
  updatedAt: string;
};

// Bottom-tab sub-resources of a client.
// Client enablement of a Location Catalog (ex ClientRegionSystem) — carries the
// use cases the catalog's location sets may be used for, and allows multiple per country.
export type ClientLocationCatalog = { id: string; name: string; country: string; useCases: UseCase[] };
export type Manufacturer = { id: string; name: string };
export type Competitor = { id: string; name: string; isMain?: boolean };

// A user can be a member of MANY data groups at once (the USER_DATA_GROUP N:M), and —
// for internal Customer-Success / Sales staff — those memberships can span MULTIPLE
// clients (e.g. the same person in Coke→DG1/DG2, Pepsico→DG1/DG4, Lego→DG1).
// `ClientUser` is the per-client PROJECTION of that global (IAM) user: it lists only the
// memberships within THIS client, so `dataGroupIds` references only Client.dataGroups[].id.
// The client-level Users grid is intentionally scoped to the current client's domain;
// the full cross-client view of every data group a user belongs to is a future IAM-module
// feature. The same email may therefore appear under several clients, each showing its own DGs.
export type ClientUser = {
  id: string;
  email: string;
  status: "Active" | "Inactive";
  dataGroupIds: string[];
  // Per-user application permission grants (from IAM), keyed `<resource>.<grant>`. Currently the
  // focus is the external app Maestro: explorer.view / conversation.manage / conversation.unlimited
  // / slides.view / slides.manage. Per-user (global to the app), independent of data groups.
  maestroGrants?: string[];
  createdAt: string;
  updatedAt: string;
};

export type Client = {
  id: string;
  name: string;
  acronym: string;
  isTest: boolean;
  account?: string; // the account this client belongs to
  meta: string; // JSON string of meta properties
  createdAt: string;
  updatedAt: string;
  assignedProjects?: AssignedProject[];
  dataGroups?: DataGroup[];
  users?: ClientUser[];
  locationCatalogs?: ClientLocationCatalog[];
  manufacturers?: Manufacturer[];
  competitors?: Competitor[];
};

export const CLIENTS_KEY = "clients";

// Seeded from the production mockup.
const C = (id: string, name: string, acronym: string, isTest: boolean, createdAt: string, updatedAt: string): Client =>
  ({ id, name, acronym, isTest, meta: "{}", createdAt, updatedAt });

// Coca Cola client↔project relationship (mirrors projects.ts CC ids cc1–cc20).
const AP = (projectId: string, name: string, bom: string, activeFrom: string, activeTo: string): AssignedProject =>
  ({ projectId, name, bom, activeFrom, activeTo });
const COCA_PROJECTS: AssignedProject[] = [
  AP("cc1", "DSM - Coca Cola FR (inactivo)", "demo_coca_fr_dsm", "Mon, Jan 6, 2025", "Sat, Jan 1, 2050"),
  AP("cc2", "DSO - Coca Cola Latam", "SHL0054_DSM", "Sun, Mar 12, 2023", "Sat, Jan 1, 2050"),
  AP("cc3", "DSM - Coca Cola CCH", "SHL0113", "Tue, Feb 10, 2026", "Tue, Sep 1, 2026"),
  AP("cc4", "FSA - Coca Cola UK-MX-IN", "demo_coca_global_fsa", "Sun, Apr 14, 2024", "Tue, Dec 31, 2024"),
  AP("cc5", "FSA - Coca Cola NA 1st party Uber", "demo_coke_1st_party_uber", "Thu, Jan 1, 2026", "Sun, Mar 1, 2026"),
  AP("cc6", "BSB Coca Cola US Marketshare Interno", "SHL0110", "Thu, Mar 12, 2026", "Tue, Apr 14, 2026"),
  AP("cc7", "FSA - Coca Cola INSWA", "SHL0056", "Mon, Jan 1, 2024", "Sun, Jun 21, 2026"),
  AP("cc8", "QCA - Coca Cola ASP", "SHL0084_QCA", "Mon, Jan 1, 2024", "Sat, Jan 1, 2050"),
  AP("cc9", "FSA - Coca Cola Africa", "coca_advanced_FSA_Africa", "Mon, Jan 1, 2024", "Thu, Oct 30, 2025"),
  AP("cc10", "FSA - Coca Cola MENA", "coca_advanced_FSA_MENA", "Mon, Jan 1, 2024", "Thu, Oct 30, 2025"),
  AP("cc11", "FSA - Coca Cola NA", "coca_advanced_FSA_NAx6", "Mon, Jan 1, 2024", "Thu, Oct 30, 2025"),
  AP("cc12", "FSA - Coca Cola APAC - 5 star", "SHL0114", "Thu, Jan 1, 2026", "Tue, Feb 23, 2027"),
  AP("cc13", "FSA - Coca Cola Oceania", "SHL0084_FSA", "Mon, Jan 1, 2024", "Sat, Jan 1, 2050"),
  AP("cc14", "DSM - Coca Cola RFP", "SHL0110", "Sun, Mar 12, 2023", "Sun, May 31, 2026"),
  AP("cc15", "FSA - Coca Cola Europe", "coca_advanced_FSA_Europa", "Wed, Jan 1, 2025", "Thu, Oct 30, 2025"),
  AP("cc16", "FSA - Coca Cola APAC", "SHL0084_FSA", "Mon, Jan 1, 2024", "Sat, Jan 1, 2050"),
  AP("cc17", "BSL Coca Cola BR Marketshare", "demo_coca_marketsh", "Wed, Jan 1, 2025", "Sat, Jan 1, 2050"),
  AP("cc18", "FSA - Coca Cola Latam", "SHL0054_FSA", "Wed, Jan 1, 2025", "Sat, Apr 1, 2028"),
  AP("cc19", "FSA - Coca Cola NA 1st party", "SHL0090", "Wed, Oct 1, 2025", "Tue, Oct 6, 2026"),
  AP("cc20", "DSO - Coca Cola US", "demo_coca_watik_us", "Sat, Mar 1, 2025", "Tue, Jan 20, 2026"),
];

const DG = (id: string, name: string, createdAt: string, updatedAt: string): DataGroup =>
  ({ id, name, dashboardType: "BRAND", createdAt, updatedAt });
const COCA_DATA_GROUPS: DataGroup[] = [
  DG("dg1", "Coca Cola ASP (+RFP)", "Fri, Sep 26, 2025 7:41 AM", "Tue, Jun 2, 2026 7:13 AM"),
  DG("dg2", "Coca Cola CCH", "Thu, Feb 12, 2026 5:21 PM", "Thu, Feb 12, 2026 5:21 PM"),
  DG("dg3", "Coca Cola Europe (+RFP)", "Mon, Mar 23, 2026 1:09 PM", "Wed, Apr 1, 2026 12:55 PM"),
  DG("dg4", "Coca Cola Global", "Tue, Oct 15, 2024 8:50 AM", "Tue, Jun 2, 2026 7:14 AM"),
  DG("dg5", "Coca Cola INSWA", "Mon, May 26, 2025 10:02 AM", "Tue, Jun 2, 2026 7:14 AM"),
  DG("dg6", "Coca Cola Latam", "Thu, Mar 6, 2025 9:10 AM", "Tue, Jun 2, 2026 7:15 AM"),
  DG("dg7", "Coca Cola NAOU-US (+RFP)", "Fri, Nov 7, 2025 1:45 PM", "Tue, Jun 2, 2026 7:15 AM"),
  DG("dg8", "Coca Cola RFP - DSM", "Tue, Feb 17, 2026 11:04 AM", "Wed, Mar 25, 2026 10:30 AM"),
  DG("dg9", "dummy-con", "Fri, Nov 28, 2025 5:35 PM", "Fri, Nov 28, 2025 5:35 PM"),
];

// Client-level users — each a member of one or many data groups (USER_DATA_GROUP N:M).
const CU = (id: string, email: string, dataGroupIds: string[], createdAt: string, updatedAt: string, status: "Active" | "Inactive" = "Active", maestroGrants: string[] = []): ClientUser =>
  ({ id, email, status, dataGroupIds, maestroGrants, createdAt, updatedAt });
const COCA_USERS: ClientUser[] = [
  CU("cu1", "gian.hernandez@coca-cola.com", ["dg6", "dg4"], "Tue, Jul 15, 2025 7:59 PM", "Tue, Jul 15, 2025 7:59 PM", "Active", ["explorer.view"]),
  CU("cu2", "brandon.vega@coca-cola.com", ["dg6"], "Tue, Jul 15, 2025 1:26 PM", "Tue, Jul 15, 2025 1:26 PM", "Active", ["explorer.view", "slides.view"]),
  CU("cu3", "martha.garcia@coca-cola.com", ["dg3"], "Tue, Aug 12, 2025 4:45 PM", "Tue, Aug 12, 2025 4:45 PM", "Active", ["explorer.view"]),
  CU("cu4", "luis.fernandez@kof.com", ["dg6", "dg1", "dg5"], "Thu, Oct 30, 2025 2:41 PM", "Thu, Oct 30, 2025 2:41 PM", "Active", ["explorer.view", "conversation.manage"]),
  CU("cu5", "sofia.ramos@ccep.com", ["dg3"], "Fri, Oct 31, 2025 8:41 AM", "Fri, Oct 31, 2025 8:41 AM"),
  CU("cu6", "david.costa@coca-cola.com", ["dg7"], "Thu, Oct 16, 2025 7:30 AM", "Thu, Oct 16, 2025 7:30 AM", "Active", ["explorer.view"]),
  // Internal CS member — also belongs to other clients' data groups (Pepsico, Lego, …);
  // here only the Coca-Cola memberships are shown (client-scoped view). Full Maestro grants.
  CU("cu7", "carla.mendes@shalion.com", ["dg4", "dg1", "dg3", "dg7"], "Mon, Sep 1, 2025 10:12 AM", "Wed, Nov 5, 2025 9:03 AM", "Active", ["explorer.view", "conversation.manage", "conversation.unlimited", "slides.view", "slides.manage"]),
  CU("cu8", "marco.bianchi@coca-cola.com", ["dg2"], "Wed, Sep 17, 2025 3:20 PM", "Wed, Sep 17, 2025 3:20 PM", "Inactive"),
  CU("cu9", "amara.okafor@coca-cola.com", ["dg5", "dg6"], "Fri, Nov 7, 2025 11:48 AM", "Fri, Nov 7, 2025 11:48 AM", "Active", ["explorer.view", "slides.view", "slides.manage"]),
];

const RS = (id: string, name: string, country: string, useCases: UseCase[] = ["DASHBOARD"]): ClientLocationCatalog => ({ id, name, country, useCases });
const COCA_LOCATION_CATALOGS: ClientLocationCatalog[] = [
  RS("crs1", "FR - Région Administrative", "FR", ["DASHBOARD", "MSRP"]),
  RS("crs2", "CO - Coke Bottlers", "CO"),
  RS("crs3", "US - Coke Bottlers", "US"),
  RS("crs4", "UY - Coke Bottlers", "UY"),
  RS("crs5", "BO - Coke Bottlers", "BO"),
  RS("crs6", "AR - Coke Bottlers", "AR"),
  RS("crs7", "PE - Coke Bottlers", "PE"),
  RS("crs8", "VE - Coke Bottlers", "VE"),
  RS("crs9", "EC - Coke Bottlers", "EC"),
  RS("crs10", "MX - Coke Bottlers", "MX"),
  RS("crs11", "CL - Coke Bottlers", "CL"),
  RS("crs12", "CR - Coke Bottlers", "CR"),
  RS("crs13", "GT - Coke Bottlers", "GT"),
  RS("crs14", "NI - Coke Bottlers", "NI"),
  RS("crs15", "PA - Coke Bottlers", "PA"),
  RS("crs16", "BR - Coke Bottlers", "BR"),
];

const COCA_MANUFACTURERS: Manufacturer[] = [{ id: "cmf1", name: "Coca Cola Company" }];

const CMP = (id: string, name: string, isMain = false): Competitor => ({ id, name, isMain });
const COCA_COMPETITORS: Competitor[] = [
  CMP("cmp1", "Pascual"),
  CMP("cmp2", "Red Bull"),
  CMP("cmp3", "Keurig Dr Pepper"),
  CMP("cmp4", "Carlsberg Group"),
  CMP("cmp5", "Pepsico", true),
  CMP("cmp6", "Rubicon Food Products Limited"),
  CMP("cmp7", "Nichols"),
  CMP("cmp8", "Novamex"),
  CMP("cmp9", "Britvic Soft Drinks"),
  CMP("cmp10", "Fentimans"),
  CMP("cmp11", "AG Barr"),
  CMP("cmp12", "Schweppes International Limited"),
  CMP("cmp13", "Pulco"),
  CMP("cmp14", "Asahi Group"),
  CMP("cmp15", "Capri Sun Group Holding"),
  CMP("cmp16", "Group Ambev/Abinbev"),
  CMP("cmp17", "Highland Spring"),
  CMP("cmp18", "Nestlé"),
  CMP("cmp19", "Monster Brewing"),
  CMP("cmp20", "Suntory"),
  CMP("cmp21", "Ribena"),
  CMP("cmp22", "Britvic"),
];

// Sourced from the Clients export (Ecometry / Shalion Console, Jun 2026) — 85 clients.
export const INITIAL_CLIENTS: Client[] = [
  { ...C("abin", "Ab Inbev", "ABIN", false, "Thu, Jun 26, 2025 10:10 AM", "Thu, Jun 26, 2025 10:19 AM"), assignedProjects: [{ projectId: "abinmx", name: "Ab Inbev MX", bom: "SHL0131", activeFrom: "Wed, Jun 25, 2025", activeTo: "Mon, May 31, 2027" }] },
  C("affi", "Affinity", "AFFI", false, "Wed, Mar 27, 2024 12:06 PM", "Tue, Aug 6, 2024 10:28 AM"),
  C("baca", "Bacardi", "BACA", false, "Tue, Dec 12, 2023 1:11 PM", "Thu, Jul 25, 2024 10:10 AM"),
  C("baye", "Bayer", "BAYE", false, "Thu, Dec 19, 2024 4:37 PM", "Thu, Dec 19, 2024 4:53 PM"),
  C("beam", "Beam Suntory", "BEAM", false, "Mon, Jul 10, 2023 7:58 AM", "Tue, Aug 6, 2024 10:30 AM"),
  C("bimb", "Bimbo", "BIMB", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:28 AM"),
  { ...C("coca", "Coca Cola", "COCA", false, "Thu, Mar 7, 2024 11:15 AM", "Fri, Jul 19, 2024 12:41 PM"), account: "Coca Cola", assignedProjects: COCA_PROJECTS, dataGroups: COCA_DATA_GROUPS, users: COCA_USERS, locationCatalogs: COCA_LOCATION_CATALOGS, manufacturers: COCA_MANUFACTURERS, competitors: COCA_COMPETITORS },
  C("cosn", "Cosnova", "COSN", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:30 AM"),
  C("dano", "Danone", "DANO", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:28 AM"),
  C("long", "De Longhi", "LONG", false, "Mon, Jul 14, 2025 9:17 AM", "Mon, Jul 14, 2025 2:41 PM"),
  C("dcmi", "Demo CMI", "DCMI", true, "Fri, Aug 2, 2024 12:46 PM", "Wed, Dec 11, 2024 11:57 AM"),
  C("dent", "Dentsu", "DENT", false, "Mon, Jun 16, 2025 1:43 PM", "Mon, Jun 16, 2025 3:16 PM"),
  C("deol", "Deoleo", "DEOL", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:28 AM"),
  C("diag", "Diageo", "DIAG", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:28 AM"),
  C("oetk", "Dr Oetker", "OETK", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:30 AM"),
  C("essi", "Essity", "ESSI", false, "Fri, May 16, 2025 3:08 PM", "Mon, May 19, 2025 2:39 PM"),
  C("expa", "Expanscience", "EXPA", false, "Mon, Jan 9, 2023 8:05 AM", "Wed, Aug 7, 2024 10:29 AM"),
  C("ferr", "Ferrero", "FERR", false, "Tue, May 9, 2023 12:20 PM", "Tue, Aug 6, 2024 10:29 AM"),
  C("fdad", "FSA Demo US - Alcoholic Drinks", "FDAD", true, "Fri, Aug 29, 2025 9:59 AM", "Fri, Sep 12, 2025 1:30 PM"),
  C("fdic", "FSA Demo US - Ice Creams", "FDIC", true, "Fri, Aug 29, 2025 9:56 AM", "Fri, Sep 12, 2025 1:30 PM"),
  C("fdsn", "FSA Demo US - Snacks", "FDSN", true, "Fri, Aug 29, 2025 9:58 AM", "Fri, Sep 12, 2025 1:30 PM"),
  C("fdsf", "FSA Demo US - Soft Drinks", "FDSF", true, "Fri, Aug 29, 2025 9:54 AM", "Thu, Apr 30, 2026 10:31 AM"),
  C("fdwa", "FSA Demo US - Waters", "FDWA", true, "Mon, Oct 28, 2024 1:14 PM", "Fri, Aug 29, 2025 9:55 AM"),
  C("geek", "Geekspeak", "GEEK", false, "Thu, Dec 5, 2024 10:17 PM", "Thu, Nov 6, 2025 3:46 PM"),
  C("mapl", "Geekspeak - Maple Leaf", "MAPL", false, "Wed, Jan 22, 2025 12:10 PM", "Wed, Jan 22, 2025 12:14 PM"),
  C("grpm", "GroupM", "GRPM", false, "Thu, Aug 3, 2023 10:18 AM", "Thu, Jul 25, 2024 2:22 PM"),
  C("grpm_pndg", "GroupM - PNDG", "GRPM_PNDG", false, "Tue, Jul 22, 2025 2:44 PM", "Tue, Sep 16, 2025 2:07 PM"),
  C("hart", "Hartmann", "HART", false, "Thu, Dec 14, 2023 3:33 PM", "Tue, Aug 6, 2024 10:29 AM"),
  C("hasb", "Hasbro", "HASB", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:30 AM"),
  C("hein", "Heineken", "HEIN", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:29 AM"),
  C("henk", "Henkel", "HENK", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:29 AM"),
  C("herd", "Herdez", "HERD", false, "Mon, Jul 29, 2024 10:09 AM", "Tue, Aug 6, 2024 10:28 AM"),
  C("hero", "HERO", "HERO", false, "Mon, Jul 21, 2025 10:31 AM", "Mon, Jul 21, 2025 10:34 AM"),
  C("illy", "Illy", "ILLY", false, "Fri, May 23, 2025 2:00 PM", "Fri, May 23, 2025 2:00 PM"),
  C("inta_kaox", "Intage Kao - XX", "INTA_KAOX", false, "Mon, Feb 5, 2024 5:34 PM", "Fri, Mar 22, 2024 1:13 PM"),
  C("scie", "Int - Data Science", "SCIE", true, "Wed, Jul 2, 2025 2:11 PM", "Tue, Sep 9, 2025 7:44 AM"),
  C("medi", "Int - Media Test", "MEDI", true, "Mon, Dec 16, 2024 3:12 PM", "Tue, Sep 9, 2025 7:45 AM"),
  C("tsta", "Int - Test A", "TSTA", true, "Fri, Nov 8, 2024 3:39 PM", "Tue, Sep 9, 2025 7:45 AM"),
  C("tstb", "Int - Test B", "TSTB", true, "Fri, Nov 8, 2024 3:45 PM", "Tue, Sep 9, 2025 7:45 AM"),
  C("tstc", "Int - Test C", "TSTC", true, "Mon, Feb 10, 2025 1:12 PM", "Tue, Sep 9, 2025 7:45 AM"),
  C("ipgx", "IPG", "IPGX", false, "Thu, Nov 30, 2023 1:32 PM", "Mon, Aug 12, 2024 2:29 PM"),
  C("isdi", "ISDIN", "ISDI", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:29 AM"),
  C("jage", "Jagermeister", "JAGE", false, "Mon, Feb 12, 2024 8:54 AM", "Tue, Aug 6, 2024 10:29 AM"),
  C("jdex", "JDE", "JDEX", false, "Thu, Dec 21, 2023 11:01 AM", "Tue, Aug 6, 2024 10:29 AM"),
  C("kell", "Kelloggs", "KELL", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:28 AM"),
  C("kang", "Kenzo&Givenchy", "KANG", false, "Fri, Nov 21, 2025 2:13 PM", "Thu, Nov 27, 2025 9:01 AM"),
  C("kimb", "Kimberly-Clark", "KIMB", false, "Tue, Apr 1, 2025 8:36 AM", "Tue, Apr 1, 2025 8:36 AM"),
  C("vtec", "Kinesso - Vtech", "VTEC", false, "Wed, Apr 16, 2025 1:46 PM", "Fri, May 2, 2025 2:29 PM"),
  C("lala", "Lala", "LALA", false, "Mon, Jan 9, 2023 8:05 AM", "Wed, Aug 7, 2024 10:29 AM"),
  C("lego", "LEGO", "LEGO", false, "Mon, Jan 9, 2023 8:05 AM", "Fri, Mar 28, 2025 8:36 AM"),
  C("lg26", "LEGO26", "LG26", false, "Thu, Oct 16, 2025 9:37 AM", "Thu, Oct 16, 2025 9:38 AM"),
  C("lgve", "LEGO Vehicles", "LGVE", false, "Tue, Apr 7, 2026 9:52 AM", "Tue, Apr 7, 2026 1:04 PM"),
  C("loew", "Loewe", "LOEW", false, "Fri, Feb 9, 2024 3:54 PM", "Wed, Jul 31, 2024 9:28 AM"),
  C("lore", "Loreal", "LORE", false, "Tue, Apr 25, 2023 8:08 AM", "Tue, Aug 6, 2024 10:27 AM"),
  C("maho", "Mahou", "MAHO", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:28 AM"),
  C("mars", "Mars", "MARS", false, "Fri, Mar 1, 2024 3:42 PM", "Fri, Feb 7, 2025 4:16 PM"),
  C("matt", "Mattel", "MATT", false, "Tue, May 9, 2023 12:20 PM", "Tue, Aug 6, 2024 10:28 AM"),
  C("moet", "Moet Hennessy", "MOET", false, "Fri, May 31, 2024 1:17 PM", "Fri, Feb 14, 2025 9:20 AM"),
  C("mond", "Mondelez", "MOND", false, "Fri, Oct 20, 2023 1:47 PM", "Tue, Aug 6, 2024 10:28 AM"),
  C("ndlx", "NDL", "NDLX", false, "Thu, Dec 19, 2024 4:08 PM", "Mon, Dec 23, 2024 9:29 AM"),
  C("nest", "Nestle", "NEST", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:27 AM"),
  C("odmt", "ODM Test", "ODMT", true, "Wed, Jun 10, 2026 1:30 PM", "Wed, Jun 10, 2026 1:30 PM"),
  C("omni", "Omnicom", "OMNI", false, "Fri, Dec 19, 2025 2:35 PM", "Mon, Mar 2, 2026 2:44 PM"),
  C("osbo", "Osborne", "OSBO", false, "Thu, Nov 16, 2023 2:45 PM", "Tue, Aug 6, 2024 10:29 AM"),
  C("peps", "Pepsico", "PEPS", false, "Fri, Nov 22, 2024 11:28 AM", "Mon, Nov 25, 2024 8:29 AM"),
  C("pdem", "Pepsico US DEMO", "PDEM", false, "Fri, Nov 7, 2025 10:26 AM", "Thu, Nov 20, 2025 9:46 AM"),
  C("perf", "Perfetti", "PERF", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:29 AM"),
  C("pern", "Pernod Ricard", "PERN", false, "Tue, Apr 25, 2023 8:08 AM", "Tue, Aug 6, 2024 10:29 AM"),
  C("pilg", "Pilgrin's", "PILG", false, "Thu, Dec 11, 2025 8:34 AM", "Thu, Dec 11, 2025 10:52 AM"),
  C("prim", "Prime Drinks", "PRIM", false, "Thu, Jul 10, 2025 3:42 PM", "Fri, Jul 11, 2025 11:10 AM"),
  C("publ_lore", "Publicis Loreal - UK", "PUBL_LORE", false, "Fri, Feb 16, 2024 9:25 PM", "Tue, Aug 6, 2024 10:29 AM"),
  C("redb", "Redbull", "REDB", false, "Fri, Jul 11, 2025 12:55 PM", "Tue, Jul 15, 2025 3:01 PM"),
  C("rmm3", "RMM", "RMM3", false, "Fri, Apr 17, 2026 12:54 PM", "Fri, Apr 17, 2026 1:14 PM"),
  C("sams", "Samsung", "SAMS", false, "Wed, Apr 15, 2026 12:35 PM", "Wed, Apr 15, 2026 12:36 PM"),
  C("shal", "Shalion-Internal", "SHAL", false, "Thu, Jun 15, 2023 11:44 AM", "Fri, Oct 25, 2024 1:16 PM"),
  C("spec", "Spectrum Brands", "SPEC", false, "Tue, Oct 31, 2023 11:44 AM", "Tue, Aug 6, 2024 10:27 AM"),
  C("tcdc", "Tech - dummy client", "TCDC", true, "Thu, Dec 4, 2025 11:34 AM", "Thu, Dec 4, 2025 11:34 AM"),
  C("tci2", "test client", "TCI2", true, "Mon, May 26, 2025 8:43 AM", "Mon, May 26, 2025 8:43 AM"),
  C("tleg", "TEST LEGO", "TLEG", false, "Tue, Jun 17, 2025 9:38 AM", "Tue, Jun 17, 2025 10:49 AM"),
  C("loca", "Test - Locations discovery", "LOCA", true, "Thu, Feb 6, 2025 2:18 PM", "Thu, Feb 6, 2025 2:18 PM"),
  C("unil", "Unilever", "UNIL", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:27 AM"),
  C("virb", "Virbac MX", "VIRB", false, "Fri, Apr 17, 2026 2:42 PM", "Fri, Apr 17, 2026 3:26 PM"),
  C("vrum", "Vrumona", "VRUM", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:28 AM"),
  C("walm", "Walmart", "WALM", false, "Fri, Jun 5, 2026 10:35 AM", "Fri, Jun 5, 2026 2:55 PM"),
  C("well", "Wella", "WELL", false, "Tue, Apr 25, 2023 8:08 AM", "Tue, Aug 6, 2024 10:28 AM"),
];

/**
 * Dynamic client list, sourced from the persisted Clients store (falling back
 * to the seeded list / SSR). Use this everywhere a client dropdown is needed so
 * the options stay in sync with the Clients datagrid instead of a static array.
 */
export function getClients(): Client[] {
  const list = readPersistedList<Client>(CLIENTS_KEY);
  return list.length ? list : INITIAL_CLIENTS;
}

export function getClientNames(): string[] {
  return getClients().map((c) => c.name);
}

/** Names of clients that have the given project assigned (client-project relation). */
export function getClientsForProject(projectId: string): string[] {
  return getClients()
    .filter((c) => (c.assignedProjects ?? []).some((ap) => ap.projectId === projectId))
    .map((c) => c.name);
}

// Project-side view of the one client↔project relationship (rendered on the
// Project page's "Assigned clients" grid). The link still lives on the client —
// this is just the inverse projection, with the assignment's active range.
export type ProjectClient = { clientId: string; name: string; acronym: string; activeFrom: string; activeTo: string };

/** Clients (with the assignment's date range) that have the given project assigned. */
export function getAssignedClientsForProject(projectId: string): ProjectClient[] {
  return getClients().flatMap((c) => {
    const ap = (c.assignedProjects ?? []).find((p) => p.projectId === projectId);
    return ap ? [{ clientId: c.id, name: c.name, acronym: c.acronym, activeFrom: ap.activeFrom, activeTo: ap.activeTo }] : [];
  });
}

/**
 * Reconcile the Clients store so EXACTLY the given clients have `project` assigned
 * (the relationship's single source of truth is `client.assignedProjects`). Adds /
 * updates / removes this project on each client and persists — so the Client page
 * stays in sync with edits made from the Project page. No-op on the server.
 */
/** Pure: return `clients` with `project` reconciled so exactly `links` carry it.
 *  Callers that need failures to propagate (e.g. an atomic multi-key write) can
 *  persist the result through a throwing writer instead of {@link setProjectClients}. */
export function withProjectClients(
  clients: Client[],
  project: { id: string; name: string; bom: string },
  links: ProjectClient[],
): Client[] {
  const want = new Map(links.map((l) => [l.clientId, l]));
  return clients.map((c) => {
    const existing = c.assignedProjects ?? [];
    const others = existing.filter((p) => p.projectId !== project.id);
    const link = want.get(c.id);
    if (link) {
      const ap: AssignedProject = { projectId: project.id, name: project.name, bom: project.bom, activeFrom: link.activeFrom, activeTo: link.activeTo };
      return { ...c, assignedProjects: [...others, ap] };
    }
    return others.length !== existing.length ? { ...c, assignedProjects: others } : c;
  });
}

export function setProjectClients(
  project: { id: string; name: string; bom: string },
  links: ProjectClient[],
): void {
  if (typeof window === "undefined") return;
  const next = withProjectClients(getClients(), project, links);
  try {
    window.localStorage.setItem(CLIENTS_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / serialization errors */
  }
}

export function emptyClient(): Client {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: "",
    acronym: "",
    isTest: false,
    account: "",
    meta: "{}",
    createdAt: nowStamp(),
    updatedAt: nowStamp(),
    assignedProjects: [],
    dataGroups: [],
    users: [],
    locationCatalogs: [],
    manufacturers: [],
    competitors: [],
  };
}

export function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
