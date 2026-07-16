// Data Collector ("DC") listing/edit specs.
//
// The Data Collector is Shalion's scraping / extraction engine, split across
// several microservices. Page → backing service (confirmed from console-frontend
// api clients):
//   • Projects, Tags, Templates, Output schemas, Data types → data-collector-api
//   • Orders, Executions, Tasks, Error indicators            → orders-management-api
//   • Proxy accounts, Proxy providers, Proxy types           → data-collector-proxies-api
//   (data-collector-instructions-api is a stateless converter; data-collector-dispatcher
//    only launches K8s jobs — neither owns console entities.)
//
// Fields, enums and rules below are grounded in those repos' domain models +
// the console-frontend resource DTOs the grids/forms actually bind to. Each
// entry is an ApproxSpec consumed by the generic EntityListPage / EntityEditPage.
import type { ApproxSpec } from "@/components/common/EntityListPage";

// ---- Enums (verbatim from the services) -----------------------------------
const PROJECT_STATUS = ["ACTIVE", "INACTIVE", "ARCHIVED"];
// orders-management-api DeliveryMethod.Stream (the canonical extraction streams).
const EXTRACTION_TYPES = [
  "AD",
  "FSA_CITY",
  "FSA_MENU",
  "FSA_RESTAURANT",
  "MARKETPLACE",
  "MEDIA",
  "PDP",
  "PDP_MARKETPLACE",
  "PDP_REVIEWS",
  "PLP",
  "QCA_PLP",
  "SEARCH",
  "SHELF",
  "GEN_CHAT",
  "TEST_EXTRACTION",
];
// orders-management-api Order.deliveryMethod sealed class variants.
const DELIVERY_METHODS = ["None", "Firehose", "S3", "Rabbitmq"];
const EXECUTION_STATUS = ["PENDING", "EMPTY", "STARTED", "CANCELLED", "ERROR", "FINISHED", "HANGED"];
const EXECUTION_TYPES = ["REPROCESSING", "FULL", "RE_EXECUTION"];
const EXECUTION_MODES = ["MANUAL", "AUTO"];
const TASK_STATUS = ["PENDING", "STARTED", "UNPROCESSED", "ERROR", "WARNING", "SUCCESS", "CANCELLED", "VOID"];
const ERROR_CATEGORIES = [
  "SEED_ERROR",
  "CONNECTION_ERROR",
  "TEMPLATE_ERROR",
  "DATA_COLLECTOR_ERROR",
  "PROXY_ERROR",
  "UNCLASSIFIED",
];
const MACHINE_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "Boost", "Custom"];
// data-collector-proxies-api ProxyType.name values (per-provider entities, examples).
const PROXY_TYPE_NAMES = ["Residential", "Datacenter", "ISP", "Mobile"];

export const DC_SPECS: Record<string, ApproxSpec> = {
  // ---- Projects (data-collector-api) -------------------------------------
  "dc-projects": {
    key: "dc-projects",
    title: "Projects",
    addLabel: "Add project",
    search: "Search projects by name",
    filters: [
      "Name",
      "Status",
      "Output schemas",
      "Proxy accounts",
      "Project templates",
      "Tags",
      "Created at",
      "Updated at",
    ],
    total: 1284,
    columns: [
      { label: "Name", key: "name" },
      { label: "Status", key: "status" },
      { label: "Output schema", key: "outputSchema" },
      { label: "Project template", key: "projectTemplate" },
      { label: "Tags", key: "tags" },
      { label: "Proxy account", key: "proxyAccount" },
      { label: "Created at", key: "createdAt" },
      { label: "Updated at", key: "updatedAt" },
    ],
    rows: [
      { id: "prj-amz-search-us", name: "Amazon US — Search", status: "ACTIVE", outputSchema: "Search output v3", projectTemplate: "Playwright base", tags: "Beverages, Q2 2026", proxyAccount: "Bright Data — Residential", createdAt: "2025-09-12 09:30", updatedAt: "2026-05-28 14:15" },
      { id: "prj-walmart-pdp", name: "Walmart — PDP", status: "ACTIVE", outputSchema: "PDP output v2", projectTemplate: "Playwright base", tags: "Coca-Cola, PDP", proxyAccount: "Oxylabs — Datacenter", createdAt: "2025-10-02 11:45", updatedAt: "2026-06-01 10:20" },
      { id: "prj-carrefour-shelf", name: "Carrefour FR — Shelf", status: "ACTIVE", outputSchema: "Shelf output v1", projectTemplate: "Scrapy base", tags: "Shelf, EMEA", proxyAccount: "Smartproxy — Residential", createdAt: "2025-08-21 08:15", updatedAt: "2026-04-19 16:50" },
      { id: "prj-tesco-ads", name: "Tesco — Sponsored Ads", status: "ACTIVE", outputSchema: "Ads output v2", projectTemplate: "Playwright base", tags: "Ads, RMM", proxyAccount: "Bright Data — Datacenter", createdAt: "2025-11-15 13:22", updatedAt: "2026-06-05 09:45" },
      { id: "prj-kroger-plp", name: "Kroger — PLP", status: "INACTIVE", outputSchema: "PLP output v2", projectTemplate: "Scrapy base", tags: "PLP, NA", proxyAccount: "Oxylabs — Residential", createdAt: "2025-07-30 10:05", updatedAt: "2026-02-28 11:30" },
      { id: "prj-amz-media-uk", name: "Amazon UK — Media", status: "ARCHIVED", outputSchema: "Media output v1", projectTemplate: "Playwright base", tags: "Media, EMEA", proxyAccount: "Smartproxy — Mobile", createdAt: "2026-01-18 14:40", updatedAt: "2026-06-08 15:10" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "status", label: "Status", type: "select", required: true, options: PROJECT_STATUS },
      { key: "outputSchema", label: "Output schema", type: "text", required: false },
      { key: "projectTemplate", label: "Project template", type: "text", required: false },
      { key: "proxyAccount", label: "Proxy account", type: "text", required: false },
      { key: "tags", label: "Tags", type: "text", required: false },
    ],
  },

  // ---- Project tags (data-collector-api) ---------------------------------
  "dc-tags": {
    key: "dc-tags",
    title: "Tags",
    addLabel: "Add tag",
    search: "Search tags by name",
    filters: ["Name"],
    total: 84,
    columns: [
      { label: "Name", key: "name" },
      { label: "Projects count", key: "usedByProjectsCount" },
      { label: "Created at", key: "createdAt" },
    ],
    rows: [
      { id: "tag-beverages", name: "Beverages", usedByProjectsCount: 142, createdAt: "2025-06-10 09:00" },
      { id: "tag-coca-cola", name: "Coca-Cola", usedByProjectsCount: 96, createdAt: "2025-06-10 09:02" },
      { id: "tag-pdp", name: "PDP", usedByProjectsCount: 73, createdAt: "2025-07-01 10:15" },
      { id: "tag-ads", name: "Ads", usedByProjectsCount: 51, createdAt: "2025-07-22 11:30" },
      { id: "tag-emea", name: "EMEA", usedByProjectsCount: 64, createdAt: "2025-08-05 08:45" },
      { id: "tag-q2-2026", name: "Q2 2026", usedByProjectsCount: 38, createdAt: "2026-03-31 16:20" },
    ],
    fields: [{ key: "name", label: "Name", type: "text", required: true }],
  },

  // ---- Templates (data-collector-api) ------------------------------------
  "dc-templates": {
    key: "dc-templates",
    title: "Templates",
    addLabel: "Add template",
    search: "Search templates by name",
    filters: ["Name", "Proxy accounts"],
    total: 47,
    columns: [
      { label: "Name", key: "name" },
      { label: "Description", key: "description" },
      { label: "Environment variables", key: "environmentVariables" },
      { label: "Proxy accounts", key: "allowedProxyAccounts" },
    ],
    rows: [
      { id: "tpl-playwright-base", name: "Playwright base", description: "Headless Chromium with stealth + retry", environmentVariables: "HEADLESS, TIMEOUT_MS, RETRIES", allowedProxyAccounts: "Bright Data, Oxylabs" },
      { id: "tpl-scrapy-base", name: "Scrapy base", description: "Scrapy spider with rotating user agents", environmentVariables: "CONCURRENCY, DOWNLOAD_DELAY", allowedProxyAccounts: "Smartproxy" },
      { id: "tpl-api-fetch", name: "API fetch", description: "Direct API extraction, no browser", environmentVariables: "API_KEY, RATE_LIMIT", allowedProxyAccounts: "Bright Data — Datacenter" },
      { id: "tpl-pdp-multivariant", name: "PDP multivariant", description: "PDP crawl that expands variant grids", environmentVariables: "MAX_VARIANTS, TIMEOUT_MS", allowedProxyAccounts: "Oxylabs" },
      { id: "tpl-media-capture", name: "Media capture", description: "Screenshot + OCR pipeline for media", environmentVariables: "SCREENSHOT, OCR_LANG", allowedProxyAccounts: "Bright Data" },
      { id: "tpl-mobile-app", name: "Mobile app", description: "Mobile-emulated session for app shelves", environmentVariables: "DEVICE, GEO", allowedProxyAccounts: "Smartproxy — Mobile" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: false },
      { key: "environmentVariables", label: "Environment variables", type: "textarea", required: false },
      { key: "allowedProxyAccounts", label: "Allowed proxy accounts", type: "text", required: false },
    ],
  },

  // ---- Output schemas (data-collector-api) -------------------------------
  "dc-output-schemas": {
    key: "dc-output-schemas",
    title: "Output schemas",
    addLabel: "Add output schema",
    search: "Search output schemas by name",
    filters: ["Name", "Data types"],
    total: 63,
    columns: [
      { label: "Name", key: "name" },
      { label: "Description", key: "description" },
      { label: "Fields", key: "fields" },
    ],
    rows: [
      { id: "os-search-v3", name: "Search output v3", description: "Ranked search results with sponsored flag", fields: "rank, title, price, sponsored, url" },
      { id: "os-pdp-v2", name: "PDP output v2", description: "Product detail page with availability", fields: "title, price, availability, rating, images" },
      { id: "os-shelf-v1", name: "Shelf output v1", description: "Category shelf listing", fields: "position, title, price, promo" },
      { id: "os-ads-v2", name: "Ads output v2", description: "Sponsored placements with creative", fields: "slot, brand, ocrText, imageUrl" },
      { id: "os-plp-v2", name: "PLP output v2", description: "Product list page with pagination", fields: "page, rank, title, price, url" },
      { id: "os-media-v1", name: "Media output v1", description: "Media capture with screenshot ref", fields: "pageType, screenshotUrl, ocrText" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: false },
      { key: "fields", label: "Fields", type: "textarea", required: false },
    ],
  },

  // ---- Data types (data-collector-api) -----------------------------------
  "dc-data-types": {
    key: "dc-data-types",
    title: "Data types",
    addLabel: "Add data type",
    search: "Search data types by name",
    filters: ["Name"],
    total: 38,
    columns: [
      { label: "Name", key: "name" },
      { label: "Rule", key: "rule" },
    ],
    rows: [
      { id: "dt-price", name: "price", rule: "decimal, strip currency symbol, dot decimal" },
      { id: "dt-rank", name: "rank", rule: "integer >= 1" },
      { id: "dt-url", name: "url", rule: "absolute http(s) URL" },
      { id: "dt-boolean", name: "boolean", rule: "true/false, yes/no, 1/0" },
      { id: "dt-text", name: "text", rule: "trimmed UTF-8 string" },
      { id: "dt-date", name: "date", rule: "ISO-8601 date" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "rule", label: "Rule", type: "textarea", required: true },
    ],
  },

  // ---- Orders (orders-management-api) ------------------------------------
  "dc-orders": {
    key: "dc-orders",
    title: "Orders",
    addLabel: "Add order",
    search: "Search orders by name",
    filters: [
      "Ids",
      "Stores",
      "Projects",
      "Delivery methods",
      "Extraction types",
      "Created at",
      "Is active",
      "Scheduling",
      "Timeframes",
    ],
    total: 4028,
    columns: [
      { label: "Name", key: "name" },
      { label: "Store", key: "store" },
      { label: "Project", key: "project" },
      { label: "Delivery method", key: "deliveryMethodType" },
      { label: "Extraction type", key: "inputsInstructionsType" },
      { label: "Timeframe", key: "timeframe" },
      { label: "Scheduling", key: "scheduling" },
      { label: "Active", key: "isActive" },
      { label: "Created at", key: "createdAt" },
      { label: "Updated at", key: "updatedAt" },
    ],
    rows: [
      { id: "ord-ah-web-nl-content-pdp-eco2", name: "Albert Heijn Web NL - Content PDP - eco2 - Content 30", store: "Albert Heijn Web NL", project: "Albert Heijn Web GLOBAL - PDP", deliveryMethodType: "s3", inputsInstructionsType: "ecometrypdp", timeframe: "content 30d", scheduling: "55 3 * * ?", isActive: true, machineSize: "XXS", cacheValidity: 86400, bucket: "prod-data-collector-dispatcher", folder: "ds_pdp", createdAt: "2024-04-02 12:15", updatedAt: "2026-07-13 14:47" },
      { id: "ord-glovo-es-odm-plp", name: "Glovo ES - ODM PLP (Quick Commerce & Restaurants)", store: "Glovo ES", project: "Glovo ES - ODM", deliveryMethodType: "s3", inputsInstructionsType: "ecometryplp", timeframe: "All Day (1 x day)", scheduling: "15 4 * * ?", isActive: true, machineSize: "M", cacheValidity: 0, bucket: "prod-data-collector-dispatcher", folder: "ds_plp", deliveryOutputsJson: '[{"conditionKey":"","method":"s3","attrs":{"bucket":"prod-data-collector-dispatcher","folder":"ds_plp"}},{"conditionKey":"quick_commerce","method":"s3","attrs":{"bucket":"prod-data-collector-dispatcher","folder":"ds_qcommerce"}},{"conditionKey":"restaurant","method":"firehose","attrs":{"streamName":"odm-restaurants-stream"}}]', createdAt: "2026-07-10 09:00", updatedAt: "2026-07-15 10:00" },
      { id: "ord-7eleven-th-daily-plp", name: "7 - Eleven APP TH - Daily PLP", store: "7 - Eleven APP TH", project: "7-Eleven APP TH - CompleteOffer", deliveryMethodType: "s3", inputsInstructionsType: "ecometryplp", timeframe: "All Day (1 x day)", scheduling: "32 5 * * ?", isActive: true, machineSize: "S", cacheValidity: 0, createdAt: "2025-08-19 18:40", updatedAt: "2025-08-19 18:40" },
      { id: "ord-7eleven-th-geoloc", name: "7 - Eleven APP TH - Geoloc PLP", store: "7 - Eleven APP TH", project: "7-Eleven APP TH - CompleteOffer", deliveryMethodType: "s3", inputsInstructionsType: "ecometryplp", timeframe: "geoloc", scheduling: "28 00 * * ?", isActive: true, machineSize: "S", cacheValidity: 0, createdAt: "2025-08-19 18:40", updatedAt: "2025-12-26 18:24" },
      { id: "ord-7eleven-th-media", name: "7 - Eleven APP TH - Media", store: "7 - Eleven APP TH", project: "7-Eleven APP TH - Media", deliveryMethodType: "s3", inputsInstructionsType: "ecometrymedia", timeframe: "media", scheduling: "32 6 * * ?", isActive: true, machineSize: "S", cacheValidity: 0, createdAt: "2025-08-20 11:26", updatedAt: "2025-08-20 11:26" },
      { id: "ord-abgr-ads", name: "AB-Delhaize GR - Ads", store: "AB GR", project: "AB-Delhaize GR - Ads", deliveryMethodType: "s3", inputsInstructionsType: "ecometryad", timeframe: "All Day (1 x day)", scheduling: "25 1 * * ?", isActive: true, machineSize: "S", cacheValidity: 0, createdAt: "2025-01-27 16:47", updatedAt: "2025-01-27 16:47" },
      { id: "ord-abgr-content-pdp", name: "AB-Delhaize GR - Content PDP", store: "AB GR", project: "AB GR - PDP", deliveryMethodType: "s3", inputsInstructionsType: "ecometrypdp", timeframe: "content 30d", scheduling: "57 1 * * ?", isActive: true, machineSize: "M", cacheValidity: 86400, createdAt: "2025-01-28 16:09", updatedAt: "2026-07-13 14:47" },
      { id: "ord-abgr-daily-pdp", name: "AB-Delhaize GR - Daily PDP", store: "AB GR", project: "AB GR - PDP", deliveryMethodType: "s3", inputsInstructionsType: "ecometrypdp", timeframe: "All Day (1 x day)", scheduling: "43 10 * * ?", isActive: true, machineSize: "M", cacheValidity: 0, createdAt: "2025-01-28 16:09", updatedAt: "2025-06-08 19:01" },
      { id: "ord-abgr-daily-plp", name: "AB-Delhaize GR - Daily PLP", store: "AB GR", project: "AB-Delhaize GR & Delhaize BE - PLP", deliveryMethodType: "s3", inputsInstructionsType: "ecometryplp", timeframe: "All Day (1 x day)", scheduling: "30 1 * * ?", isActive: true, machineSize: "M", cacheValidity: 0, createdAt: "2025-01-27 16:54", updatedAt: "2025-01-27 16:54" },
      { id: "ord-abgr-daily-search", name: "AB-Delhaize GR - Daily Search", store: "AB GR", project: "AB-Delhaize GR & Delhaize BE - PLP", deliveryMethodType: "s3", inputsInstructionsType: "ecometrysearch", timeframe: "All Day (1 x day)", scheduling: "51 2 * * ?", isActive: true, machineSize: "M", cacheValidity: 0, createdAt: "2025-01-27 16:55", updatedAt: "2025-12-26 16:34" },
      { id: "ord-abgr-daily-shelf", name: "AB-Delhaize GR - Daily Shelf", store: "AB GR", project: "AB-Delhaize GR & Delhaize BE - PLP", deliveryMethodType: "s3", inputsInstructionsType: "ecometryshelf", timeframe: "All Day (1 x day)", scheduling: "24 1 * * ?", isActive: true, machineSize: "M", cacheValidity: 0, createdAt: "2025-01-27 16:55", updatedAt: "2025-12-26 16:28" },
      { id: "ord-ahorramas-ads", name: "Ahorramas ES - Ads", store: "Ahorramas ES", project: "Ahorramas ES - Ads", deliveryMethodType: "s3", inputsInstructionsType: "ecometryad", timeframe: "All Day (1 x day)", scheduling: "59 2 * * ?", isActive: true, machineSize: "S", cacheValidity: 0, createdAt: "2024-02-09 16:22", updatedAt: "2024-02-09 16:22" },
      { id: "ord-ahorramas-content-pdp", name: "Ahorramas ES - Content PDP", store: "Ahorramas ES", project: "Ahorramas ES - PDP", deliveryMethodType: "s3", inputsInstructionsType: "ecometrypdp", timeframe: "content 30d", scheduling: "38 7 * * ?", isActive: true, machineSize: "M", cacheValidity: 86400, createdAt: "2024-04-02 12:40", updatedAt: "2026-07-13 14:47" },
      { id: "ord-ahorramas-daily-pdp", name: "Ahorramas ES - Daily PDP", store: "Ahorramas ES", project: "Ahorramas ES - PDP", deliveryMethodType: "s3", inputsInstructionsType: "ecometrypdp", timeframe: "All Day (1 x day)", scheduling: "13 3 * * ?", isActive: true, machineSize: "M", cacheValidity: 0, createdAt: "2024-02-29 10:07", updatedAt: "2024-04-19 14:41" },
      { id: "ord-ahorramas-daily-plp", name: "Ahorramas ES - Daily PLP", store: "Ahorramas ES", project: "Ahorramas ES - PLP", deliveryMethodType: "s3", inputsInstructionsType: "ecometryplp", timeframe: "All Day (1 x day)", scheduling: "4 1 * * ?", isActive: true, machineSize: "M", cacheValidity: 0, createdAt: "2024-04-02 12:29", updatedAt: "2025-12-26 16:26" },
      { id: "ord-ahorramas-geoloc", name: "Ahorramas ES - Geoloc", store: "Ahorramas ES", project: "Ahorramas ES - PLP", deliveryMethodType: "s3", inputsInstructionsType: "ecometryplp", timeframe: "geoloc", scheduling: "4 1 * * ?", isActive: true, machineSize: "M", cacheValidity: 0, createdAt: "2024-06-22 22:57", updatedAt: "2025-12-26 16:28" },
      { id: "ord-ah-app-nl-content-pdp", name: "Albert Heijn APP NL - Content PDP", store: "Albert Heijn APP NL", project: "Albert Heijn APP NL - PDP", deliveryMethodType: "firehose", inputsInstructionsType: "ecometrypdp", timeframe: "content 30d", scheduling: "32 3 * * ?", isActive: true, machineSize: "M", cacheValidity: 86400, createdAt: "2024-04-02 12:15", updatedAt: "2026-07-13 14:47" },
      { id: "ord-ah-app-nl-daily-search", name: "Albert Heijn APP NL - Daily Search", store: "Albert Heijn APP NL", project: "Albert Heijn APP NL - PLP", deliveryMethodType: "firehose", inputsInstructionsType: "ecometrysearch", timeframe: "All Day (1 x day)", scheduling: "39 4 * * ?", isActive: true, machineSize: "M", cacheValidity: 0, createdAt: "2024-02-09 15:57", updatedAt: "2024-02-09 15:57" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: false },
      { key: "store", label: "Store", type: "text", required: true },
      { key: "project", label: "Project", type: "text", required: true },
      { key: "timezone", label: "Timezone", type: "text", required: false },
      { key: "inputsInstructionsType", label: "Extraction type", type: "select", required: true, options: EXTRACTION_TYPES },
      { key: "deliveryMethodType", label: "Delivery method", type: "select", required: true, options: DELIVERY_METHODS },
      { key: "timeframe", label: "Timeframe", type: "text", required: false },
      { key: "scheduling", label: "Scheduling (cron)", type: "text", required: false },
      { key: "machineSize", label: "Machine size", type: "select", required: false, options: MACHINE_SIZES },
      { key: "cacheValidity", label: "Cache validity (seconds, 0–86400)", type: "number", required: false },
      { key: "isActive", label: "Active", type: "checkbox", required: false },
    ],
  },

  // ---- Executions (orders-management-api) --------------------------------
  "dc-executions": {
    key: "dc-executions",
    title: "Executions",
    addLabel: "Add execution",
    search: "Search executions by details",
    filters: [
      "Details",
      "Ids",
      "Orders",
      "Stores",
      "Extraction types",
      "Timeframes",
      "Status",
      "Tasks with errors",
      "Tasks with validation issues",
      "Type",
      "Projects",
      "Delivery methods",
      "Proxy accounts",
      "Modes",
      "Created at",
    ],
    total: 18452,
    columns: [
      { label: "Id", key: "id" },
      { label: "Order", key: "order" },
      { label: "Store", key: "store" },
      { label: "Status", key: "status" },
      { label: "Tasks", key: "tasksSummary" },
      { label: "Errors", key: "errorsSummary" },
      { label: "Project", key: "project" },
      { label: "Extraction type", key: "inputsInstructionsType" },
      { label: "Delivery method", key: "deliveryMethodType" },
      { label: "Proxy account", key: "proxyAccount" },
      { label: "Requests", key: "requests" },
      { label: "Bandwidth", key: "bandwidth" },
      { label: "Type", key: "type" },
      { label: "Mode", key: "mode" },
      { label: "Created at", key: "createdAt" },
    ],
    rows: [
      { id: "exe-100482", order: "Amazon US Search — Daily", store: "Amazon US", status: "FINISHED", tasksSummary: "1240 / 1240", errorsSummary: "0.0%", project: "Amazon US — Search", inputsInstructionsType: "SEARCH", deliveryMethodType: "Firehose", proxyAccount: "Bright Data — Residential", requests: 18420, bandwidth: "4.2 GB", type: "FULL", mode: "AUTO", createdAt: "2026-06-09 06:00" },
      { id: "exe-100483", order: "Walmart PDP — Weekly", store: "Walmart", status: "STARTED", tasksSummary: "820 / 2100", errorsSummary: "1.2%", project: "Walmart — PDP", inputsInstructionsType: "PDP", deliveryMethodType: "S3", proxyAccount: "Oxylabs — Datacenter", requests: 9240, bandwidth: "2.1 GB", type: "FULL", mode: "AUTO", createdAt: "2026-06-09 05:00" },
      { id: "exe-100481", order: "Carrefour Shelf — Daily", store: "Carrefour FR", status: "FINISHED", tasksSummary: "640 / 640", errorsSummary: "0.6%", project: "Carrefour FR — Shelf", inputsInstructionsType: "SHELF", deliveryMethodType: "Rabbitmq", proxyAccount: "Smartproxy — Residential", requests: 7110, bandwidth: "1.4 GB", type: "FULL", mode: "AUTO", createdAt: "2026-06-09 04:00" },
      { id: "exe-100479", order: "Tesco Ads — Daily", store: "Tesco", status: "ERROR", tasksSummary: "410 / 900", errorsSummary: "12.4%", project: "Tesco — Sponsored Ads", inputsInstructionsType: "AD", deliveryMethodType: "S3", proxyAccount: "Bright Data — Datacenter", requests: 5230, bandwidth: "3.0 GB", type: "FULL", mode: "AUTO", createdAt: "2026-06-09 07:00" },
      { id: "exe-100478", order: "Kroger PLP — Weekly", store: "Kroger", status: "CANCELLED", tasksSummary: "0 / 1500", errorsSummary: "—", project: "Kroger — PLP", inputsInstructionsType: "PLP", deliveryMethodType: "Firehose", proxyAccount: "Oxylabs — Residential", requests: 0, bandwidth: "0 B", type: "RE_EXECUTION", mode: "MANUAL", createdAt: "2026-06-08 09:12" },
      { id: "exe-100486", order: "Amazon UK Media — Daily", store: "Amazon UK", status: "PENDING", tasksSummary: "0 / 480", errorsSummary: "—", project: "Amazon UK — Media", inputsInstructionsType: "MEDIA", deliveryMethodType: "S3", proxyAccount: "Smartproxy — Mobile", requests: 0, bandwidth: "0 B", type: "FULL", mode: "AUTO", createdAt: "2026-06-10 08:00" },
    ],
    fields: [
      { key: "order", label: "Order", type: "text", required: false },
      { key: "store", label: "Store", type: "text", required: false },
      { key: "project", label: "Project", type: "text", required: false },
      { key: "proxyAccount", label: "Proxy account", type: "text", required: false },
      { key: "status", label: "Status", type: "select", required: false, options: EXECUTION_STATUS },
      { key: "type", label: "Type", type: "select", required: false, options: EXECUTION_TYPES },
      { key: "mode", label: "Mode", type: "select", required: false, options: EXECUTION_MODES },
      { key: "inputsInstructionsType", label: "Extraction type", type: "select", required: false, options: EXTRACTION_TYPES },
      { key: "deliveryMethodType", label: "Delivery method", type: "select", required: false, options: DELIVERY_METHODS },
      { key: "details", label: "Details", type: "textarea", required: false },
    ],
  },

  // ---- Tasks (orders-management-api; reached from Executions) -------------
  "dc-tasks": {
    key: "dc-tasks",
    title: "Tasks",
    addLabel: "",
    search: "Search tasks by details",
    filters: ["Details", "Status", "Page type", "Input", "Error category"],
    total: 248310,
    columns: [
      { label: "Id", key: "id" },
      { label: "Execution", key: "execution" },
      { label: "Start date", key: "startDateTime" },
      { label: "End date", key: "endDateTime" },
      { label: "Runtime", key: "runtime" },
      { label: "Status", key: "status" },
      { label: "Error category", key: "errorCategory" },
    ],
    rows: [
      { id: "exe-100482-1", execution: "exe-100482", startDateTime: "2026-06-09 06:01", endDateTime: "2026-06-09 06:01", runtime: "38s", status: "SUCCESS", errorCategory: "-" },
      { id: "exe-100482-2", execution: "exe-100482", startDateTime: "2026-06-09 06:01", endDateTime: "2026-06-09 06:02", runtime: "52s", status: "WARNING", errorCategory: "TEMPLATE_ERROR" },
      { id: "exe-100483-1", execution: "exe-100483", startDateTime: "2026-06-09 05:02", endDateTime: "2026-06-09 05:03", runtime: "1m 12s", status: "SUCCESS", errorCategory: "-" },
      { id: "exe-100479-1", execution: "exe-100479", startDateTime: "2026-06-09 07:05", endDateTime: "2026-06-09 07:05", runtime: "9s", status: "ERROR", errorCategory: "PROXY_ERROR" },
      { id: "exe-100479-2", execution: "exe-100479", startDateTime: "2026-06-09 07:05", endDateTime: "2026-06-09 07:06", runtime: "14s", status: "ERROR", errorCategory: "CONNECTION_ERROR" },
      { id: "exe-100481-1", execution: "exe-100481", startDateTime: "2026-06-09 04:01", endDateTime: "2026-06-09 04:01", runtime: "27s", status: "VOID", errorCategory: "DATA_COLLECTOR_ERROR" },
    ],
    fields: [
      { key: "status", label: "Status", type: "select", required: false, options: TASK_STATUS },
      { key: "errorCategory", label: "Error category", type: "select", required: false, options: ERROR_CATEGORIES },
      { key: "details", label: "Details", type: "textarea", required: false },
    ],
  },

  // ---- Proxy accounts (data-collector-proxies-api) -----------------------
  "dc-proxy-accounts": {
    key: "dc-proxy-accounts",
    title: "Proxy accounts",
    addLabel: "Add proxy account",
    search: "Search by name, provider's name or type name",
    filters: ["Term", "Id", "Is active", "Region", "Proxy providers"],
    total: 126,
    columns: [
      { label: "Name", key: "name" },
      { label: "Slug", key: "slug" },
      { label: "Provider", key: "provider" },
      { label: "Type", key: "type" },
      { label: "Active", key: "isActive" },
      { label: "Business models", key: "businessModelType" },
    ],
    rows: [
      { id: "pa-bd-res", name: "Bright Data — Residential", slug: "brightdata-residential", provider: "Bright Data", type: "Residential", host: "brd.superproxy.io", port: 22225, region: "es", businessModelType: "Per GB", isActive: true },
      { id: "pa-bd-dc", name: "Bright Data — Datacenter", slug: "brightdata-datacenter", provider: "Bright Data", type: "Datacenter", host: "brd.superproxy.io", port: 22230, region: "gb", businessModelType: "Per request", isActive: true },
      { id: "pa-oxy-res", name: "Oxylabs — Residential", slug: "oxylabs-residential", provider: "Oxylabs", type: "Residential", host: "pr.oxylabs.io", port: 7777, region: "br-sp", businessModelType: "Per GB", isActive: true },
      { id: "pa-oxy-dc", name: "Oxylabs — Datacenter", slug: "oxylabs-datacenter", provider: "Oxylabs", type: "Datacenter", host: "dc.oxylabs.io", port: 8001, region: "us", businessModelType: "Subscription", isActive: true },
      { id: "pa-smart-res", name: "Smartproxy — Residential", slug: "smartproxy-residential", provider: "Smartproxy", type: "Residential", host: "gate.smartproxy.com", port: 7000, region: "fr", businessModelType: "Per GB", isActive: true },
      { id: "pa-smart-mob", name: "Smartproxy — Mobile", slug: "smartproxy-mobile", provider: "Smartproxy", type: "Mobile", host: "gate.smartproxy.com", port: 10000, region: "de", businessModelType: "Per GB", isActive: false },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", required: false },
      { key: "provider", label: "Provider", type: "text", required: true },
      { key: "type", label: "Type", type: "select", required: true, options: PROXY_TYPE_NAMES },
      { key: "host", label: "Host", type: "text", required: true },
      { key: "port", label: "Port", type: "number", required: true },
      { key: "region", label: "Limited regions", type: "text", required: false },
      { key: "businessModelType", label: "Business model", type: "text", required: false },
      { key: "isActive", label: "Active", type: "checkbox", required: false },
    ],
  },

  // ---- Proxy providers (data-collector-proxies-api) ----------------------
  "dc-proxy-providers": {
    key: "dc-proxy-providers",
    title: "Proxy providers",
    addLabel: "Add proxy provider",
    search: "Search providers by name",
    filters: ["Name", "Slug", "Id", "Active"],
    total: 18,
    columns: [
      { label: "Name", key: "name" },
      { label: "Slug", key: "slug" },
      { label: "Active", key: "isActive" },
    ],
    rows: [
      { id: "pp-brightdata", name: "Bright Data", slug: "bright-data", isActive: true },
      { id: "pp-oxylabs", name: "Oxylabs", slug: "oxylabs", isActive: true },
      { id: "pp-smartproxy", name: "Smartproxy", slug: "smartproxy", isActive: true },
      { id: "pp-zyte", name: "Zyte", slug: "zyte", isActive: true },
      { id: "pp-netnut", name: "NetNut", slug: "netnut", isActive: false },
      { id: "pp-iproyal", name: "IPRoyal", slug: "iproyal", isActive: false },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", required: false },
      { key: "isActive", label: "Active", type: "checkbox", required: false },
    ],
  },

  // ---- Error indicators (orders-management-api) --------------------------
  "dc-error-indicators": {
    key: "dc-error-indicators",
    title: "Error indicators",
    addLabel: "Add error indicator",
    search: "Search error indicators by name",
    filters: ["Name", "Categories", "Allow automatic re-execution"],
    total: 72,
    columns: [
      { label: "Name", key: "name" },
      { label: "Category", key: "errorCategory" },
      { label: "Regex", key: "regex" },
      { label: "Output sample", key: "outputSample" },
      { label: "Auto re-execution", key: "allowAutomaticTasksReExecution" },
    ],
    rows: [
      { id: "ei-captcha", name: "Captcha detected", errorCategory: "CONNECTION_ERROR", regex: "(?i)captcha|are you a robot", outputSample: "Please verify you are not a robot", allowAutomaticTasksReExecution: true },
      { id: "ei-403", name: "Access forbidden", errorCategory: "PROXY_ERROR", regex: "HTTP 403|Access Denied", outputSample: "403 Forbidden", allowAutomaticTasksReExecution: true },
      { id: "ei-timeout", name: "Navigation timeout", errorCategory: "CONNECTION_ERROR", regex: "(?i)timeout exceeded", outputSample: "Navigation timeout of 30000 ms exceeded", allowAutomaticTasksReExecution: true },
      { id: "ei-empty", name: "Empty product grid", errorCategory: "DATA_COLLECTOR_ERROR", regex: "(?i)no results|0 products", outputSample: "Showing 0 results", allowAutomaticTasksReExecution: false },
      { id: "ei-selector", name: "Price selector missing", errorCategory: "TEMPLATE_ERROR", regex: "price\\s*:\\s*null", outputSample: "{ price: null }", allowAutomaticTasksReExecution: false },
      { id: "ei-bad-seed", name: "Seed URL not found", errorCategory: "SEED_ERROR", regex: "HTTP 404|Page not found", outputSample: "404 Not Found", allowAutomaticTasksReExecution: false },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "errorCategory", label: "Category", type: "select", required: true, options: ERROR_CATEGORIES },
      { key: "regex", label: "Regex", type: "text", required: true },
      { key: "outputSample", label: "Output sample", type: "textarea", required: false },
      { key: "allowAutomaticTasksReExecution", label: "Allow automatic re-execution", type: "checkbox", required: false },
    ],
  },
};

// Menu/route manifest — drives the Data Collector sidebar and route generation.
export type DcRoute = { key: string; base: string; hasNew: boolean };
export const DC_ROUTES: DcRoute[] = [
  { key: "dc-projects", base: "/data-collector/projects", hasNew: true },
  { key: "dc-tags", base: "/data-collector/projects/tags", hasNew: true },
  { key: "dc-templates", base: "/data-collector/templates", hasNew: true },
  { key: "dc-output-schemas", base: "/data-collector/outputs/schemas", hasNew: true },
  { key: "dc-data-types", base: "/data-collector/outputs/data-types", hasNew: true },
  { key: "dc-orders", base: "/data-collector/orders", hasNew: true },
  { key: "dc-executions", base: "/data-collector/executions", hasNew: true },
  { key: "dc-tasks", base: "/data-collector/tasks", hasNew: false },
  { key: "dc-proxy-accounts", base: "/data-collector/settings/proxies/accounts", hasNew: true },
  { key: "dc-proxy-providers", base: "/data-collector/settings/proxies/providers", hasNew: true },
  { key: "dc-error-indicators", base: "/data-collector/settings/error-indicators", hasNew: true },
];
