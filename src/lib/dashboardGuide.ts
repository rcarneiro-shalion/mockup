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
    category: "Brand vs Agency dashboards",
    rules: [
      "A data group is typed Brand or Agency, and the type decides how dashboard sections are attached and how the client is scoped.",
      "Brand — sections are attached directly to the data group (Clients → Data groups → Dashboard sections), giving one consolidated view across the client's scope, with no forced retailer filter. Used for brand-scoped products (e.g. Market Share, Digital Shelf or CMI for a single brand).",
      "Agency — sections are attached per retailer (Retailers → Dashboard sections), so each retailer can surface different dashboards and the client picks a retailer to view it. It is \"Agency\" precisely because retailers differ. Used by Retail Media (RMM / RMMS), where data is syndicated and sold per retailer.",
      "To set up a Brand dashboard: in the client's data group, assign the dashboard sections (and whole section groups) it should expose, give them an order, and set the countries it covers — those become the dashboards the client can open.",
      "To set up an Agency dashboard: open each retailer and define its Dashboard sections (which dashboards that retailer surfaces); the agency client then sees, per retailer, the sections configured on that retailer.",
      "Why an Agency dashboard needs a client-retailer-tag: Agency views force a country + retailer filter, so the client must be linked to the retailers (and their categories) it is entitled to. The client-retailer-tag defines those retailer & category options and feeds the dashboard's retailer and category filters — without it the Agency dashboard has no retailers to scope to.",
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

// Backend services the client dashboard (dashboard-frontend) queries, and for what.
export const DASHBOARD_DATA_SOURCES: { api: string; via: string; calls: string[] }[] = [
  {
    api: "Visualization API",
    via: "the dashboard config + data groups + Looker",
    calls: [
      "The dashboard application structure — applications, groups, sections, tabs, panels (/dashboardapplications).",
      "Which sections a client opens: Brand sections for their data group (/datagroup-dashboardsections) and Agency sections per retailer (/retailers/{id}/retailer-dashboardsections).",
      "The signed-in user, their data groups and the active one (/user-info, /datagroups, /user-info/datagroups/{id}).",
      "Retailers and category tags used to populate filters (/client-retailer-tags…).",
      "Looker embed URLs for legacy dashboards (/looker/embed).",
    ],
  },
  {
    api: "IAM",
    via: "auth & permissions",
    calls: [
      "The account/tenant resolved from the subdomain (/accounts/slug/{subdomain}).",
      "The user's authorities/permissions for each application (/users/authorities/application-slug=…).",
    ],
  },
  {
    api: "Cube.dev",
    via: "the actual KPI data",
    calls: [
      "Runs the real metric queries (/cubejs-api/v1/load) and reads the cube schema (/cubejs-api/v1/meta).",
      "Every query carries a Cube JWT scoped to the data group + client + user, so a client can only read its own data.",
    ],
  },
  {
    api: "Product API",
    via: "image validation",
    calls: [
      "SKU image-comparison validations and exports (/image-comparison-validations, /retailer-image-comparison-validations, /image-references/exports).",
    ],
  },
  {
    api: "Clients API",
    via: "perfect store",
    calls: [
      "Perfect-store filters and data (/perfect-store/filters/{retailers,stores,brands,client-skus}, /perfect-store/data).",
    ],
  },
  {
    api: "Maestro API",
    via: "the AI assistant",
    calls: [
      "Conversations, messages, feedback and highlights per application (/{app}/conversations…).",
    ],
  },
  {
    api: "Embeddable, Slides & Alerts",
    via: "embedding, reports & alerts",
    calls: [
      "Embeddable: a security token to embed dashboards (/security-token).",
      "Slides API: report templates and generated reports (/templates, /reports).",
      "Alerts API: client alerts (/alerts).",
    ],
  },
];

export const DASHBOARD_DATA_SOURCES_NOTE =
  "The dashboard does not call backoffice-api directly. The client, retailer and dashboard configuration it relies on is set up in Ecometry / backoffice and reaches the dashboard through the Visualization API (and the dbt pipeline).";

export const DASHBOARD_PIPELINE: string[] = [
  "All dashboard configuration originates in Ecometry and is replicated (via Airbyte) into Snowflake staging models: dashboard application, group and section, plus the data-group, retailer and cube bindings.",
  "dbt builds the marts (e.g. market share, digital shelf) and tags each row with its data group and dashboard type, so dashboards can slice the data correctly.",
  "A cube's dashboard type acts as a domain boundary — cubes are only queryable by data groups of the same domain.",
  "A section's type decides which visualization engine renders it; new dashboard + data-group + cube combinations need no code change, only configuration.",
];
