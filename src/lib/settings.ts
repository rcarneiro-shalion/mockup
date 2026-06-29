import { readPersistedList } from "./seedOptions";

// ---------- Targets ----------
export type SettingTarget = { id: string; name: string; defaultValue: string; createdAt: string; updatedAt: string };
export const TARGETS_KEY = "settings:targets";
const T = (id: string, name: string, defaultValue: string, createdAt: string, updatedAt: string): SettingTarget => ({ id, name, defaultValue, createdAt, updatedAt });
export const INITIAL_TARGETS: SettingTarget[] = [
  T("t1", "description_score_target", "70", "Thu, Oct 26, 2023 3:30 PM", "Thu, Oct 26, 2023 3:30 PM"),
  T("t2", "secondary_image_score_target", "70", "Mon, Nov 18, 2024 11:58 AM", "Mon, Dec 29, 2025 4:21 PM"),
  T("t3", "image_count_target", "3", "Thu, Oct 26, 2023 2:40 PM", "Thu, Oct 26, 2023 2:40 PM"),
  T("t4", "availability_target", "0.9", "Thu, Oct 26, 2023 3:30 PM", "Fri, Oct 27, 2023 8:13 AM"),
  T("t5", "rating_average_target", "4.6", "Thu, Oct 26, 2023 3:29 PM", "Fri, Oct 27, 2023 8:12 AM"),
  T("t6", "outofstock_target", "0.1", "Mon, Oct 23, 2023 9:23 AM", "Fri, Oct 27, 2023 8:13 AM"),
  T("t7", "image_score_target", "70", "Wed, Oct 25, 2023 3:47 PM", "Thu, Oct 26, 2023 3:28 PM"),
  T("t8", "drop_price_alert_threshold", "0.25", "Thu, Oct 26, 2023 2:39 PM", "Fri, Oct 27, 2023 8:12 AM"),
  T("t9", "overprice_threshold", "0.2", "Thu, Oct 26, 2023 3:30 PM", "Fri, Oct 27, 2023 8:13 AM"),
  T("t10", "target_delivery_date", "80", "Wed, May 7, 2025 9:21 AM", "Wed, May 7, 2025 9:21 AM"),
  T("t11", "reviews_number_target", "10", "Thu, Oct 26, 2023 3:29 PM", "Thu, Oct 26, 2023 3:29 PM"),
  T("t12", "bullet_points_score_target", "70", "Thu, Oct 26, 2023 3:30 PM", "Thu, Oct 26, 2023 3:30 PM"),
  T("t13", "promotion_threshold", "0.25", "Thu, Oct 26, 2023 2:39 PM", "Fri, Oct 27, 2023 8:12 AM"),
  T("t14", "max_delivery_date", "10", "Thu, Oct 2, 2025 6:54 AM", "Tue, Nov 11, 2025 12:20 PM"),
  T("t15", "title_score_target", "70", "Thu, Oct 26, 2023 3:31 PM", "Thu, Oct 26, 2023 3:31 PM"),
];

// ---------- Timeframes ----------
export type SettingTimeframe = { id: string; name: string; product: string; group: string; schedule: string; duration: string; frequency: string };
export const SETTINGS_TIMEFRAMES_KEY = "settings:timeframes";
const TF = (id: string, name: string, product: string, group: string, schedule: string, duration: string): SettingTimeframe => ({ id, name, product, group, schedule, duration, frequency: "1" });
export const INITIAL_SETTINGS_TIMEFRAMES: SettingTimeframe[] = [
  TF("tf1", "random_daily_walmart", "CMI", "daily_rnd", "30 18 * * *", "23h 59min"),
  TF("tf2", "top_tier_rest", "FSA", "location_discovery", "11111", "1h 1min"),
  TF("tf3", "CMI3_one_shot_65", "CMI3", "-", "11111", "1h 1min"),
  TF("tf4", "All Day Modality (1 x day) - pickup", "DSM", "daily", "11111", "1h 1min"),
  TF("tf5", "All Day Modality (1 x day) - delivery", "DSM", "daily", "11111", "1h 1min"),
  TF("tf6", "CMI3_one_shot_7", "CMI3", "-", "11111", "1h 1min"),
  TF("tf7", "content - accelerated", "DSM/CMI", "content", "11111", "1h 1min"),
  TF("tf8", "CMI3_one_shot_1", "CMI3", "-", "11111", "1h 1min"),
  TF("tf9", "Generative Search Products (PDP)", "generative_search", "-", "11111", "1h 1min"),
  TF("tf10", "All Day (1 x day) - Coke (9)", "DSM", "daily", "0 0 * * *", "23h 59min"),
  TF("tf11", "content (Nestle POC) - BORRAR", "DSM/CMI", "content", "0 0 15 * *", "23h 59min"),
  TF("tf12", "CMI3_one_shot_57", "CMI3", "-", "11111", "1h 1min"),
  TF("tf13", "marketplace_hourly", "DSM", "marketplace", "11111", "1h 1min"),
  TF("tf14", "CMI3_one_shot_46", "CMI3", "-", "11111", "1h 1min"),
  TF("tf15", "CMI3_one_shot_38", "CMI3", "-", "11111", "1h 1min"),
];

// ---------- Categories ----------
export type SettingCategory = { id: string; sector: string; name: string; description: string; esDescription: string; parent?: string; createdAt: string; updatedAt: string };
export const CATEGORIES_KEY = "settings:categories";
const CT = (id: string, name: string, description: string, esDescription: string, createdAt: string, updatedAt: string): SettingCategory =>
  ({ id, sector: "Automotive", name, description, esDescription, createdAt, updatedAt });
export const INITIAL_CATEGORIES: SettingCategory[] = [
  CT("ct1", "Automotive > Accessories > Exterior", "Car exterior accessories", "Accesorios para exterior del auto", "Mon, Nov 13, 2023 7:00 AM", "Thu, Oct 23, 2025 9:50 AM"),
  CT("ct2", "Automotive > Accessories > Interior", "Car interior accessories, seat belts, car air freshener", "Accesorios para interior del auto, cinturones de seguridad", "Mon, Nov 13, 2023 7:00 AM", "Thu, Jan 23, 2025 12:00 PM"),
  CT("ct3", "Automotive > Accessories > Other", "MOTHER CATEGORY", "CATEGORÍA MADRE", "Mon, Nov 13, 2023 7:00 AM", "Mon, Nov 13, 2023 7:00 AM"),
  CT("ct4", "Automotive > Car Mechanics > Air Conditioning and Heating", "Air conditioning and heating", "Aire acondicionado y calefacción", "Mon, Nov 13, 2023 7:00 AM", "Wed, Apr 17, 2024 9:40 AM"),
  CT("ct5", "Automotive > Car Mechanics > Brakes", "Brakes", "Frenos", "Mon, Nov 13, 2023 7:00 AM", "Wed, Apr 17, 2024 9:50 AM"),
  CT("ct6", "Automotive > Car Mechanics > Chassis", "Vehicle frames", "Chasis", "Mon, Nov 13, 2023 7:00 AM", "Wed, Apr 17, 2024 10:00 AM"),
  CT("ct7", "Automotive > Car Mechanics > Emission and Exhaust", "Emission and exhaust systems", "Sistemas de emisión y escape", "Mon, Nov 13, 2023 7:00 AM", "Wed, Apr 17, 2024 10:00 AM"),
  CT("ct8", "Automotive > Car Mechanics > Other", "MOTHER CATEGORY", "CATEGORÍA MADRE", "Wed, Apr 17, 2024 9:50 AM", "Wed, Apr 17, 2024 9:50 AM"),
  CT("ct9", "Automotive > Car Mechanics > Paint", "Car paint", "Pintura para el auto", "Mon, Nov 13, 2023 7:00 AM", "Wed, Apr 17, 2024 10:00 AM"),
  CT("ct10", "Automotive > Car Mechanics > Shocks", "Shock absorbers", "Amortiguadores", "Mon, Nov 13, 2023 7:00 AM", "Wed, Apr 17, 2024 10:00 AM"),
  CT("ct11", "Automotive > Electricity > Alternators and Starters", "Alternators and starters", "Alternadores y arrancadores", "Mon, Nov 13, 2023 7:00 AM", "Wed, Apr 17, 2024 9:40 AM"),
  CT("ct12", "Automotive > Electricity > Batteries", "Batteries", "Baterías", "Mon, Nov 13, 2023 7:00 AM", "Wed, Apr 17, 2024 9:40 AM"),
  CT("ct13", "Automotive > Electricity > Lighting and Electrical", "Lighting and electricity", "Iluminación y electricidad", "Mon, Nov 13, 2023 7:00 AM", "Wed, Apr 17, 2024 9:50 AM"),
  CT("ct14", "Automotive > Electricity > Other", "MOTHER CATEGORY", "CATEGORÍA MADRE", "Mon, Nov 13, 2023 7:00 AM", "Wed, Apr 17, 2024 9:40 AM"),
  CT("ct15", "Automotive > Filters > Air Filter", "Air filter", "Filtro de aire", "Fri, Oct 27, 2023 7:41 AM", "Fri, Oct 27, 2023 7:41 AM"),
  CT("ct16", "Automotive > Filters > Fuel Filter", "Fuel filter", "Filtro de combustible", "Fri, Oct 27, 2023 7:45 AM", "Fri, Oct 27, 2023 7:45 AM"),
  CT("ct17", "Automotive > Filters > Oil Filter", "Oil filter", "Filtro de aceite", "Fri, Oct 27, 2023 7:41 AM", "Fri, Oct 27, 2023 7:41 AM"),
  CT("ct18", "Automotive > Filters > Other", "MOTHER CATEGORY", "CATEGORÍA MADRE", "Fri, Oct 27, 2023 7:41 AM", "Fri, Oct 27, 2023 7:41 AM"),
];

// ---------- Country groups ----------
export type CountryGroupCountry = { id: string; code: string; createdAt: string; updatedAt: string };
export type CountryGroup = { id: string; name: string; countries?: CountryGroupCountry[]; createdAt: string; updatedAt: string };
// v2: rows gained an optional `countries[]` child array (seeded for Eastern
// Europe). Bumped so the seeded child rows load instead of stale name-only data.
export const COUNTRY_GROUPS_KEY = "settings:country-groups:v2";
const CG = (id: string, name: string, createdAt: string, updatedAt: string): CountryGroup => ({ id, name, createdAt, updatedAt });
const EASTERN_EUROPE_COUNTRIES: CountryGroupCountry[] = [
  "EE", "LV", "CY", "BG", "LT", "SK", "ME", "HU", "GR", "RO", "HR", "SI", "RS", "MT", "MK", "RU", "CZ", "UA",
].map((code, i) => ({ id: `eec${i}`, code, createdAt: "Fri, May 2, 2025 1:34 PM", updatedAt: "Fri, May 2, 2025 1:34 PM" }));
export const INITIAL_COUNTRY_GROUPS: CountryGroup[] = [
  CG("cg1", "KO EME", "Fri, Oct 3, 2025 7:52 AM", "Fri, Oct 3, 2025 7:52 AM"),
  { ...CG("cg2", "Eastern Europe (oficial)", "Fri, May 2, 2025 1:27 PM", "Fri, May 2, 2025 1:27 PM"), countries: EASTERN_EUROPE_COUNTRIES },
  CG("cg3", "MENA (oficial)", "Thu, Apr 17, 2025 10:48 AM", "Fri, May 2, 2025 1:38 PM"),
  CG("cg4", "LATAM (oficial)", "Mon, Feb 24, 2025 2:32 PM", "Fri, May 2, 2025 1:26 PM"),
  CG("cg5", "KO ASEAN", "Fri, Oct 3, 2025 7:36 AM", "Fri, Oct 3, 2025 7:36 AM"),
  CG("cg6", "KO AFRICA", "Fri, Oct 3, 2025 7:52 AM", "Fri, Oct 3, 2025 7:52 AM"),
  CG("cg7", "Asia", "Thu, Apr 17, 2025 10:48 AM", "Thu, Apr 17, 2025 10:48 AM"),
  CG("cg8", "Oceania", "Thu, Apr 17, 2025 10:48 AM", "Thu, Apr 17, 2025 10:48 AM"),
  CG("cg9", "KO LATAM", "Mon, Sep 29, 2025 7:53 AM", "Fri, Oct 3, 2025 7:32 AM"),
  CG("cg10", "Test 1", "Tue, Dec 10, 2024 1:58 PM", "Tue, Dec 10, 2024 1:58 PM"),
  CG("cg11", "North America (oficial)", "Fri, May 2, 2025 1:29 PM", "Fri, May 2, 2025 1:29 PM"),
  CG("cg12", "KO NAOU", "Fri, Oct 3, 2025 7:51 AM", "Fri, Oct 3, 2025 7:51 AM"),
  CG("cg13", "Europe", "Thu, Apr 17, 2025 10:48 AM", "Fri, May 2, 2025 1:26 PM"),
  CG("cg14", "America", "Thu, Apr 17, 2025 10:48 AM", "Thu, Apr 17, 2025 10:48 AM"),
  CG("cg15", "Western Europe (oficial)", "Fri, May 2, 2025 1:27 PM", "Fri, May 2, 2025 1:27 PM"),
  CG("cg16", "APAC (oficial)", "Fri, May 2, 2025 1:27 PM", "Fri, May 2, 2025 1:27 PM"),
  CG("cg17", "KO EUROPE", "Fri, Oct 3, 2025 7:39 AM", "Fri, Oct 3, 2025 7:39 AM"),
  CG("cg18", "Africa (oficial)", "Fri, May 2, 2025 1:40 PM", "Fri, May 2, 2025 1:40 PM"),
  CG("cg19", "KO APAC", "Fri, Oct 3, 2025 7:40 AM", "Fri, Oct 3, 2025 7:40 AM"),
];

// ---------- Rules ----------
export type RuleRef = { id: string; name: string; createdAt: string; updatedAt: string };
export type SettingRule = {
  id: string; name: string; prompt: string; client: string; datagroup: string;
  isVerified?: boolean; scope?: RuleRef[]; dashboardApps?: RuleRef[]; createdAt: string; updatedAt: string;
};
// v2: rows gained isVerified / scope[] / dashboardApps[]. Bumped so the seeded
// isVerified flags load instead of stale rows missing the field.
export const RULES_KEY = "settings:rules:v2";
const RL = (id: string, name: string, prompt: string, client: string, datagroup: string, createdAt: string, updatedAt: string): SettingRule =>
  ({ id, name, prompt, client, datagroup, isVerified: true, scope: [], dashboardApps: [], createdAt, updatedAt });
export const INITIAL_RULES: SettingRule[] = [
  RL("r1", "Query Builder RMM", "+ Ignore everything related to brand_status, own_brand, competitors and similar; even if the user asks for it.", "", "", "Tue, May 26, 2026 2:00 PM", "Fri, Jun 5, 2026 9:48 AM"),
  RL("r2", "Query Builder DSM/ASM", "+ Always select variables containing '_own_' in the query when the user asks for own data.", "", "", "Tue, Apr 28, 2026 9:20 AM", "Thu, May 14, 2026 3:00 PM"),
  RL("r3", "Query Builder ODM - Extra Period Type", "FORTNIGHT RULES (period_type = fortnight): + select fortnight as period type.", "Coca Cola", "Coca Cola Latam", "Thu, May 14, 2026 3:50 PM", "Fri, Jun 5, 2026 3:50 PM"),
  RL("r4", "KO meaning", "+ KO means manufacturer_name The Coca-Cola Company.", "Coca Cola", "", "Tue, Apr 14, 2026 1:29 PM", "Wed, May 13, 2026 7:00 PM"),
  RL("r5", "Query Builder CMI", "+ When someone asks for the 'a measure in some categories' use the codified category.", "", "", "Tue, Apr 28, 2026 9:20 AM", "Tue, May 26, 2026 2:00 PM"),
  RL("r6", "Query Builder ODM", "+ When and only if the user asks for restaurant (or branches) data, use the ODM cubes.", "", "", "Thu, Apr 30, 2026 1:50 PM", "Fri, Jun 5, 2026 3:50 PM"),
  RL("r7", "RMM/CMI/ASM/DSM Insights Extra Context", "+ Never mix products (SKUs, titles, ...) with placements.", "", "", "Thu, May 21, 2026 9:00 AM", "Thu, May 21, 2026 9:00 AM"),
];

// ---------- Subscription types ----------
// The catalog of subscription types (e.g. Select Assortment, Matching) referenced when
// editing a subscription. Maintained from Settings › Subscription type.
export type SettingSubscriptionType = { id: string; name: string; description: string; createdAt: string; updatedAt: string };
export const SUBSCRIPTION_TYPES_KEY = "settings:subscription-types";
const ST = (id: string, name: string, description: string, createdAt: string, updatedAt: string): SettingSubscriptionType =>
  ({ id, name, description, createdAt, updatedAt });
export const INITIAL_SUBSCRIPTION_TYPES: SettingSubscriptionType[] = [
  ST("sub-sa", "Select Assortment (SA)", "Selected Assortment (also sometimes called Selected Items) shows the status of the client products in online retailers.", "Thu, Oct 26, 2023 3:30 PM", "Thu, Oct 26, 2023 3:30 PM"),
  ST("sub-mag", "Matching (MAG)", "Matching identifies which products extracted from online retailers correspond to the client's own catalog — codifying their attributes (brand, size, flavour, …) so each listing is linked to the right product, which makes price, naming and image tracking comparable across retailers.", "Mon, Nov 18, 2024 11:58 AM", "Mon, Dec 29, 2025 4:21 PM"),
  ST("sub-geo", "GEO", "Category scraping in geolocation mode (automatic), all from store.", "Mon, Jan 13, 2025 9:00 AM", "Mon, Jan 13, 2025 9:00 AM"),
  ST("sub-se", "Search (SE)", "Search by keywords used to identify new products.", "Mon, Jan 13, 2025 9:05 AM", "Mon, Jan 13, 2025 9:05 AM"),
  ST("sub-me", "Media (ME)", "A new approach that joins Ads + Search + Shelf.", "Mon, Jan 13, 2025 9:10 AM", "Mon, Jan 13, 2025 9:10 AM"),
  ST("sub-plp", "Product Listing Page (PLP)", "Digital-shelf scraping of product listing / category pages.", "Wed, Jan 15, 2025 10:00 AM", "Wed, Jan 15, 2025 10:00 AM"),
  ST("sub-pdp", "Product Detail Page (PDP)", "Digital-shelf scraping of individual product detail pages, fed by discovery.", "Wed, Jan 15, 2025 10:05 AM", "Wed, Jan 15, 2025 10:05 AM"),
  ST("sub-ad", "Advertising (AD)", "Scraping of sponsored / advertising placements.", "Wed, Jan 15, 2025 10:10 AM", "Wed, Jan 15, 2025 10:10 AM"),
  ST("sub-sh", "Shelf (SH)", "Shelf scraping of a retailer's listings (URL / API).", "Wed, Jan 15, 2025 10:15 AM", "Wed, Jan 15, 2025 10:15 AM"),
];

function read<T>(key: string, initial: T[]): T[] {
  const list = readPersistedList<T>(key);
  return list.length ? list : initial;
}
export const getTargets = () => read(TARGETS_KEY, INITIAL_TARGETS);
export const getSettingsTimeframes = () => read(SETTINGS_TIMEFRAMES_KEY, INITIAL_SETTINGS_TIMEFRAMES);
export const getCategories = () => read(CATEGORIES_KEY, INITIAL_CATEGORIES);
export const getCountryGroups = () => read(COUNTRY_GROUPS_KEY, INITIAL_COUNTRY_GROUPS);
export const getRules = () => read(RULES_KEY, INITIAL_RULES);
export const getSubscriptionTypes = () => read(SUBSCRIPTION_TYPES_KEY, INITIAL_SUBSCRIPTION_TYPES);
