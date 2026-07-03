import { useState } from "react";
import { readPersistedList } from "./seedOptions";
import { DASHBOARD_APPS_BULK } from "./dashboardAppsBulk";

export type DashTabPanel = { id: string; label: string; slug: string; dashboardId: string };
export type DashTab = {
  id: string;
  label: string;
  slug: string;
  description: string;
  dashboardId: string;
  lookerId: string;
  filterSet: string;
  panels: DashTabPanel[];
};
export type DashDefinitionVar = { key: string; value: string };
export type DashSection = {
  id: string;
  path: string;
  label: string;
  type: "BUILT_IN" | "CUSTOM";
  definition: DashDefinitionVar[];
  // Raw `section_config` jsonb as a JSON string ("" / absent when the row has none).
  // In the real model the section's tabs live inside this jsonb (SectionConfig.tabs);
  // the mockup also keeps them parsed on `tabs` for editing.
  sectionConfig?: string;
  // `label_translation` jsonb — locale code → translated label (e.g. { es, pt }).
  labelTranslation?: Record<string, string>;
  tabs: DashTab[];
  createdAt: string;
  updatedAt: string;
};
export type DashGroup = {
  id: string;
  label: string;
  icon: string;
  labelTranslation?: Record<string, string>;
  sections: DashSection[];
  createdAt: string;
  updatedAt: string;
};
export type DashboardApp = {
  id: string;
  label: string;
  slug: string;
  isMaestroEnabled?: boolean;
  labelTranslation?: Record<string, string>;
  groups: DashGroup[];
  createdAt: string;
  updatedAt: string;
};

// v7: labelTranslation (jsonb) samples for the Sections editor's raw jsonb
// columns + detail modal. Older data under previous keys is abandoned.
export const DASHBOARD_APPS_KEY = "settings:dashboard-applications:v7";

/** Timestamp stamped onto created/updated fields when editing in-memory. */
export const nowStamp = () => new Date().toDateString();

// The dashboard-application hierarchy is seeded from the REAL production dumps
// (7 apps / 132 groups / 690 sections) in dashboardAppsBulk.ts. It is ~2.3 MB, far
// too large to persist per app version, so it lives in the bundle and edits are held
// in module memory for the session only (see useDashboardApps) — never localStorage.
export const INITIAL_DASHBOARD_APPS: DashboardApp[] = DASHBOARD_APPS_BULK;

// Session-only store shared across the dashboard-application pages: edits survive
// navigation within a page load (module memory) but are NOT persisted (budget) and
// reset on reload / version switch. Live 'Save' in the editors still writes to the API.
// Mirrors the read-only bulk-overlay rule used for projects/seeds.
let sessionApps: DashboardApp[] | null = null;
export function useDashboardApps() {
  const [apps, setAppsState] = useState<DashboardApp[]>(() => sessionApps ?? getDashboardApps());
  const setApps = (u: DashboardApp[] | ((p: DashboardApp[]) => DashboardApp[])): void =>
    setAppsState((prev) => {
      const next = typeof u === "function" ? (u as (p: DashboardApp[]) => DashboardApp[])(prev) : u;
      sessionApps = next;
      return next;
    });
  return [apps, setApps] as const;
}

export function getDashboardApps(): DashboardApp[] {
  const list = readPersistedList<DashboardApp>(DASHBOARD_APPS_KEY);
  return list.length ? list : INITIAL_DASHBOARD_APPS;
}
