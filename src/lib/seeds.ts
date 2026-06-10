import { nowStamp } from "./clients";

export type SeedType = "URL" | "API" | "KEYWORD";

// Field names d/store/cat/c/u are kept for backward compatibility (e.g. the
// Subscriptions seed dropdown reads `.d`). New type-aware fields are optional.
export type Seed = {
  id: string;
  d: string; // description
  store: string;
  cat: string; // category
  c: string; // created at
  u: string; // updated at
  type?: SeedType;
  isQa?: boolean;
  discoveryKey?: string;
  pageType?: string;
  value?: string; // the URL / keyword / API origin, depending on type
};

export const SEEDS_KEY = "seeds-api:seeds";

export const INITIAL_SEEDS: Seed[] = [
  { id: "s1", d: "chocolate", store: "Walmart US", cat: "Pantry > Chocolate > Choco...", c: "2025-04-25, 11:11:33", u: "2025-04-25, 11:11:33", type: "KEYWORD" },
  { id: "s2", d: "water", store: "Amazon US", cat: "Beverages > Waters > Other", c: "2026-06-08, 16:03:09", u: "2026-06-08, 16:03:09", type: "KEYWORD" },
  { id: "s3", d: "coffee", store: "Amazon US", cat: "Pantry > Coffee > Beans", c: "2026-01-30, 13:41:14", u: "2026-01-30, 13:41:14", type: "KEYWORD" },
  { id: "s4", d: "Milk", store: "Walmart US", cat: "Pantry > Coffee > Beans", c: "2026-01-30, 13:42:59", u: "2026-06-09, 10:00:00", type: "URL" },
  { id: "s5", d: "sample of keyword", store: "Walmart Mismo Dia MX", cat: "Beauty > Hair Care > Sham...", c: "2026-04-27, 12:43:10", u: "2026-04-27, 12:43:10", type: "KEYWORD" },
];

// Label for the type-specific value field.
export function seedValueLabel(type: SeedType): string {
  switch (type) {
    case "URL": return "Url";
    case "API": return "API origin";
    case "KEYWORD": return "Keyword";
  }
}

export function emptySeed(type: SeedType): Seed {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    d: "",
    store: "",
    cat: "",
    c: nowStamp(),
    u: nowStamp(),
    type,
    isQa: false,
    discoveryKey: "",
    pageType: "",
    value: "",
  };
}
