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
export const INITIAL_CLIENTS: Client[] = [
  { id: "abin", name: "Ab Inbev", acronym: "ABIN", isTest: false, meta: "{}", createdAt: "2025-06-26, 10:10:51", updatedAt: "2025-06-26, 10:19:18", assignedProjects: [{ projectId: "abinmx", name: "Ab Inbev MX", bom: "SHL0131", activeFrom: "Wed, Jun 25, 2025", activeTo: "Mon, May 31, 2027" }] },
  { id: "affi", name: "Affinity", acronym: "AFFI", isTest: false, meta: "{}", createdAt: "2024-03-27, 12:06:32", updatedAt: "2024-08-06, 10:28:16" },
  { id: "baca", name: "Bacardi", acronym: "BACA", isTest: false, meta: "{}", createdAt: "2023-12-12, 13:11:41", updatedAt: "2024-07-25, 10:10:23" },
  { id: "baye", name: "Bayer", acronym: "BAYE", isTest: false, meta: "{}", createdAt: "2024-12-19, 16:37:50", updatedAt: "2024-12-19, 16:53:15" },
  { id: "beam", name: "Beam Suntory", acronym: "BEAM", isTest: false, meta: "{}", createdAt: "2023-07-10, 07:58:38", updatedAt: "2024-08-06, 10:30:03" },
  { id: "bimb", name: "Bimbo", acronym: "BIMB", isTest: false, meta: "{}", createdAt: "2023-01-09, 08:05:28", updatedAt: "2024-08-06, 10:28:08" },
  { id: "coca", name: "Coca Cola", acronym: "COCA", isTest: false, meta: "{}", createdAt: "2024-03-07, 11:15:53", updatedAt: "2024-07-19, 12:41:16" },
  { id: "cosn", name: "Cosnova", acronym: "COSN", isTest: false, meta: "{}", createdAt: "2023-01-09, 08:05:28", updatedAt: "2024-08-06, 10:30:09" },
  { id: "dano", name: "Danone", acronym: "DANO", isTest: false, meta: "{}", createdAt: "2023-01-09, 08:05:28", updatedAt: "2024-08-06, 10:28:12" },
  { id: "long", name: "De Longhi", acronym: "LONG", isTest: false, meta: "{}", createdAt: "2025-07-14, 09:17:59", updatedAt: "2025-07-14, 14:41:14" },
  { id: "dcmi", name: "Demo CMI", acronym: "DCMI", isTest: true, meta: "{}", createdAt: "2024-08-02, 12:46:40", updatedAt: "2024-12-11, 11:57:52" },
  { id: "dent", name: "Dentsu", acronym: "DENT", isTest: false, meta: "{}", createdAt: "2025-06-16, 13:43:44", updatedAt: "2025-06-16, 15:16:11" },
  { id: "deol", name: "Deoleo", acronym: "DEOL", isTest: false, meta: "{}", createdAt: "2023-01-09, 08:05:29", updatedAt: "2024-08-06, 10:28:29" },
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
