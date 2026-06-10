export const STORE_OPTIONS = [
  "Amazon US",
  "Walmart US",
  "Target US",
  "Kroger US",
];

export const GEOLOC_OPTIONS = ["NO_GEOLOC", "AUTOMATIC", "MANUAL"];

export const CATEGORY_OPTIONS = [
  "Pantry > Chocolate > Chocolate Boxes",
  "Beverages > Waters > Other",
  "Pantry > Coffee > Beans",
  "Beauty > Hair Care > Shampoo",
  "Others",
];

export const BUSINESS_UNIT_OPTIONS = [
  "Select a value",
  "CMI",
  "FSA",
  "DSM",
  "RMM",
  "MSH",
  "GEN",
];

export const EXTRACTION_TYPE_OPTIONS = [
  "SEARCH",
  "SHELF",
  "AD",
  "DIGITAL_SHELF_PLP",
  "DIGITAL_SHELF_PDP",
  "MEDIA",
];

export const CLIENT_OPTIONS = [
  "Coca cola",
  "Nestlé",
  "Pepsico",
  "Lego",
  "De Longhi",
  "Dentsu",
  "Samsumg",
  "Bayer",
  "AB Inbev",
  "Unilever",
];

export const SEED_FREQUENCY_OPTIONS = [
  "NO_ROTATE_DAILY",
  "ROTATE_WEEKLY",
  "ROTATE_MONTHLY",
];

export const LOCATION_FREQUENCY_OPTIONS = ["NO_ROTATE_DAILY", "ROTATE_MONTHLY"];

export function readPersistedList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}