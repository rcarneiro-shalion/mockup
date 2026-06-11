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

// ---- Extra content used by the full in-app Dashboard manual ----------------

export const DASHBOARD_OVERVIEW: string[] = [
  "Ecometry, Data Collector and IAM are the internal stack that sets up and governs data extraction. The extracted data then runs through a large transformation pipeline (dbt models) that computes every KPI and measure, and the results are presented to clients in the dashboards (the dashboard-frontend product).",
  "Dashboards are not hard-coded: they are assembled from configuration that lives in Ecometry. Two surfaces matter — Settings → Dashboard applications (the structure of each dashboard) and Clients → Data groups → Dashboard sections (which dashboards a given client can open). This manual explains the products that consume that configuration and the rules that govern it.",
];

export const DASHBOARD_SECTION_CATALOGUE: { name: string; items: string[] }[] = [
  { name: "Category", items: ["Overview", "Availability", "Price & Promos", "Rating & Reviews", "Content", "Historical Analysis", "New products"] },
  { name: "Selected Items", items: ["Overview", "Assortment", "Availability", "Price", "Rating & Reviews", "Perfect Store", "Image validation", "Raw Data", "Adhocs"] },
  { name: "Discovery", items: ["New Products", "Availability", "Price & Promos"] },
  { name: "Visibility", items: ["Overview", "Ads", "Search", "Shelf", "Promotions"] },
  { name: "Geoloc", items: ["Overview", "Product", "Raw Data"] },
  { name: "Marketplace", items: ["Products", "Sellers", "1P3P"] },
];

export const DASHBOARD_CREATION_STEPS: { title: string; text: string }[] = [
  { title: "Request", text: "A ticket from Customer Success, a client, Product or Sales captures the business context, goal, priority and main KPIs." },
  { title: "Mockup", text: "An initial mockup is built (in Lovable) following the storytelling, visualization and hierarchy standards." },
  { title: "First validation", text: "Reviewed with the Product Owner and Product Manager before any build." },
  { title: "Build", text: "Built in Embeddable, validating large and small screens and coordinating dataset/filter needs with Frontend early." },
  { title: "Internal release & pilot", text: "Released behind Shalion-only visibility, then piloted with one large and one small client (e.g. Danone ES, Coca-Cola LATAM) to validate filters, data volume, performance and visualization." },
  { title: "Visualization review", text: "A second Product/Visualization member reviews the visualization." },
  { title: "Data QA", text: "Data validated via the Cube Playground, Snowflake queries and filter checks." },
  { title: "Final approval", text: "Signed off by the Project Owner and Product Manager before going live." },
];

export const DASHBOARD_PIPELINE: string[] = [
  "All dashboard configuration originates in Ecometry and is replicated (via Airbyte) into Snowflake staging models: dashboard application, group and section, plus the data-group, retailer and cube bindings.",
  "dbt builds the marts (e.g. market share, digital shelf) and tags each row with its data group and dashboard type, so dashboards can slice the data correctly.",
  "A cube's dashboard type acts as a domain boundary — cubes are only queryable by data groups of the same domain.",
  "A section's type decides which visualization engine renders it; new dashboard + data-group + cube combinations need no code change, only configuration.",
];
