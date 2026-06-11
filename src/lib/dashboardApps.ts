import { readPersistedList } from "./seedOptions";

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
  tabs: DashTab[];
  createdAt: string;
  updatedAt: string;
};
export type DashGroup = {
  id: string;
  label: string;
  icon: string;
  sections: DashSection[];
  createdAt: string;
  updatedAt: string;
};
export type DashboardApp = {
  id: string;
  label: string;
  slug: string;
  isMaestroEnabled?: boolean;
  groups: DashGroup[];
  createdAt: string;
  updatedAt: string;
};

// v2: nested groups/sections/tabs schema (old flat data under the v1 key is abandoned).
export const DASHBOARD_APPS_KEY = "settings:dashboard-applications:v2";

/** Timestamp stamped onto created/updated fields when editing in-memory. */
export const nowStamp = () => new Date().toDateString();

const SECTION_BENCHMARK_BRAND: DashSection = {
  id: "sec-bb",
  path: "/msm/benchmark-brand",
  label: "Benchmark-Brand",
  type: "CUSTOM",
  definition: [{ key: "embeddable_id", value: "29545e16-bfba-4a9d-ac31-9667c8335f87" }],
  tabs: [],
  createdAt: "Fri, Jun 5, 2026 9:26",
  updatedAt: "Fri, Jun 5, 2026 9:26",
};

const G = (
  id: string,
  label: string,
  icon: string,
  sections: DashSection[],
  createdAt: string,
  updatedAt: string,
): DashGroup => ({ id, label, icon, sections, createdAt, updatedAt });

const MSM_GROUPS: DashGroup[] = [
  G(
    "g-bb",
    "Benchmark-Brand",
    "DatabaseOutlined",
    [SECTION_BENCHMARK_BRAND],
    "Fri, Jun 5, 2026 9:26",
    "Fri, Jun 5, 2026 9:26",
  ),
  G(
    "g-bs",
    "Benchmark-SKUs",
    "FundViewOutlined",
    [],
    "Tue, Jun 2, 2026 7:01",
    "Tue, Jun 2, 2026 8:15",
  ),
  G(
    "g-cn",
    "Category New",
    "PieChartOutlined",
    [],
    "Tue, Jun 2, 2026 6:56",
    "Tue, Jun 2, 2026 6:56",
  ),
  G("g-bn", "Brand New", "LineChartOutlined", [], "Mon, Jun 1, 2026 3:30", "Tue, Jun 2, 2026 8:14"),
  G("g-ss", "Single SKU", "MonitorOutlined", [], "Tue, Jun 2, 2026 7:04", "Tue, Jun 2, 2026 8:15"),
];

const RMM_GROUPS: DashGroup[] = [
  G(
    "rg-cat",
    "Category",
    "FundViewOutlined",
    [],
    "Fri, Apr 17, 2026 9:45",
    "Thu, Apr 30, 2026 2:10",
  ),
  G("rg-item", "Item", "FundViewOutlined", [], "Fri, Apr 17, 2026 2:18", "Thu, Apr 30, 2026 2:10"),
  G("rg-kw", "Keyword", "FundViewOutlined", [], "Fri, Apr 17, 2026 2:09", "Thu, Apr 30, 2026 2:20"),
  G(
    "rg-brand",
    "Brand",
    "FundViewOutlined",
    [],
    "Fri, Apr 17, 2026 1:53",
    "Thu, Apr 30, 2026 2:20",
  ),
];

const A = (
  id: string,
  label: string,
  slug: string,
  createdAt: string,
  updatedAt: string,
  groups: DashGroup[] = [],
): DashboardApp => ({ id, label, slug, isMaestroEnabled: true, groups, createdAt, updatedAt });

export const INITIAL_DASHBOARD_APPS: DashboardApp[] = [
  A(
    "msm",
    "Market Share Maestro",
    "msm",
    "Mon, Jun 1, 2026 11:42",
    "Mon, Jun 1, 2026 12:01",
    MSM_GROUPS,
  ),
  A("cmi", "CMI", "cmi", "Wed, Jan 7, 2026 3:30", "Fri, Apr 17, 2026 9:52"),
  A(
    "rmm",
    "Retail Media Maestro",
    "rmm",
    "Fri, Apr 17, 2026 9:16",
    "Thu, May 21, 2026 4:00",
    RMM_GROUPS,
  ),
  A(
    "rmms",
    "Retail Media Maestro Stretch",
    "rmms",
    "Fri, May 29, 2026 2:18",
    "Fri, May 29, 2026 2:18",
  ),
  A("dsm", "Digital Shelf Maestro", "dsm", "Thu, May 9, 2024 7:50", "Mon, Feb 2, 2026 6:20"),
  A("asm", "Amazon Shelf Maestro", "asm", "Thu, May 23, 2024 1:30", "Fri, Mar 27, 2026 1:23"),
  A("odm", "Outlet Distribution Maestro", "odm", "Mon, May 12, 2025 8:00", "Mon, Jun 1, 2026 2:58"),
];

export function getDashboardApps(): DashboardApp[] {
  const list = readPersistedList<DashboardApp>(DASHBOARD_APPS_KEY);
  return list.length ? list : INITIAL_DASHBOARD_APPS;
}
