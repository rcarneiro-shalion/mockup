import { readPersistedList } from "./seedOptions";
import { EMPTY_SCRAPPING_OPTION, type ScrappingOptionValues } from "@/components/seeds/ScrappingOptionDialog";

// Single source of truth for the Scrapping options store, so any reader (the
// Scrapping options page, the Subscription form picker, the planner) gets the
// seed data even before the page that owns the grid has been visited.
export const SCRAPPING_OPTIONS_KEY = "seeds-api:scrapping-options";

export const INITIAL_SCRAPPING_OPTIONS: ScrappingOptionValues[] = [
  {
    ...EMPTY_SCRAPPING_OPTION,
    name: "ME_KW_WATER — Amazon US",
    extractionType: "MEDIA",
    multivariants: true,
    createdAt: "Thu, May 2, 2024 3:21",
    updatedAt: "Mon, Oct 27, 2025 1:30",
  },
  {
    ...EMPTY_SCRAPPING_OPTION,
    name: "PDP_BEAM_US — Amazon US",
    extractionType: "DIGITAL_SHELF_PDP",
    pagination: true,
    maxPage: "10",
    sorting: true,
    sort: "best_seller",
    createdAt: "Fri, May 3, 2024 8:27",
    updatedAt: "Mon, Oct 27, 2025 2:00",
  },
];

export function getScrappingOptions(): ScrappingOptionValues[] {
  const list = readPersistedList<ScrappingOptionValues>(SCRAPPING_OPTIONS_KEY);
  return list.length ? list : INITIAL_SCRAPPING_OPTIONS;
}
