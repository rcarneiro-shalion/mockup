// ---------------------------------------------------------------------------
// Business-rules registry.
//
// Plain-English summaries of the domain rules that govern each page. Rules for
// Clients, Retailers (Retailers/Stores/Region systems) and Country groups were
// recovered from the production backoffice-api (Kotlin) source — use cases,
// domain models, validators, persistence, DB migrations and tests. The
// remaining sections are derived from this prototype's own data models and
// screens. Each page's (?) modal reads its section here.
// ---------------------------------------------------------------------------

export type RuleGroup = { category: string; rules: string[] };
export type RulePage = { key: string; label: string; match: string; groups: RuleGroup[] };
export type RuleSection = { section: string; intro: string; pages: RulePage[] };

// Auto-generated rule pages for the promoted entities (rules mined from console-frontend).
import { APPROX_RULE_PAGES as AP } from "./approxRules";

// ---------- Clients --------------------------------------------------------

const clients: RulePage = {
  key: "clients",
  label: "Clients",
  match: "/clients",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A client must have a name, and that name must be unique across the system.",
        "A client has an acronym that must be unique — even against deleted clients — and follow the house format: an uppercase letter, three more uppercase letters or digits, optionally an underscore and four more (e.g. COCA, ABIN, LORE_2024).",
        "Re-using the client's own current name, account or acronym is always allowed — the uniqueness check only kicks in when you actually change one.",
      ],
    },
    {
      category: "Fields & options",
      rules: [
        "A client can optionally carry an account id, which must be unique when provided.",
        "A client can be flagged as a test client.",
        "A client can store extra configuration as metadata.",
      ],
    },
    {
      category: "Deleting",
      rules: [
        "A client can only be removed once nothing references it: no data groups, assortments, business units, client categories, client SKUs or competitor SKUs.",
        "Removing a client automatically cleans up its country-group memberships, manufacturers and competitors.",
      ],
    },
    {
      category: "Good to know",
      rules: ["A client can belong to the same country group only once."],
    },
  ],
};

// ---------- Retailers ------------------------------------------------------

const retailers: RulePage = {
  key: "retailers",
  label: "Retailers",
  match: "/retailers",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A retailer must have a name, and that name has to be unique among active retailers.",
        "A logo is required when a retailer is first created.",
        "The name can be up to 256 characters and can never be left blank.",
        "New retailers start out active.",
        "When editing, every field is optional — you only change what you touch — and the name is re-checked for uniqueness only if you actually change it.",
        "Editing a retailer never changes whether it is archived.",
      ],
    },
    {
      category: "Deleting",
      rules: [
        "A retailer can only be removed once nothing depends on it: it must have no stores, and must not be referenced by any ads, listings, value propositions, or SKU image/text references.",
        "Deleting a retailer archives it rather than erasing it, so its history is preserved.",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Retailers can be searched by name (partial, case-insensitive), by id, and by created or updated date ranges.",
        "Archived retailers are hidden by default; you can choose to include them.",
        "The list shows how many active stores each retailer has.",
      ],
    },
    {
      category: "Good to know",
      rules: [
        "Every retailer keeps a full audit trail: when it was created and updated, and by whom.",
        "A retailer's image-download settings can be cleared on their own, without touching the rest of the record.",
      ],
    },
  ],
};

const stores: RulePage = {
  key: "stores",
  label: "Stores",
  match: "/stores",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A store must have a name that is unique among active stores — up to 256 characters and never blank.",
        "On creation these are all required: name, logo, domain, country, timezone, locale, retailer, store type, status, store class and device. (The Ecometry id is optional.)",
        "The chosen timezone must be one that is valid for the store's country.",
        "The country, locale and retailer all have to already exist in the system.",
        "New stores start active.",
        "When editing, leaving a field blank keeps its current value; the name must still stay unique.",
        "A store's type cannot be changed while it has collection jobs attached, and changing the type resets its jobs to automatic geolocation.",
      ],
    },
    {
      category: "Fields & options",
      rules: [
        "Store type is either Flagship or Geoloc.",
        "Status is either Active or Inactive.",
        "Store class is one of: Aggregator, Brick & click, Dark store, Direct-to-consumer, Marketplace, Pure player, Specialist, or First-party apps.",
        "Device is either App or Web.",
        "Country uses the 2-letter code; locale uses the standard language code.",
      ],
    },
    {
      category: "Deleting",
      rules: [
        "A store can only be removed when nothing references it: no locations, jobs, assortments, SKU price records, or store SKUs.",
        "Deleting a store archives it rather than erasing it.",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Search and filter by name, domain, country, locale, retailer, type, status, class, device, archived state, and created/updated dates; results are paginated.",
        "Searching by client returns only the stores tied to that client's projects.",
        "The list shows each store's number of active locations.",
      ],
    },
    {
      category: "Good to know",
      rules: [
        "Every store keeps a full audit trail (who and when).",
        "A store can also be looked up by its Ecometry id when one is assigned.",
      ],
    },
  ],
};

const regionSystems: RulePage = {
  key: "regionSystems",
  label: "Location Catalog",
  match: "/location-catalogs",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "Every region must have a name and must belong to an existing store.",
        "Within the same store, both the name (up to 300 characters) and the geographic locator must be unique.",
        "A new region is active unless stated otherwise.",
        "Editing is field-by-field; the name and locator must stay unique within the store.",
      ],
    },
    {
      category: "Deleting",
      rules: [
        "Removing a region archives it (soft delete) and automatically cleans up its links in the dashboards and in the tasks system.",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Search and filter by name (partial, case-insensitive), locator details, address, city, postal code, store, active status, country, and created/updated dates.",
      ],
    },
    {
      category: "Good to know",
      rules: [
        "Each region keeps a full audit trail.",
        "A region's geographic position is stored as a flexible locator that can be searched by its individual parts.",
      ],
    },
  ],
};

// ---------- Seeds API ------------------------------------------------------

const projects: RulePage = {
  key: "projects",
  label: "Projects",
  match: "/seeds-api/projects",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A project must have a unique, non-empty name.",
        "A project starts Active and can later be set Inactive.",
        "A Bill of Materials (BOM) reference is optional and is shown next to the project everywhere.",
      ],
    },
    {
      category: "Relationships",
      rules: [
        "A project can serve several clients, each with its own start and end dates.",
        "A project can have any number of subscriptions; each assignment records its store, geolocation mode, type and expiry.",
        "A subscription is assigned as either Base (foundational) or Add-on (supplementary), and the same subscription cannot be added twice.",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Projects can be searched by name and filtered by status, BOM, assigned clients or subscriptions.",
        "The list can be sorted by name, dates, creator, status, and the client/subscription counts.",
      ],
    },
    {
      category: "Good to know",
      rules: ["Every project records who created and last updated it, and when."],
    },
  ],
};

const subscriptions: RulePage = {
  key: "subscriptions",
  label: "Subscriptions",
  match: "/seeds-api/subscriptions",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A subscription needs a name, a project, a store and a scraping option; everything else is optional.",
        "Geolocation can be None, Automatic or Manual — and a location set is only required (and only editable) when Manual is chosen.",
        "A new subscription defaults to no geolocation, all-seeds selection with full coverage, and no seeds assigned yet.",
      ],
    },
    {
      category: "Fields & options",
      rules: [
        "Selection parameters (replacing the old Rotation tag-list) set how seeds and locations are picked each run: a seed selection (all seeds, weekly/monthly bucket or stateful freshness), an optional freshness window + day count, a location selection when geolocation is automatic or manual, and a volume cap.",
        "A subscription runs exactly one scraping option (1:1); the same option may be reused by other subscriptions. Extraction config and frequency live on that option.",
        "When the scraping option is a discovery (PLP / MEDIA) extraction, it can point to zero, one or many PDP sibling subscriptions (Destination options).",
        "A subscription can hold many seeds across the four types (Keyword, URL, API, PDP), added or removed from a searchable, tabbed picker.",
      ],
    },
    {
      category: "Relationships",
      rules: [
        "A subscription belongs to one project, and its clients are inherited from that project.",
        "The scraping option it points to defines how data is extracted (type, stores, timeframes, pagination, sorting, modalities).",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Subscriptions can be searched by name and filtered by client, project, store, seeds, scraping option and geolocation mode.",
        "Deleting a subscription asks for confirmation first.",
      ],
    },
  ],
};

const seeds: RulePage = {
  key: "seeds",
  label: "Seeds",
  match: "/seeds-api/seeds",
  groups: [
    {
      category: "Seed types",
      rules: [
        "Every seed is one of three types: Keyword, URL or API.",
        "Keyword seeds carry a keyword type (Branded or Category); URL and API seeds carry a page type (Subcategory, Category, Home, Offers, Brand store or Legacy).",
        "The tracked value differs by type: a search term (Keyword), a web address (URL) or an API configuration (API).",
      ],
    },
    {
      category: "Creating & editing",
      rules: [
        "A seed needs a description, a store, a discovery key, a page/keyword type and its type-specific value before it can be saved.",
        "A seed defaults to Active and can be set Inactive.",
        "A seed can be marked as 'from discovery' when it was generated automatically from a PLP discovery seed.",
        "Each seed is tied to a store and a hierarchical category (e.g. Pantry > Coffee > Beans).",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Seeds can be filtered by type, description, value, store, category, page type, keyword type and status.",
        "The type-specific filters only appear for the matching seed type (page type for URL/API, keyword type for Keyword).",
      ],
    },
  ],
};

const scrappingOptions: RulePage = {
  key: "scrapping-options",
  label: "Scraping options",
  match: "/seeds-api/scrapping-options",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "Each scraping option has a unique name and exactly one extraction type (Search, Shelf, Ad, Digital Shelf PLP, Digital Shelf PDP or Media).",
        "It must target one or more stores/retailers and run on one or more timeframes.",
        "It defaults to Active and can be set Inactive.",
      ],
    },
    {
      category: "Fields & options",
      rules: [
        "Multivariants, Pagination (with a max page) and Limited discovery (with a max rank) are toggles; the related input only applies when its toggle is on.",
        "Modalities restricts to a single mode — pickup, delivery or shipping.",
        "Sorting appends a result order: best seller, price low→high, price high→low, relevance or newest.",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Options can be searched by name and filtered by store and extraction type.",
        "Enabled features are summarised as coloured pills on each row.",
      ],
    },
  ],
};

const tags: RulePage = {
  key: "tags",
  label: "Tags",
  match: "/seeds-api/tags",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A tag needs a name and exactly one client.",
        "A tag can optionally have a parent tag, forming a hierarchy.",
        "A tag defaults to Active.",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Tags can be searched by name and filtered by client, and sorted by any column.",
        "Each row offers Copy id and Delete (with confirmation).",
      ],
    },
    {
      category: "Good to know",
      rules: ["The client list is shared with the Clients area so it stays consistent everywhere."],
    },
  ],
};

const seedsTimeframes: RulePage = {
  key: "timeframes",
  label: "Timeframes",
  match: "/seeds-api/timeframes",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A timeframe needs a unique name.",
        "It must set how often its location rotates (no daily rotation, or monthly) and how often its seed content rotates (no daily rotation, weekly or monthly).",
        "It can optionally belong to a timeframe group and a product.",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Each timeframe can be toggled active or inactive.",
        "The list can be searched by name and filtered by location frequency, seed frequency, group and product.",
      ],
    },
    {
      category: "Good to know",
      rules: ["Each timeframe records who created and updated it, and when."],
    },
  ],
};

// ---------- Product --------------------------------------------------------

const clientSkus: RulePage = {
  key: "client-skus",
  label: "Client SKUs",
  match: "/product/client-skus",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A client SKU needs a title, country, brand, client and at least one code (EAN, ASIN, SKU code or GTIN).",
        "A SKU can carry several codes of different types, added or removed individually.",
        "Units is required; Volume (a value plus a unit such as ml or L) is optional.",
        "A SKU can be flagged as a Hero (featured) product; business unit, client category and an active date are optional.",
      ],
    },
    {
      category: "Tabs & views",
      rules: [
        "The page has two tabs: 'Client skus' (codes, brand, category) and 'Client skus by region' (region system and region).",
        "The 'Client skus' tab supports a title search; the by-region tab uses filters only.",
        "A SKU links to its client and brand, and the client links through to the client's detail page.",
      ],
    },
    {
      category: "MSRP (recommended prices)",
      rules: [
        "Each SKU can hold recommended prices at four scopes: Global (one price everywhere), Region, Store, and Region & Store.",
        "Every price entry needs a currency and amount; the region and/or store become required depending on the scope.",
      ],
    },
  ],
};

// Refined from product-api (domain/Assortment.kt, usecases) + dbt-models
// (aux_matching_assortment) — replaces the auto-mined Assortments rules.
const assortments: RulePage = {
  key: "assortments",
  label: "Assortments",
  match: "/product/assortments",
  groups: [
    {
      category: "What an assortment is",
      rules: [
        "An assortment is the set of a client's products (client SKUs) expected to be tracked in a given store — and optionally a specific region — over an optional active period.",
        "It is the baseline of \"what should be on the shelf here\": the reference the platform measures availability, distribution and coverage against.",
      ],
    },
    {
      category: "Store vs region assortments",
      rules: [
        "A store assortment belongs to a client + store and is unique for that pair; a region-store assortment belongs to a client + region + store and is unique for that triple.",
        "Active dates are optional, but the active-to date can never be before the active-from date (the same rule applies to each SKU link).",
      ],
    },
    {
      category: "How SKUs get into an assortment",
      rules: [
        "Automatic (store): every one of the client's global SKUs whose country matches the store is included automatically — no manual list to maintain.",
        "Manual (store): SKUs are listed explicitly by linking each client SKU to the assortment, each with its own optional active dates.",
        "Regional: a region-store assortment in REGIONAL mode auto-matches the client's regional SKUs by country and region.",
        "Manual region-store: a region-store assortment in MANUAL mode takes an explicit list of client SKUs.",
      ],
    },
    {
      category: "Fields & options",
      rules: [
        "Multi-matching lets one client SKU match more than one product in the store.",
        "Switching a store assortment from manual to automatic does not delete its explicit SKU links — they are simply no longer used.",
        "An assortment is active by default and can be deactivated.",
      ],
    },
    {
      category: "Deleting",
      rules: [
        "Assortments are a sensitive relationship: their dependencies are not removed automatically. If active relations (its SKU links) exist, deletion is blocked until you remove them first.",
        "Deletion is a soft delete, so history is preserved.",
      ],
    },
    {
      category: "Good to know",
      rules: [
        "The resulting active assortment (per client + store + SKU) feeds the matching, availability and Digital-Shelf \"range\" datasets that power the dashboards.",
        "Every assortment keeps a full audit trail (who created/updated it and when).",
      ],
    },
  ],
};

// ---------- Bulk -----------------------------------------------------------

const bulk: RulePage = {
  key: "bulk",
  label: "Bulk",
  match: "/bulk",
  groups: [
    {
      category: "What it's for",
      rules: [
        "Bulk lets you import or update large amounts of information in one operation, instead of editing records one by one.",
        "Typical uses are onboarding a new client (master data plus an initial catalogue) or refreshing a whole catalogue or price structure across stores and regions.",
        "It covers two kinds of work: importing brand-new data and updating existing records.",
      ],
    },
    {
      category: "Good to know",
      rules: [
        "In this prototype the Bulk area is an early placeholder — the working screens are still to be designed.",
      ],
    },
  ],
};

// ---------- Settings -------------------------------------------------------

const dashboardApplications: RulePage = {
  key: "dashboard-applications",
  label: "Dashboard applications",
  match: "/settings/dashboard-applications",
  groups: [
    {
      category: "Hierarchy",
      rules: [
        "A dashboard application holds dashboard groups; each group holds sections; each section can hold tabs; each tab holds panels.",
      ],
    },
    {
      category: "Fields",
      rules: [
        "An application has a label and a URL-friendly slug, plus an optional 'Maestro enabled' flag (on by default).",
        "Each group has a label and an icon. Each section is either Built-in (system-provided) or Custom (user-defined) and can hold key-value definition variables such as embeddable_id.",
        "A tab needs a label, slug and dashboard id; description, Looker id and a filter set (Default, Brand, Category, Retailer or None) are optional, with filter set defaulting to Default.",
      ],
    },
    {
      category: "Validation",
      rules: [
        "A tab cannot be saved if the tab — or any of its panels — is missing a label, slug or dashboard id.",
      ],
    },
    {
      category: "Good to know",
      rules: [
        "Labels are translation-ready (Spanish/Portuguese), and every level keeps created and updated timestamps.",
      ],
    },
  ],
};

const settingsTargets: RulePage = {
  key: "targets",
  label: "Targets",
  match: "/settings/targets",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A target needs a name and a default value (the value falls back to 0 if left blank).",
        "The default value is stored as text, so it can hold whole numbers (70) or decimals (0.9).",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "The list can be searched by name and sorted by any column.",
        "Deleting a target asks for confirmation first.",
      ],
    },
    {
      category: "Good to know",
      rules: [
        "The system ships with 15 default targets covering quality scores, availability, pricing thresholds and delivery expectations.",
      ],
    },
  ],
};

const settingsTimeframes: RulePage = {
  key: "timeframes",
  label: "Timeframes",
  match: "/settings/timeframes",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A timeframe needs a name and the product it applies to (e.g. CMI, DSM, CMI3, FSA).",
        "It belongs to a group (such as daily, location_discovery, content or marketplace), or '-' when none applies.",
      ],
    },
    {
      category: "Scheduling",
      rules: [
        "The schedule is a cron expression (e.g. '30 18 * * *') or a placeholder; duration is human-readable (e.g. '23h 59min'); frequency defaults to 1.",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Searchable by name; each row can be toggled active/inactive and deleted.",
      ],
    },
  ],
};

const settingsCategories: RulePage = {
  key: "categories",
  label: "Categories",
  match: "/settings/categories",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A category needs a name and belongs to a sector (defaults to Automotive).",
        "English and Spanish descriptions are optional.",
      ],
    },
    {
      category: "Parent & children",
      rules: [
        "A category can optionally sit under a parent category, but it cannot be its own parent.",
        "'Other / MOTHER CATEGORY' entries act as catch-alls for unclassified items in their branch.",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Search spans the name and both descriptions, with case-insensitive partial matching.",
        "Categories keep created/updated timestamps; the update stamp refreshes on edit while creation stays fixed.",
      ],
    },
  ],
};

const settingsCountryGroups: RulePage = {
  key: "country-groups",
  label: "Country groups",
  match: "/settings/country-groups",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A country group needs a non-blank name that is unique across the system — including when you rename it.",
      ],
    },
    {
      category: "Member countries",
      rules: [
        "A country (identified by its ISO 2-letter code) can be added to a group only once, and the country must already exist.",
      ],
    },
    {
      category: "Client assignments",
      rules: [
        "A client can be assigned to a group only once, and the client must already exist.",
      ],
    },
    {
      category: "Deleting",
      rules: [
        "A group cannot be deleted while it has client assignments.",
        "Deleting a group removes its member countries; deleting a client removes that client's group assignments.",
      ],
    },
    {
      category: "Good to know",
      rules: ["Each group records created/updated timestamps and the users involved."],
    },
  ],
};

const settingsRules: RulePage = {
  key: "rules",
  label: "Rules",
  match: "/settings/rules",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A rule needs a unique name; everything else is optional.",
        "A rule carries a prompt — the instructions given to the AI query builder.",
        "A rule is marked verified (human-reviewed) or unverified; new rules start unverified.",
      ],
    },
    {
      category: "Scope",
      rules: [
        "A rule can target a specific client, or apply to all clients; likewise it can target one data group or all.",
        "A rule can be given scope entries and dashboard applications (e.g. Market Share Maestro) to narrow where it applies; duplicates are prevented and the application picker is searchable.",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "The list is searchable by name and shows name, prompt, client, data group and timestamps; sortable by name, client and data group.",
      ],
    },
  ],
};

// ---------- Codification ---------------------------------------------------

const brands: RulePage = {
  key: "brands",
  label: "Brands",
  match: "/codification/brands",
  groups: [
    {
      category: "Creating & editing",
      rules: [
        "A brand must have a name, and that name must be unique across all brands.",
        "A brand requires a default category and a default manufacturer; a parent brand is optional.",
        "When editing, the name is only re-checked for uniqueness if you actually change it.",
        "A brand's default category can't be changed while it has editions that use the current default category.",
      ],
    },
    {
      category: "White label & multi-brand",
      rules: [
        "A brand can be flagged as white label (a retailer's own/private label).",
        "A multi-brand brand is an umbrella that groups several editions.",
        "Multi-brand can't be switched off while the brand still has editions — remove the editions first.",
      ],
    },
    {
      category: "Deleting",
      rules: [
        "A brand can only be deleted when nothing uses it: it isn't a parent of another brand, and isn't referenced by any brand-category, brand-country-manufacturer, regular expression, edition, listing, client SKU, competitor SKU or seed.",
      ],
    },
    {
      category: "Search & listing",
      rules: [
        "Brands can be searched by name (full or starts-with) and filtered by default category, default manufacturer, parent, white-label and multi-brand flags, plus created/updated dates.",
      ],
    },
    {
      category: "How automatic codification works",
      rules: [
        "Each brand carries one or more aliases. Scraped text is cleaned first (accents removed, lowercased, punctuation turned into separators) so variants like \"L'Oréal\" and \"loreal\" match the same brand.",
        "The longest matching alias wins. A match made by the rules is marked AUTO; one set by a person is MANUAL — and a manual correction always takes priority over the automatic result.",
        "Categories use Shalion's full category-tree path; if nothing matches, the brand's default category is used (marked DEFAULT).",
        "Promotions are matched with case-insensitive patterns, and several patterns can map to the same promotion type (e.g. \"3x2\" and \"buy 3 pay 2\").",
        "An ad can show several brands — each brand found counts as a fraction so the ad's total weight stays at 1.",
      ],
    },
    {
      category: "Good to know",
      rules: ["Every brand keeps an audit trail — who created and updated it, and when."],
    },
  ],
};

// ---------- Data Collector -------------------------------------------------
// Rules recovered from ecometry-tasks-api (domain: Project, Job, Seed, Order,
// Execution, Task, Timeframe + status/extraction/geoloc enums) and mirrored to
// the console-frontend data-collector pages.

const dcTags: RulePage = {
  key: "dc-tags",
  label: "Tags",
  match: "/data-collector/projects/tags",
  groups: [
    {
      category: "What tags are",
      rules: [
        "Tags are free-form labels used to group and filter projects (e.g. by client, business unit or quarter).",
        "Each tag shows how many projects currently use it.",
      ],
    },
    {
      category: "Rules",
      rules: [
        "A tag needs a name.",
        "Deleting a tag removes it from the projects that carry it — it does not delete those projects.",
      ],
    },
  ],
};

const dcProjects: RulePage = {
  key: "dc-projects",
  label: "Projects",
  match: "/data-collector/projects",
  groups: [
    {
      category: "What a project is",
      rules: [
        "A project defines a single scraper: its extraction code/config, the output schema it produces, the template it inherits from, and the proxy account its traffic is routed through.",
        "Projects are the unit that groups the extraction work and carry tags for organisation.",
      ],
    },
    {
      category: "Status & lifecycle",
      rules: [
        "A project's status is ACTIVE, INACTIVE or ARCHIVED; only an active project produces new executions.",
        "A project name must be unique.",
        "You can clone a project to start from an existing one, or download its configuration.",
      ],
    },
    {
      category: "What it connects to",
      rules: [
        "Output schema — the shape of the data the project must return.",
        "Project template — the environment variables and the set of proxy accounts the project is allowed to use.",
        "Proxy account — the specific account traffic is routed through.",
      ],
    },
  ],
};

const dcTemplates: RulePage = {
  key: "dc-templates",
  label: "Templates",
  match: "/data-collector/templates",
  groups: [
    {
      category: "What a template is",
      rules: [
        "A template is a reusable base for projects — it carries default environment variables and the list of proxy accounts a project built from it is allowed to use.",
      ],
    },
    {
      category: "Rules",
      rules: [
        "A template needs a name.",
        "Archiving a template does not break projects that were already created from it.",
      ],
    },
  ],
};

const dcOutputSchemas: RulePage = {
  key: "dc-output-schemas",
  label: "Output schemas",
  match: "/data-collector/outputs/schemas",
  groups: [
    {
      category: "What an output schema is",
      rules: [
        "An output schema declares which fields an extraction must produce and the data type of each field.",
        "It is the contract between the scraper and everything downstream (delivery + dashboards).",
      ],
    },
    {
      category: "Good to know",
      rules: [
        "Schemas are identified by name; clone a schema to evolve it without breaking existing projects.",
        "Each field references a data type that validates and normalises the value.",
      ],
    },
  ],
};

const dcDataTypes: RulePage = {
  key: "dc-data-types",
  label: "Data types",
  match: "/data-collector/outputs/data-types",
  groups: [
    {
      category: "What a data type is",
      rules: [
        "A data type is a named validation / normalisation rule applied to an output field — for example price → decimal with the currency symbol stripped, or rank → integer ≥ 1.",
        "Output-schema fields point at a data type so extracted values arrive in a consistent shape.",
      ],
    },
  ],
};

const dcOrders: RulePage = {
  key: "dc-orders",
  label: "Orders",
  match: "/data-collector/orders",
  groups: [
    {
      category: "What an order is",
      rules: [
        "An order is the recurring configuration for collecting data from one store: it binds a project + store with an extraction type, a timeframe, a cron schedule, a delivery method and resource settings (machine size, parallelism, cache validity).",
        "It answers “what do we collect from this store, how often, with what machine, and where do the results go?”.",
      ],
    },
    {
      category: "Extraction type & delivery",
      rules: [
        "Extraction (stream) type is one of AD, SEARCH, SHELF, PLP, PDP, PDP_REVIEWS, PDP_MARKETPLACE, MARKETPLACE, MEDIA, QCA_PLP, FSA_CITY, FSA_MENU or FSA_RESTAURANT.",
        "Delivery method is None, Firehose (stream), S3 (bucket + folder) or Rabbitmq (key + exchange).",
        "Machine size is one of XXS, XS, S, M, L, XL, XXL, Boost or Custom (Custom sets explicit CPU + memory).",
        "Cache validity is 0–86400 seconds (one day); 0 means results are never cached.",
      ],
    },
    {
      category: "Scheduling, activation & re-execution",
      rules: [
        "Active orders fire on their cron schedule; an order cannot be archived and activated at the same time, and deactivating it stops new executions without deleting history.",
        "There is a system limit on how many orders can be scheduled.",
        "Optional re-execution rules retry failed tasks automatically: 1–5 retries, a next-trigger delay of 0/15/30/45/60 minutes, and a non-empty set of error categories (UNCLASSIFIED is not allowed).",
      ],
    },
    {
      category: "Rules",
      rules: ["An order's name must be unique among non-archived orders."],
    },
  ],
};

const dcExecutions: RulePage = {
  key: "dc-executions",
  label: "Executions",
  match: "/data-collector/executions",
  groups: [
    {
      category: "What an execution is",
      rules: [
        "An execution is one run of an order. It fans out into many tasks and tracks status, proxy usage (number of requests + bandwidth), a task summary and an error ratio.",
        "Mode is MANUAL or AUTO; type is FULL, RE_EXECUTION or REPROCESSING. A groupId batches related executions.",
        "An execution may have no order (orderId is null) when it was triggered manually or created as a re-execution.",
      ],
    },
    {
      category: "Status flow",
      rules: [
        "PENDING → STARTED, EMPTY, CANCELLED or ERROR.",
        "STARTED → FINISHED, CANCELLED, ERROR or HANGED; a HANGED execution can go back to STARTED or to FINISHED.",
        "EMPTY, CANCELLED, ERROR and FINISHED are terminal; details are required when it moves to ERROR or HANGED.",
      ],
    },
    {
      category: "Good to know",
      rules: [
        "An execution can only receive tasks while none have been generated yet.",
        "You can trigger, clone (optionally with the project), cancel, and inspect CPU / memory for an execution.",
      ],
    },
  ],
};

const dcTasks: RulePage = {
  key: "dc-tasks",
  label: "Tasks",
  match: "/data-collector/tasks",
  groups: [
    {
      category: "What a task is",
      rules: [
        "A task is the atomic scraping unit inside an execution — one input (e.g. a product code or URL) processed by the scraper.",
        "Its id is sequential within its execution (the key is id + executionId); it records start/end time, runtime, proxy statistics and, on failure, a matched error indicator.",
      ],
    },
    {
      category: "Status flow",
      rules: [
        "PENDING → STARTED, ERROR, CANCELLED or UNPROCESSED.",
        "STARTED → SUCCESS, WARNING, ERROR, VOID or UNPROCESSED.",
        "SUCCESS, WARNING, ERROR and VOID are the finalised states; a CANCELLED task can be re-queued (back to STARTED).",
      ],
    },
    {
      category: "Re-execution",
      rules: [
        "Failed tasks can be re-executed in bulk.",
        "The matched error indicator's category decides whether a failure is eligible for automatic re-execution.",
      ],
    },
  ],
};

const dcProxyAccounts: RulePage = {
  key: "dc-proxy-accounts",
  label: "Proxy accounts",
  match: "/data-collector/settings/proxies/accounts",
  groups: [
    {
      category: "What a proxy account is",
      rules: [
        "A proxy account is a credentialed endpoint at a provider: name, slug, provider, proxy type, host, port, authentication (username required, password optional) and the regions it is limited to.",
        "Executions route their traffic through a proxy account and roll up its request + bandwidth usage.",
      ],
    },
    {
      category: "Rules",
      rules: [
        "Name and slug are unique per provider (archived accounts are excluded); slug is lowercase with no spaces.",
        "The proxy type must belong to the same provider, and both the provider and the type must be active when the account is created or kept active.",
        "An account cannot be archived and activated at once; archiving forces it inactive.",
        "Limited regions are ISO codes such as es, gb, br-sp or fr-972.",
      ],
    },
  ],
};

const dcProxyProviders: RulePage = {
  key: "dc-proxy-providers",
  label: "Proxy providers",
  match: "/data-collector/settings/proxies/providers",
  groups: [
    {
      category: "What a provider is",
      rules: [
        "A provider is the upstream proxy vendor (Bright Data, Oxylabs, Smartproxy…) that owns the proxy types and proxy accounts.",
      ],
    },
    {
      category: "Rules",
      rules: [
        "Name and slug must be unique; the slug is lowercase with no spaces.",
        "A provider cannot be deactivated while any of its accounts are still active.",
        "Proxy types are scoped to a provider — a type name is unique within its provider and can't be used by another provider's accounts.",
      ],
    },
  ],
};

const dcErrorIndicators: RulePage = {
  key: "dc-error-indicators",
  label: "Error indicators",
  match: "/data-collector/settings/error-indicators",
  groups: [
    {
      category: "What an error indicator is",
      rules: [
        "An error indicator is a regex matched against a task's output that classifies a failure into one error category: SEED_ERROR, CONNECTION_ERROR, TEMPLATE_ERROR, DATA_COLLECTOR_ERROR, PROXY_ERROR or UNCLASSIFIED.",
        "It carries an output sample, can be archived, and lives alongside Orders/Executions in orders-management-api.",
      ],
    },
    {
      category: "Automatic re-execution",
      rules: [
        "An indicator with “allow automatic re-execution” on makes matching tasks eligible to be retried.",
        "An order's re-execution rules pick which error categories actually trigger a retry — UNCLASSIFIED can never be one of them.",
      ],
    },
  ],
};

// ---------- IAM ------------------------------------------------------------
// Identity & access. Rules mirrored from console-frontend's src/features/iam
// (Applications, Users, Accounts, Roles / Persona) + their resource DTOs.

const iamApplications: RulePage = {
  key: "iam-applications",
  label: "Applications",
  match: "/iam/applications",
  groups: [
    {
      category: "What an application is",
      rules: [
        "An application is a product users and accounts can access — the platform-wide ones are Ecometry, Data Collector and IAM.",
        "Each application owns a set of permissions, each defined as a resource + action pair (e.g. user:manage, role:read).",
      ],
    },
    {
      category: "Rules",
      rules: [
        "Name is required. The slug is a URL-friendly unique identifier and is read-only once set.",
        "Creating, editing or deleting an application requires the manage permission on the application resource.",
        "A permission's resource name and action are immutable after it is created.",
      ],
    },
  ],
};

const iamUsers: RulePage = {
  key: "iam-users",
  label: "Users",
  match: "/iam/users",
  groups: [
    {
      category: "What a user is",
      rules: [
        "A user is a person who signs in, identified by their Cognito user id (email + account) — not by email alone.",
        "A user belongs to one or more accounts; within an account they have a role and per-application permissions.",
      ],
    },
    {
      category: "Data groups (many per user)",
      rules: [
        "A user can belong to MANY data groups — even across different accounts. (The old “a user can only have one data group” message was an application lock; the model is N:M.)",
        "Exactly one data group is the default per account — the context shown first when the user signs in. Switching context during a session persists the choice.",
        "Internal Shalion staff (CS / Sales) can span data groups across many client accounts; external client users typically stay within their own account.",
        "Open a user (IAM → Users → a row) to see their data groups grouped by account and set the default per account.",
      ],
    },
    {
      category: "Rules",
      rules: [
        "Users are created through a batch flow (with email validation) — there is no single “Add user” button on the list.",
        "Email is read-only once the user exists; a user is enabled/disabled with the active/inactive status switch.",
        "Only users with the manage permission can change another user's role, status, data groups or permissions.",
      ],
    },
  ],
};

const iamAccounts: RulePage = {
  key: "iam-accounts",
  label: "Accounts",
  match: "/iam/accounts",
  groups: [
    {
      category: "What an account is",
      rules: [
        "An account is the client / organisation context that users belong to and that authorises access to applications.",
        "An account can hold several app clients (PUBLIC or CONFIDENTIAL) used to authenticate integrations.",
      ],
    },
    {
      category: "Rules",
      rules: [
        "Name is required and cannot be blank or whitespace-only; the slug is generated from the name.",
        "Creating or deleting an account requires the ADMIN role or the iam:account:manage permission.",
        "IAM permissions are scoped to the account context.",
      ],
    },
  ],
};

const iamRoles: RulePage = {
  key: "iam-roles",
  label: "Roles / Persona",
  match: "/iam/roles",
  groups: [
    {
      category: "What a role / persona is",
      rules: [
        "A role (persona) is a named bundle of access that is assigned to a user within an account.",
        "Roles are the infrastructure permissions are assigned through.",
      ],
    },
    {
      category: "Rules",
      rules: [
        "Name is required; the slug is auto-generated and immutable.",
        "Adding, editing or deleting a role requires the role:manage permission; deletion is confirmed first.",
      ],
    },
  ],
};

// ---------- Sections -------------------------------------------------------

export const RULE_SECTIONS: RuleSection[] = [
  {
    section: "Clients",
    intro:
      "Clients are the brands we measure for. These rules govern how a client is created, identified, related to other data, and removed.",
    pages: [clients],
  },
  {
    section: "Retailers",
    intro:
      "Retailers are the shops and websites where products are sold, their individual stores, and the regions those stores belong to. These rules govern how each is created, edited, removed and searched.",
    pages: [retailers, stores, regionSystems],
  },
  {
    section: "Seeds API",
    intro:
      "The Seeds API is what we monitor across the web and how that work is organised — projects, subscriptions, the seeds themselves, scraping options, tags and timeframes.",
    pages: [projects, subscriptions, seeds, scrappingOptions, tags, seedsTimeframes],
  },
  {
    section: "Codification",
    intro:
      "Codification is where raw product data is cleaned up and matched to the right brand, category, promotion and product.",
    pages: [
      brands,
      AP["manufacturers"],
      AP["promotions"],
      AP["listings"],
      AP["fsa-listings"],
      AP["ads"],
      AP["fsa-sections"],
      AP["value-propositions"],
      AP["attributes"],
      AP["data-variables"],
    ],
  },
  {
    section: "Product",
    intro:
      "Product holds the catalogue being measured — client SKUs and their codes, store SKUs, assortments, recommended prices, and image/text references.",
    pages: [
      clientSkus,
      AP["business-units"],
      AP["client-categories"],
      AP["store-skus"],
      AP["sku-rpcs"],
      assortments,
      AP["sku-image-references"],
      AP["sku-retailer-image-references"],
      AP["sku-store-image-references"],
      AP["sku-text-references"],
      AP["sku-retailer-text-references"],
      AP["sku-store-text-references"],
    ],
  },
  {
    section: "Bulk",
    intro: "Bulk is about making large changes in one go rather than record by record.",
    pages: [bulk],
  },
  {
    section: "Settings",
    intro:
      "Settings is the shared configuration the rest of the platform relies on: dashboard applications, targets, timeframes, categories, country groups and the AI query-builder rules.",
    pages: [
      dashboardApplications,
      settingsTargets,
      settingsTimeframes,
      settingsCategories,
      settingsCountryGroups,
      AP["settings-cubes"],
      AP["settings-scopes"],
      settingsRules,
    ],
  },
  {
    section: "Tasks",
    intro:
      "Tasks is the legacy operational area (projects, jobs and seeds). It is being replaced by the new Seeds API over the coming weeks.",
    pages: [AP["tasks-projects"], AP["tasks-jobs"], AP["tasks-seeds"]],
  },
  {
    section: "Data Collector",
    intro:
      "The Data Collector is Shalion's extraction engine. Projects define the scrapers, orders schedule them per store, and each run becomes an execution made of tasks — routed through proxy accounts and classified by error indicators.",
    // Tags is listed before Projects so the more specific /projects/tags path resolves correctly.
    pages: [
      dcTags,
      dcProjects,
      dcTemplates,
      dcOutputSchemas,
      dcDataTypes,
      dcOrders,
      dcExecutions,
      dcTasks,
      dcProxyAccounts,
      dcProxyProviders,
      dcErrorIndicators,
    ],
  },
  {
    section: "IAM",
    intro:
      "IAM controls who can sign into the platform, which accounts they belong to, which applications they can reach, and what they can do there via roles and per-application permissions.",
    pages: [iamApplications, iamUsers, iamAccounts, iamRoles],
  },
];

/** Resolve the rules section + active page for a given route path, or null. */
export function rulesForPath(
  pathname: string,
): { section: RuleSection; activePageKey: string } | null {
  for (const section of RULE_SECTIONS) {
    const page = section.pages.find(
      (p) => pathname === p.match || pathname.startsWith(p.match + "/"),
    );
    if (page) return { section, activePageKey: page.key };
  }
  return null;
}
