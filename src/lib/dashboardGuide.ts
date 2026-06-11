// ---------------------------------------------------------------------------
// Dashboard guide — the Maestro products and how the configuration done in
// Ecometry drives what clients see in the dashboard (dashboard-frontend).
// Sourced from the Notion product/Maestro/Viz docs + console-frontend,
// visualization-api, dbt-models and dashboard-frontend.
// ---------------------------------------------------------------------------

export type DashboardProduct = {
  code: string;
  name: string;
  tagline: string;
  measures: string;
  dashboards: string[];
};

export const DASHBOARD_PRODUCTS: DashboardProduct[] = [
  {
    code: "MSM",
    name: "Market Share Maestro",
    tagline: "Estimated brand & SKU market share in digital retailers.",
    measures:
      "Market share (sales & units), visibility, conversion, assortment, 1P/3P split and promotions — from the whole market down to a single product.",
    dashboards: ["Brand", "Category", "Benchmark Brands", "Benchmark SKUs", "Single SKU"],
  },
  {
    code: "RMM",
    name: "Retail Media Maestro",
    tagline: "Retail-media performance: share of voice, ads and keywords.",
    measures:
      "Market share, weighted Share of Voice (organic vs paid), keyword coverage & gaps, ad presence and competitors. Data is fully syndicated per retailer (sold whole, not by single category).",
    dashboards: ["Brand", "Category", "Keyword", "Item"],
  },
  {
    code: "RMMS",
    name: "Retail Media Maestro Stretch",
    tagline: "An extended Retail Media Maestro variant (documented alongside CMI).",
    measures: "Retail-media metrics over a broader/stretched scope; configured like RMM.",
    dashboards: ["Brand", "Category", "Keyword", "Item"],
  },
  {
    code: "CMI",
    name: "Commerce Marketing Intelligence",
    tagline: "Search, visibility & content tracking across retailers — the original measurement product.",
    measures:
      "Search & visibility share, content quality and competitive presence. The CMI3 variant relaxes the category context filter.",
    dashboards: ["Overview", "Search", "Shelf", "Visibility", "Promotions"],
  },
  {
    code: "DSM",
    name: "Digital Shelf Maestro",
    tagline: "Digital-shelf health across retailers.",
    measures:
      "Range / assortment & availability, content quality, share of voice and custom scorecards.",
    dashboards: ["Range", "Content", "Share of Voice", "Custom Scorecards"],
  },
  {
    code: "ASM",
    name: "Amazon Shelf Maestro",
    tagline: "Digital Shelf Maestro focused on Amazon.",
    measures: "The DSM digital-shelf metrics scoped to Amazon.",
    dashboards: ["Range", "Content", "Share of Voice"],
  },
  {
    code: "ODM",
    name: "Outlet Distribution Maestro",
    tagline: "Distribution & menu presence across food-delivery / outlet platforms.",
    measures:
      "Restaurant & product matching, combos and add-ons, distribution and pricing across delivery apps (e.g. Uber Eats, DoorDash). Used by Coca-Cola and Red Bull.",
    dashboards: ["Overview", "Product", "Raw Data"],
  },
];

export type GuideGroup = { category: string; rules: string[] };

export const DASHBOARD_CONFIG_GROUPS: GuideGroup[] = [
  {
    category: "Where you configure it",
    rules: [
      "Dashboards are configured in Ecometry in two places: Settings → Dashboard applications (the structure) and Clients → Data groups → Dashboard sections (who sees what).",
      "All this configuration flows out of Ecometry, through the dbt transformation pipeline, into the client dashboards (dashboard-frontend).",
    ],
  },
  {
    category: "What builds a dashboard",
    rules: [
      "A dashboard application contains dashboard groups → sections → tabs → panels.",
      "Each section is Built-in or Custom; a Custom section needs at least one definition entry (for example a Looker or embeddable id).",
      "Each tab points to one dashboard by id — either a Looker id or an Embeddable UUID. Looker tabs have no panels; only Embeddable tabs may have panels (and panels are optional).",
      "A tab can name a filter set (e.g. \"Range_Basic\") that decides which filters appear on it; leave it empty for no filters.",
      "Position/order fields set the order of applications, groups and sections; labels can be translated per language.",
    ],
  },
  {
    category: "What a client sees (data groups)",
    rules: [
      "A client's data group decides which sections and applications open for them — sections are assigned to the data group (with an order), and whole section groups can be assigned at once.",
      "A data group is typed BRAND or AGENCY: BRAND attaches sections directly; AGENCY attaches sections per retailer, so each retailer can surface different dashboards.",
      "The data group lists the countries and retailers it can access — that scopes everything the client can open.",
      "A data group can't be deleted while it is still used (by users, dashboard sections, targets, store-extraction types or categories).",
    ],
  },
  {
    category: "The data behind it (cubes, rules, scopes)",
    rules: [
      "Cubes are the analytics datasets (e.g. Sales, Share of Shelf); each is bound to a data group, which decides what data a dashboard can query.",
      "Rules are Maestro-AI prompt instructions; they apply globally or to a specific client/data group, only verified rules are used, and scopes narrow when each rule applies.",
    ],
  },
  {
    category: "Filters & access at view time",
    rules: [
      "Agency dashboards force country + retailer filters from the page (plus category, except the CMI3 app); Brand dashboards add no mandatory context filters.",
      "Filters and data are scoped per client + data group + user and enforced server-side, so a client can never see data outside its data group.",
    ],
  },
  {
    category: "Client enablement",
    rules: [
      "The Category and Discovery section sets are mutually exclusive — clients get Category by default; Beauty and Toys clients get Discovery instead.",
    ],
  },
];
