import { readPersistedList } from "./seedOptions";

// client-project relationship: a project assigned to a client for a date range.
export type AssignedProject = {
  projectId: string;
  name: string;
  bom: string;
  activeFrom: string;
  activeTo: string;
};

export type Client = {
  id: string;
  name: string;
  acronym: string;
  isTest: boolean;
  meta: string; // JSON string of meta properties
  createdAt: string;
  updatedAt: string;
  assignedProjects?: AssignedProject[];
};

export const CLIENTS_KEY = "clients";

// Seeded from the production mockup.
const C = (id: string, name: string, acronym: string, isTest: boolean, createdAt: string, updatedAt: string): Client =>
  ({ id, name, acronym, isTest, meta: "{}", createdAt, updatedAt });

// Sourced from the Clients export (Ecometry / Shalion Console, Jun 2026) — 85 clients.
export const INITIAL_CLIENTS: Client[] = [
  { ...C("abin", "Ab Inbev", "ABIN", false, "Thu, Jun 26, 2025 10:10 AM", "Thu, Jun 26, 2025 10:19 AM"), assignedProjects: [{ projectId: "abinmx", name: "Ab Inbev MX", bom: "SHL0131", activeFrom: "Wed, Jun 25, 2025", activeTo: "Mon, May 31, 2027" }] },
  C("affi", "Affinity", "AFFI", false, "Wed, Mar 27, 2024 12:06 PM", "Tue, Aug 6, 2024 10:28 AM"),
  C("baca", "Bacardi", "BACA", false, "Tue, Dec 12, 2023 1:11 PM", "Thu, Jul 25, 2024 10:10 AM"),
  C("baye", "Bayer", "BAYE", false, "Thu, Dec 19, 2024 4:37 PM", "Thu, Dec 19, 2024 4:53 PM"),
  C("beam", "Beam Suntory", "BEAM", false, "Mon, Jul 10, 2023 7:58 AM", "Tue, Aug 6, 2024 10:30 AM"),
  C("bimb", "Bimbo", "BIMB", false, "Mon, Jan 9, 2023 8:05 AM", "Tue, Aug 6, 2024 10:28 AM"),
  C("coca", "Coca Cola", "COCA", false, "Thu, Mar 7, 2024 11:15 AM", "Fri, Jul 19, 2024 12:41 PM"),
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

export function emptyClient(): Client {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: "",
    acronym: "",
    isTest: false,
    meta: "{}",
    createdAt: nowStamp(),
    updatedAt: nowStamp(),
    assignedProjects: [],
  };
}

export function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
