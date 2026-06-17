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

// v3: richer DSM groups/sections (with varied definitions + tabs) for the bulk
// sections editor. Older data under v1/v2 keys is abandoned.
export const DASHBOARD_APPS_KEY = "settings:dashboard-applications:v5";

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

const T = (
  id: string,
  label: string,
  slug: string,
  dashboardId: string,
  description = "",
  filterSet = "",
  lookerId = "",
): DashTab => ({ id, label, slug, description, dashboardId, lookerId, filterSet, panels: [] });

const SEC = (
  id: string,
  path: string,
  label: string,
  type: DashSection["type"],
  definition: DashDefinitionVar[],
  tabs: DashTab[] = [],
  createdAt = "Thu, May 9, 2024 7:50",
  updatedAt = "Mon, Feb 2, 2026 6:20",
): DashSection => ({ id, path, label, type, definition, tabs, createdAt, updatedAt });

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

const DSM_GROUPS: DashGroup[] = [
  G(
    "g-dsm-score",
    "Scorecard",
    "FundViewOutlined",
    [
      SEC(
        "sec-dsm-score",
        "/dsm-visibility/scorecard-lego",
        "Scorecard",
        "BUILT_IN",
        [
          { key: "label", value: "Scorecard" },
          { key: "tab_1", value: "Overview - 0051cba4-fe0f-4134-b22d-9ec2a4a2c979" },
          { key: "tab_4", value: "Campaigns - 351028b8-d4c5-4f44-884e-3b1a9d4dcdd1" },
        ],
        [
          T("tab-dsm-ov", "Overview", "overview", "5d3805bb-c2e3-47af-8d18-7fe9f76dbb72", "# Scorecard --- # Metric Glo", "LegoDSM"),
          T("tab-dsm-camp", "Campaigns", "campaigns", "411e2206-c13b-4487-85a5-3b1a9d4dcdd1", "", "LegoDSM"),
        ],
      ),
    ],
    "Thu, May 9, 2024 7:50",
    "Mon, Feb 2, 2026 6:20",
  ),
  G(
    "g-dsm-vis",
    "Visibility",
    "EyeOutlined",
    [
      SEC(
        "sec-dsm-vis",
        "/dsm-visibility/share-of-search-lego",
        "Share of search",
        "BUILT_IN",
        [
          { key: "label", value: "Visibility" },
          { key: "tab_1", value: "Share of search - 7c1e2206-aa11-4c0e-9d33-22b1a9d4dcdd" },
          { key: "default_metric", value: "sos" },
        ],
        [T("tab-dsm-sos", "Share of search", "share-of-search", "7c1e2206-aa11-4c0e-9d33-22b1a9d4dcdd", "", "LegoDSM")],
      ),
    ],
    "Thu, May 9, 2024 7:50",
    "Mon, Feb 2, 2026 6:20",
  ),
  G(
    "g-dsm-audit",
    "Setup & Audit",
    "FolderOpenOutlined",
    [
      SEC(
        "sec-dsm-audit",
        "/dsm-setup/audit-lego",
        "Setup & Audit",
        "CUSTOM",
        [
          { key: "label", value: "Setup & Audit" },
          { key: "embeddable_id", value: "a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d" },
        ],
        [],
      ),
    ],
    "Thu, May 9, 2024 7:50",
    "Mon, Feb 2, 2026 6:20",
  ),
  G(
    "g-dsm-raw",
    "Raw Data",
    "MonitorOutlined",
    [
      SEC(
        "sec-dsm-raw",
        "/dsm-raw/raw-data-lego",
        "Raw Data",
        "BUILT_IN",
        [
          { key: "label", value: "Raw Data" },
          { key: "export_enabled", value: "true" },
        ],
        [T("tab-dsm-prod", "Products", "products", "9f0a1b2c-3d4e-4f5a-8b6c-7d8e9f0a1b2c", "", "LegoDSM")],
      ),
    ],
    "Thu, May 9, 2024 7:50",
    "Mon, Feb 2, 2026 6:20",
  ),
];

// Category / Brand / Keyword / Item / Audit & Setup are the RMMS dashboard GROUPS;
// each holds its section. (Section ids kept stable so saved positions still resolve.)
const RMMS_TS = "Fri, May 29, 2026 2:18";
const RMMS_GROUPS: DashGroup[] = [
  G("rmms-g-cat", "Category", "PieChartOutlined", [
    SEC("sec-rmms-cat", "/rmms-category", "Category", "BUILT_IN", [{ key: "label", value: "Category" }], [], RMMS_TS, RMMS_TS),
  ], RMMS_TS, RMMS_TS),
  G("rmms-g-brand", "Brand", "LineChartOutlined", [
    SEC("sec-rmms-brand", "/rmms-brand", "Brand", "BUILT_IN", [{ key: "label", value: "Brand" }], [], RMMS_TS, RMMS_TS),
  ], RMMS_TS, RMMS_TS),
  G("rmms-g-kw", "Keyword", "SearchOutlined", [
    SEC("sec-rmms-kw", "/rmms-keyword", "Keyword", "BUILT_IN", [{ key: "label", value: "Keyword" }], [], RMMS_TS, RMMS_TS),
  ], RMMS_TS, RMMS_TS),
  G("rmms-g-item", "Item", "AppstoreOutlined", [
    SEC("sec-rmms-item", "/rmms-item", "Item", "BUILT_IN", [{ key: "label", value: "Item" }], [], RMMS_TS, RMMS_TS),
  ], RMMS_TS, RMMS_TS),
  G("rmms-g-audit", "Audit & Setup", "FolderOpenOutlined", [
    SEC("sec-rmms-audit", "/rmms-audit-setup", "Audit & Setup", "BUILT_IN", [{ key: "label", value: "Audit & Setup" }], [], RMMS_TS, RMMS_TS),
  ], RMMS_TS, RMMS_TS),
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
    RMMS_GROUPS,
  ),
  A("dsm", "Digital Shelf Maestro", "dsm", "Thu, May 9, 2024 7:50", "Mon, Feb 2, 2026 6:20", DSM_GROUPS),
  A("asm", "Amazon Shelf Maestro", "asm", "Thu, May 23, 2024 1:30", "Fri, Mar 27, 2026 1:23"),
  A("odm", "Outlet Distribution Maestro", "odm", "Mon, May 12, 2025 8:00", "Mon, Jun 1, 2026 2:58"),
];

export function getDashboardApps(): DashboardApp[] {
  const list = readPersistedList<DashboardApp>(DASHBOARD_APPS_KEY);
  return list.length ? list : INITIAL_DASHBOARD_APPS;
}
