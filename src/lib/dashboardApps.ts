import { readPersistedList } from "./seedOptions";

export type DashboardApp = {
  id: string;
  label: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export const DASHBOARD_APPS_KEY = "settings:dashboard-applications";

export const INITIAL_DASHBOARD_APPS: DashboardApp[] = [
  { id: "msm", label: "Market Share Maestro", slug: "msm", createdAt: "Mon, Jun 1, 2026 11:42", updatedAt: "Mon, Jun 1, 2026 12:01" },
  { id: "cmi", label: "CMI", slug: "cmi", createdAt: "Wed, Jan 7, 2026 3:30", updatedAt: "Fri, Apr 17, 2026 9:52" },
  { id: "rmm", label: "Retail Media Maestro", slug: "rmm", createdAt: "Fri, Apr 17, 2026 9:16", updatedAt: "Thu, May 21, 2026 4:00" },
  { id: "rmms", label: "Retail Media Maestro Stretch", slug: "rmms", createdAt: "Fri, May 29, 2026 2:18", updatedAt: "Fri, May 29, 2026 2:18" },
  { id: "dsm", label: "Digital Shelf Maestro", slug: "dsm", createdAt: "Thu, May 9, 2024 7:50", updatedAt: "Mon, Feb 2, 2026 6:20" },
  { id: "asm", label: "Amazon Shelf Maestro", slug: "asm", createdAt: "Thu, May 23, 2024 1:30", updatedAt: "Fri, Mar 27, 2026 1:23" },
  { id: "odm", label: "Outlet Distribution Maestro", slug: "odm", createdAt: "Mon, May 12, 2025 8:00", updatedAt: "Mon, Jun 1, 2026 2:58" },
];

export function getDashboardApps(): DashboardApp[] {
  const list = readPersistedList<DashboardApp>(DASHBOARD_APPS_KEY);
  return list.length ? list : INITIAL_DASHBOARD_APPS;
}
