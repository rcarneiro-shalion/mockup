// IAM listing/edit specs.
//
// IAM is Shalion's identity & access area (console.v2.shalion.com/iam). Its
// console pages — Applications, Users, Accounts, Roles / Persona — are mirrored
// from console-frontend (src/features/iam/*): columns, filters, search
// placeholders, add labels and form fields come from the resource DTOs the
// grids/forms bind to.
//
// Each entry is an ApproxSpec consumed by the generic EntityListPage /
// EntityEditPage, like the Ecometry and Data Collector pages.
import type { ApproxSpec } from "@/components/common/EntityListPage";

// Example role/persona names (Roles are free-form entities, not a fixed enum).
const ROLE_NAMES = ["Admin", "Analyst", "Manager", "Viewer", "Read only"];
const USER_STATUS = ["Active", "Inactive"];

export const IAM_SPECS: Record<string, ApproxSpec> = {
  // ---- Applications ------------------------------------------------------
  "iam-applications": {
    key: "iam-applications",
    title: "Applications",
    addLabel: "Add application",
    search: "Search applications by name",
    filters: ["Name"],
    total: 3,
    columns: [
      { label: "Name", key: "name" },
      { label: "Slug", key: "slug" },
      { label: "Created at", key: "creationDateTime" },
      { label: "Updated at", key: "lastUpdatedDateTime" },
    ],
    rows: [
      { id: "app-ecometry", name: "Ecometry", slug: "ecometry", creationDateTime: "2024-06-01 10:30:00", lastUpdatedDateTime: "2026-05-10 14:45:00" },
      { id: "app-data-collector", name: "Data Collector", slug: "data-collector", creationDateTime: "2024-05-15 08:15:00", lastUpdatedDateTime: "2026-06-05 09:20:00" },
      { id: "app-iam", name: "IAM", slug: "iam", creationDateTime: "2024-04-01 12:00:00", lastUpdatedDateTime: "2026-06-10 16:00:00" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", required: false },
    ],
  },

  // ---- Users -------------------------------------------------------------
  // No "Add" button on the console (users are created via a batch flow).
  "iam-users": {
    key: "iam-users",
    title: "Users",
    addLabel: "",
    search: "Search users by email",
    filters: ["Email", "Accounts", "Status"],
    total: 1248,
    columns: [
      { label: "Email", key: "email" },
      { label: "Accounts", key: "accounts" },
      { label: "Role", key: "role" },
      { label: "Status", key: "status" },
      { label: "Created at", key: "creationDateTime" },
      { label: "Updated at", key: "lastUpdatedDateTime" },
    ],
    rows: [
      { id: "usr-john-doe", email: "john.doe@example.com", accounts: "Coca Cola, Pepsi", role: "Analyst", status: "Active", creationDateTime: "2025-01-15 10:30:00", lastUpdatedDateTime: "2026-06-10 14:22:00" },
      { id: "usr-jane-smith", email: "jane.smith@company.com", accounts: "Nestlé", role: "Manager", status: "Active", creationDateTime: "2025-02-20 09:15:00", lastUpdatedDateTime: "2026-05-28 16:45:00" },
      { id: "usr-admin-shalion", email: "admin@shalion.com", accounts: "Internal Account", role: "Admin", status: "Inactive", creationDateTime: "2024-12-01 08:00:00", lastUpdatedDateTime: "2026-06-05 11:30:00" },
      { id: "usr-maria-garcia", email: "maria.garcia@cocacola.com", accounts: "Coca Cola", role: "Viewer", status: "Active", creationDateTime: "2025-03-12 13:05:00", lastUpdatedDateTime: "2026-06-08 10:12:00" },
      { id: "usr-tom-lee", email: "tom.lee@pepsico.com", accounts: "Pepsi", role: "Analyst", status: "Active", creationDateTime: "2025-04-03 11:40:00", lastUpdatedDateTime: "2026-05-30 09:55:00" },
      { id: "usr-sara-kim", email: "sara.kim@shalion.com", accounts: "Internal Account", role: "Read only", status: "Active", creationDateTime: "2025-05-21 15:20:00", lastUpdatedDateTime: "2026-06-09 17:30:00" },
    ],
    fields: [
      { key: "email", label: "Email", type: "text", required: true },
      { key: "role", label: "Role", type: "select", required: false, options: ROLE_NAMES },
      { key: "status", label: "Status", type: "select", required: false, options: USER_STATUS },
      { key: "accounts", label: "Accounts", type: "text", required: false },
    ],
  },

  // ---- Accounts ----------------------------------------------------------
  "iam-accounts": {
    key: "iam-accounts",
    title: "Accounts",
    addLabel: "Add account",
    search: "Search accounts by name",
    filters: ["Name"],
    total: 312,
    columns: [
      { label: "Name", key: "name" },
      { label: "Slug", key: "slug" },
      { label: "Created at", key: "creationDateTime" },
      { label: "Updated at", key: "lastUpdatedDateTime" },
    ],
    rows: [
      { id: "acc-internal", name: "Internal Account", slug: "internal-account", creationDateTime: "2024-01-15 10:30:00", lastUpdatedDateTime: "2026-06-10 14:22:15" },
      { id: "acc-coca-cola", name: "Coca Cola Operations", slug: "coca-cola-operations", creationDateTime: "2024-02-20 09:15:00", lastUpdatedDateTime: "2026-06-09 16:45:30" },
      { id: "acc-pepsi", name: "Pepsi", slug: "pepsi", creationDateTime: "2024-03-05 11:20:00", lastUpdatedDateTime: "2026-05-22 13:10:00" },
      { id: "acc-nestle", name: "Nestlé", slug: "nestle", creationDateTime: "2024-03-18 14:00:00", lastUpdatedDateTime: "2026-06-01 08:40:00" },
      { id: "acc-dc-sandbox", name: "Data Collector API Sandbox", slug: "data-collector-api-sandbox", creationDateTime: "2024-03-10 11:00:00", lastUpdatedDateTime: "2026-06-08 08:30:00" },
      { id: "acc-unilever", name: "Unilever", slug: "unilever", creationDateTime: "2024-04-22 09:45:00", lastUpdatedDateTime: "2026-05-18 15:25:00" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", required: false },
    ],
  },

  // ---- Roles / Persona ---------------------------------------------------
  "iam-roles": {
    key: "iam-roles",
    title: "Roles / Persona",
    addLabel: "Add role",
    search: "Search roles by name",
    filters: ["Name"],
    total: 12,
    columns: [
      { label: "Name", key: "name" },
      { label: "Slug", key: "slug" },
      { label: "Created at", key: "creationDateTime" },
      { label: "Updated at", key: "lastUpdatedDateTime" },
    ],
    rows: [
      { id: "role-admin", name: "Admin", slug: "admin", creationDateTime: "2025-11-15 09:23:41", lastUpdatedDateTime: "2026-01-12 14:52:18" },
      { id: "role-analyst", name: "Analyst", slug: "analyst", creationDateTime: "2025-11-10 10:15:32", lastUpdatedDateTime: "2025-11-28 08:11:05" },
      { id: "role-manager", name: "Manager", slug: "manager", creationDateTime: "2025-11-08 12:30:00", lastUpdatedDateTime: "2026-02-03 09:45:00" },
      { id: "role-viewer", name: "Viewer", slug: "viewer", creationDateTime: "2025-11-05 16:47:20", lastUpdatedDateTime: "2025-11-05 16:47:20" },
      { id: "role-read-only", name: "Read only", slug: "read-only", creationDateTime: "2025-12-01 08:00:00", lastUpdatedDateTime: "2026-04-19 11:20:00" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", required: false },
    ],
  },
};

// Menu/route manifest — drives the IAM sidebar and route generation.
export type IamRoute = { key: string; base: string; hasNew: boolean };
export const IAM_ROUTES: IamRoute[] = [
  { key: "iam-applications", base: "/iam/applications", hasNew: true },
  { key: "iam-users", base: "/iam/users", hasNew: false },
  { key: "iam-accounts", base: "/iam/accounts", hasNew: true },
  { key: "iam-roles", base: "/iam/roles", hasNew: true },
];
