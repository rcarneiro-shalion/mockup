import { readPersistedList } from "./seedOptions";

// "Scraping Plan" is the renamed job-like hub entity (formerly "Stuff"): it ties one
// or MORE Projects to a list of Seeds, exactly ONE Scrapping option (1:1), and (when
// geoloc is MANUAL) a Location SET, and carries the client-oriented options.

/** Rich recurrence config used when `frequency = "Custom"` (Daily or Weekly base). */
export type CustomSchedule = {
  unit: "Daily" | "Weekly";
  // Daily: run every N days, or several times within a day.
  dailyMode?: "everyNDays" | "timesPerDay";
  everyNDays?: string;   // >= 1
  timesPerDay?: string;  // 1..24
  // Weekly:
  timesPerWeek?: string; // 1..7
  everyNWeeks?: string;  // 1..4 (repeat every N weeks)
  weekdays?: string[];   // which days it runs (Sun..Sat short labels)
  // Ends (both bases):
  ends?: "Never" | "On" | "After";
  endsOn?: string;       // date, when ends = On
  endsAfter?: string;    // occurrences, when ends = After
};

export type ScrapingPlan = {
  id: string;
  name: string;
  projects: string[]; // a scrapingPlan may belong to one OR MANY projects
  /** @deprecated legacy single project — migrated into `projects` on read. */
  project?: string;
  store: string;
  seeds: string[];
  // A scrapingPlan runs exactly ONE scrapping option (1:1). Scrapping options stay
  // reusable — several scrapingPlans may reference the same option by name.
  scrappingOption: string;
  geo: string; // NONE | AUTOMATIC | MANUAL | VIRTUAL_STORE
  locationSet: string;
  // V1/V2 phase: direct location selection (plural "Locations") — same MANUAL-only
  // gating, without the intermediate Location-set entity. v3 keeps locationSet;
  // both fields coexist.
  locations?: string[];
  /** @deprecated Frequency moved to the scrapping option (`ScrappingOptionValues.frequency`). Kept optional for back-compat with persisted data. */
  frequency?: string;
  /** @deprecated frequency config now lives on the scrapping option. */
  frequencyDays?: string;
  /** @deprecated frequency config now lives on the scrapping option. */
  customSchedule?: CustomSchedule;
  /** @deprecated */
  startWeekday?: string;
  /** @deprecated */
  startMonthDay?: string;
  // --- Selection parameters (2026 Task-Generator refactor; REPLACES `rotation`) ---
  // Independent seed/location selection axes mirroring dim_seed_location_selection_params.
  seedSelection: string;       // All seeds | Weekly bucket | Monthly bucket | Stateful freshness
  freshnessWindow?: string;    // Last days | Current week | Current fortnight | Current month — only when seedSelection = Stateful freshness
  lastOfferDays?: string;      // "Days" window — only when freshnessWindow = Last days (migrating order → scrapingPlan)
  locationSelection?: string;  // All locations | Monthly CMI schedule | 1 random per day | N-day rotation — only when geo = AUTOMATIC | MANUAL
  cycleLength?: string;        // N (2..6) — only when locationSelection = N-day rotation
  volumeCap: string;           // Full coverage | Top 10/day | Backfill 1.5×
  /** @deprecated Replaced by the Selection parameters above. Kept optional for back-compat reads. */
  rotation?: string[];
  status?: ScrapingPlanStatus; // Active | Inactive
  businessUnit?: string; // single Business Unit (CMI / FSA / DSM / RMM / MSH / GEN)
  // Shown only when the scrapping option's extraction type is DIGITAL_SHELF_PLP or
  // MEDIA — points to zero, one or many sibling scrapingPlans running a PDP option.
  destinationOptions?: string[];
  /** @deprecated legacy single value — migrated into destinationOptions on read. */
  destinationOption?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Business Units — exactly one may be assigned to a scrapingPlan.
export const BUSINESS_UNITS = ["CMI", "FSA", "DSM", "RMM", "MSH", "GEN"];

export const SCRAPING_PLANS_KEY = "seeds-api:scraping-plans";

export type ScrapingPlanStatus = "Active" | "Inactive";
export const SCRAPING_PLAN_STATUS_OPTIONS: ScrapingPlanStatus[] = ["Active", "Inactive"];

export const SCRAPING_PLAN_GEOLOC_OPTIONS = ["NONE", "AUTOMATIC", "MANUAL", "VIRTUAL_STORE"];

export const INITIAL_SCRAPING_PLANS: ScrapingPlan[] = [
  {
    id: "sub1",
    name: "ME_KW_WATER — Amazon US",
    projects: ["BEA>SHA_Amazon US"],
    store: "Amazon US",
    seeds: ["water"],
    scrappingOption: "ME_KW_WATER — Amazon US",
    geo: "MANUAL",
    locationSet: "Amazon US — All locations",
    seedSelection: "All seeds",
    locationSelection: "All locations",
    volumeCap: "Full coverage",
    status: "Active",
    businessUnit: "CMI",
    createdAt: "Thu, May 2, 2024 3:21",
    updatedAt: "Mon, Oct 27, 2025 1:30",
  },
  {
    id: "sub2",
    name: "PDP_BEAM_US — Amazon US",
    projects: ["Ab Inbev MX"],
    store: "Amazon US",
    seeds: ["coffee"],
    scrappingOption: "PDP_BEAM_US — Amazon US",
    geo: "AUTOMATIC",
    locationSet: "",
    seedSelection: "Stateful freshness",
    freshnessWindow: "Last days",
    lastOfferDays: "14",
    locationSelection: "All locations",
    volumeCap: "Full coverage",
    status: "Active",
    businessUnit: "FSA",
    createdAt: "Fri, May 3, 2024 8:27",
    updatedAt: "Mon, Oct 27, 2025 2:00",
  },
];

export function getScrapingPlans(): ScrapingPlan[] {
  const list = readPersistedList<ScrapingPlan>(SCRAPING_PLANS_KEY);
  return list.length ? list : INITIAL_SCRAPING_PLANS;
}

/** A scrapingPlan's destination options as a list, tolerating legacy records that
 *  only carry the singular `destinationOption`. Zero, one or many PDP siblings. */
export function subDestinationOptions(s: ScrapingPlan): string[] {
  if (s.destinationOptions?.length) return s.destinationOptions;
  return s.destinationOption ? [s.destinationOption] : [];
}

/** A scrapingPlan's rotation as a list, tolerating legacy single-string records:
 *  "Both" → Locations + Seeds; "Zipcode" → Locations; "" → none. */
export function subRotation(s: ScrapingPlan): string[] {
  const r = s.rotation as unknown;
  if (Array.isArray(r)) return r as string[];
  if (typeof r === "string" && r) {
    if (r === "Both") return ["Locations", "Seeds"];
    if (r === "Zipcode") return ["Locations"];
    return [r];
  }
  return [];
}

/** A scrapingPlan's projects as a list, tolerating legacy records that only carry
 *  the singular `project`. One or many. */
export function subProjects(s: ScrapingPlan): string[] {
  if (s.projects?.length) return s.projects;
  return s.project ? [s.project] : [];
}

export function emptyScrapingPlan(): ScrapingPlan {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: "",
    projects: [],
    store: "",
    seeds: [],
    scrappingOption: "",
    geo: "NONE",
    locationSet: "",
    seedSelection: "All seeds",
    freshnessWindow: "Last days",
    lastOfferDays: "14",
    locationSelection: "All locations",
    cycleLength: "",
    volumeCap: "Full coverage",
    status: "Active",
    businessUnit: "",
    destinationOptions: [],
    createdAt: "",
    updatedAt: "",
  };
}
