// Super Update — single-field PATCH catalogue + payload/CSV helpers.
//
// Instead of the heavy full-row bulk files (where every mandatory column must be
// filled), Super Update updates ONE column of ONE table by its primary key. It mirrors
// the real Shalion admin PATCH endpoints used by the desk-test node scripts
// (job_bu.js, patch-client-skus.js, patch_seeds_jobs_destinations.js, fix_dk.js):
//
//   PATCH https://{host}/v1.0/admin/{resource}/{id}     body: { <wireKey>: <value> }
//
// The body carries only the targeted field; an explicit NULL clears it. The CSV the user
// pastes uses the snake_case DB column (`<column>_value`), but the JSON body uses the
// real wire key — camelCase, sometimes nested (`path`, e.g. seedType.attributes.pageType)
// — exactly as the live services expect. Hosts are the real prod URLs ("Shalion APIs"
// Notion DB). PREVIEW ONLY in this mockup: the payload is real, no request is sent.

export type PatchFieldType = "string" | "number" | "boolean" | "enum" | "uuid" | "date" | "json" | "jsonleaf";

/**
 * Expected type of a value INSIDE a jsonb column (a whole-object `leaves` map, or the leaf a
 * sub-path targets). The tool validates the value against this BEFORE sending — the safety net
 * the services lack (e.g. `timeframeId` is read via a `::uuid` @Formula but never validated on
 * write, so a bare `30` silently persists and then breaks every read). "int" = whole number.
 */
export type PatchLeafType = "uuid" | "string" | "number" | "int" | "boolean" | "uuidArray" | "stringArray" | "json";

export type PatchField = {
  /** DB column — the CSV value header is `<column>_value` (what the user types). */
  column: string;
  type: PatchFieldType;
  /** Real JSON body key / dotted path (camelCase) used on the PATCH. Defaults to `column`. */
  path?: string;
  /**
   * Wire path to READ the current value on the GET snapshot, when it differs from the write
   * `path`. Needed where a service's update key ≠ its read key (e.g. orders-management writes
   * `updateReExecutionRules` but reads `reExecutionRules`). Defaults to `path`.
   */
  readPath?: string;
  /** CSV empty cell / `null` / `\N` becomes JSON `null` (only when nullable). */
  nullable?: boolean;
  /** Allowed values for `enum`. */
  options?: string[];
  /** `number` fields that must be whole integers. */
  int?: boolean;
  /**
   * For a `json` (jsonb) field: known sub-paths (relative to the column value) → expected type,
   * used to validate both a sub-path leaf edit and a whole-object paste. Unknown sub-paths fall
   * back to a smart scalar + an `*Id`/`*Ids` → UUID/UUID[] heuristic.
   */
  leaves?: Record<string, PatchLeafType>;
  /** Set on a synthetic `jsonleaf` field (from jsonLeafField) — the expected type of THAT leaf. */
  leaf?: PatchLeafType;
  note?: string;
};

export type PatchTable = {
  /** Logical table name (display). */
  table: string;
  /** Admin endpoint segment, e.g. `jobs`, `client-skus`. */
  resource: string;
  /**
   * Full base path for the record endpoint, e.g. `/v2.0/orders`. Defaults to
   * `/v1.0/admin/{resource}` (the pattern the admin APIs share). PATCH/GET hit `{basePath}/{id}`.
   */
  basePath?: string;
  /** CSV primary-key header, e.g. `job_id`. */
  pk: string;
  fields: PatchField[];
};

export type PatchService = {
  slug: string;
  label: string;
  /** Real prod host (no protocol). */
  host: string;
  tables: PatchTable[];
};

const STATUS = ["ACTIVE", "INACTIVE"] as const;

// Real services / tables / patchable columns. `column` follows the production DB
// (snake_case, used in the CSV); `path` is the real camelCase JSON body key the service
// consumes (verified against the bulk patch scripts).
export const PATCH_SERVICES: PatchService[] = [
  {
    slug: "ecometry-tasks-api",
    label: "Tasks",
    host: "ecometry-tasks-api-prod.v2.shalion.com",
    tables: [
      {
        table: "job", resource: "jobs", pk: "job_id",
        fields: [
          { column: "name", type: "string" },
          { column: "store_id", type: "uuid", path: "storeId" },
          { column: "extraction_type", type: "enum", path: "extractionType", options: ["MEDIA", "DIGITAL_SHELF_PLP", "DIGITAL_SHELF_PDP", "SEARCH", "SHELF", "AD"] },
          { column: "geoloc_mode", type: "enum", path: "geolocMode", options: ["MANUAL", "AUTOMATIC", "NO_GEOLOC", "VIRTUAL_STORE"] },
          { column: "timeframe_id", type: "uuid", path: "timeframeId", nullable: true, note: "TaskGroup / schedule" },
          { column: "business_unit", type: "enum", path: "businessUnit", options: ["CMI", "FSA", "DSM", "RMM", "MSH", "GEN"], nullable: true },
          { column: "expiration_date", type: "date", path: "expirationDate", nullable: true },
          { column: "status", type: "enum", options: [...STATUS] },
        ],
      },
      {
        // Top-level columns are simple partial patches. The seedType.attributes.* fields are
        // nested (dotted path) → the run uses READ-MODIFY-WRITE (buildMergedBody): it re-sends
        // the WHOLE attributes object (live siblings + the one overridden leaf), so a sibling
        // is never wiped whether the API merges or replaces that node, and rollback re-merges
        // the old leaf (preserving whatever is current). See buildMergedBody + superUpdateRun.
        table: "seed", resource: "seeds", pk: "seed_id",
        fields: [
          { column: "description", type: "string" },
          { column: "status", type: "enum", options: [...STATUS] },
          { column: "store_id", type: "uuid", path: "storeId" },
          { column: "page_type", type: "enum", path: "seedType.attributes.pageType", options: ["SUBCATEGORY", "CATEGORY", "HOME", "OFFERS", "BRAND_STORE", "LEGACY"], nullable: true },
          { column: "keyword_type", type: "enum", path: "seedType.attributes.keywordType", options: ["BRANDED", "CATEGORY"], nullable: true },
          { column: "max_rank", type: "number", path: "seedType.attributes.maxRank", int: true, nullable: true },
          { column: "discovery_key", type: "string", path: "seedType.attributes.discoveryKey", nullable: true },
        ],
      },
      {
        table: "timeframe", resource: "timeframes", pk: "timeframe_id",
        fields: [
          { column: "name", type: "string" },
          { column: "schedule", type: "string", note: "cron expression" },
          { column: "duration", type: "number", int: true, nullable: true },
        ],
      },
    ],
  },
  {
    slug: "product-api",
    label: "Product",
    host: "product-api-prod.v2.shalion.com",
    tables: [
      {
        table: "client_sku", resource: "client-skus", pk: "client_sku_id",
        fields: [
          { column: "name", type: "string" },
          { column: "ean", type: "string", nullable: true },
          { column: "brand_id", type: "uuid", path: "brandId", nullable: true },
          { column: "client_category_id", type: "uuid", path: "clientCategoryId", nullable: true },
          { column: "msrp", type: "number", nullable: true },
          { column: "status", type: "enum", options: [...STATUS] },
        ],
      },
      {
        table: "store_sku", resource: "store-skus", pk: "store_sku_id",
        fields: [
          { column: "url", type: "string", nullable: true },
          { column: "status", type: "enum", options: [...STATUS] },
        ],
      },
      {
        table: "assortment", resource: "assortments", pk: "assortment_id",
        fields: [
          { column: "is_automatic", type: "boolean", path: "isAutomatic" },
          { column: "is_multi_matching", type: "boolean", path: "isMultiMatching" },
          { column: "active_from", type: "date", path: "activeFrom", nullable: true },
          { column: "active_to", type: "date", path: "activeTo", nullable: true },
        ],
      },
    ],
  },
  {
    slug: "codification-api",
    label: "Codification",
    host: "codification-api-prod.v2.shalion.com",
    tables: [
      {
        // Fields verified against codification-api UpdateBrandRequestBody (camelCase; PATCH
        // /v1.0/admin/brands/{id}). The update mapper treats a null as "leave unchanged" for
        // every field EXCEPT parentId — only parentId is a nullable column that an explicit
        // null clears (empty cell here). name/defaultCategoryId/defaultManufacturerId are
        // NOT NULL and can't be cleared. Brand has NO `status`; the manufacturer FK is
        // `defaultManufacturerId` (there is no plain `manufacturerId` on Brand — that lives on
        // brand-country-manufacturers). `defaultManufacturerName` is read-only (not patchable).
        //
        // IMPORTANT: the PATCH body uses FLAT ids (parentId, …) but the GET response nests the
        // relations as objects — `parent` (null when none), `defaultCategory`, `defaultManufacturer`,
        // each with `.id`, and NO flat `…Id` keys. So the snapshot must READ the id via readPath
        // (e.g. parent.id) while the PATCH still WRITES the flat key (parentId).
        table: "brand", resource: "brands", pk: "brand_id",
        fields: [
          { column: "name", type: "string", note: "unique; max 250 (cannot be cleared)" },
          { column: "default_category_id", type: "uuid", path: "defaultCategoryId", readPath: "defaultCategory.id", note: "category FK — mandatory, cannot be cleared" },
          { column: "default_manufacturer_id", type: "uuid", path: "defaultManufacturerId", readPath: "defaultManufacturer.id", note: "manufacturer FK — cannot be cleared" },
          { column: "parent_id", type: "uuid", path: "parentId", readPath: "parent.id", nullable: true, note: "parent Brand FK — leave empty to CLEAR (sets parent_id = NULL)" },
          { column: "is_white_label", type: "boolean", path: "isWhiteLabel" },
          { column: "is_multi_brand", type: "boolean", path: "isMultiBrand" },
        ],
      },
      {
        // Separate resource (not a Brand column): PATCH /v1.0/admin/brand-regular-expressions/{id}.
        // A brand's regex rule — regularExpression pairs with isNegative (UpdateBrandRegularExpressionRequestBody).
        table: "brand_regular_expression", resource: "brand-regular-expressions", pk: "brand_regular_expression_id",
        fields: [
          { column: "regular_expression", type: "string", path: "regularExpression", note: "regex; max 4000 (pair with is_negative)" },
          { column: "is_negative", type: "boolean", path: "isNegative" },
        ],
      },
      {
        table: "manufacturer", resource: "manufacturers", pk: "manufacturer_id",
        fields: [
          { column: "name", type: "string" },
          { column: "status", type: "enum", options: [...STATUS], note: "unverified against codification-api — confirm before a prod run" },
        ],
      },
    ],
  },
  {
    slug: "visualization-api",
    label: "Visualization",
    host: "visualization-api-prod.v2.shalion.com",
    tables: [
      {
        table: "datagroup", resource: "datagroups", pk: "datagroup_id",
        fields: [
          { column: "name", type: "string" },
          { column: "is_parent", type: "boolean", path: "isParent" },
          { column: "parent_id", type: "uuid", path: "parentId", nullable: true },
        ],
      },
      {
        table: "dashboardsection", resource: "dashboardsections", pk: "dashboardsection_id",
        fields: [
          { column: "name", type: "string" },
          { column: "position", type: "number", int: true, nullable: true },
          { column: "is_active", type: "boolean", path: "isActive" },
        ],
      },
    ],
  },
  {
    slug: "backoffice-api",
    label: "Clients/Retailers",
    host: "backoffice-api-prod.v2.shalion.com",
    tables: [
      {
        table: "store", resource: "stores", pk: "store_id",
        fields: [
          { column: "domain", type: "string" },
          { column: "status", type: "enum", options: [...STATUS] },
          { column: "default_timezone", type: "string", path: "defaultTimezone", nullable: true },
          { column: "active_locations_count", type: "number", path: "activeLocationsCount", int: true, nullable: true },
        ],
      },
    ],
  },
  {
    // Data collector = orders-management-api. Its `order` table is the scraping-order
    // definition (store, project, schedule, machine sizing, input/delivery instructions).
    // Record endpoint is `/v2.0/orders/{id}` (NOT the /v1.0/admin pattern the other services
    // use) and the body is camelCase (verified against the orders-management-api Kotlin DTOs
    // + the prod input_instructions.js desk-test script).
    //
    // The jsonb columns are exposed two ways: (a) a whole-object `json` field — paste the full
    // object, quote the CSV cell, and it REPLACES the column; (b) via the panel's "jsonb
    // sub-path" input on that `json` field to change ONE leaf (e.g. attributes.timeframeId) —
    // the run read-modify-writes the WHOLE column so siblings are preserved (see buildMergedBody).
    // A few stable env-var leaves are also pre-exposed as typed fields.
    slug: "orders-management-api",
    label: "Data collector",
    host: "orders-management-api-prod.v2.shalion.com",
    tables: [
      {
        table: "order", resource: "orders", basePath: "/v2.0/orders", pk: "order_id",
        fields: [
          // top-level scalar columns
          { column: "name", type: "string" },
          { column: "description", type: "string", nullable: true },
          { column: "store_id", type: "uuid", path: "storeId" },
          { column: "project_id", type: "uuid", path: "projectId" },
          { column: "scheduling", type: "string", note: "cron expression (Quartz), e.g. 0 21 4 ? * WED" },
          { column: "timezone", type: "string", nullable: true, note: "IANA tz, e.g. Europe/Brussels" },
          { column: "is_active", type: "boolean", path: "isActive" },
          { column: "is_archived", type: "boolean", path: "isArchived" },
          // jsonb columns — whole-object replace (quote the CSV cell; escape inner quotes as "").
          // To change ONE leaf instead, keep the field selected and fill the "jsonb sub-path".
          // `leaves` = known sub-paths → expected type; the tool validates the value against
          // these (and the *Id/*Ids heuristic) BEFORE sending, so a bad value can't reach the
          // service's unguarded jsonb (the timeframeId ::uuid footgun). Unlisted attributes.*
          // keys vary per input type → validated only by the *Id heuristic / smart scalar.
          { column: "environment_variables", type: "json", path: "environmentVariables",
            leaves: { parallelism: "int", maxConcurrency: "int", maxTasks: "int", "machineSize.cpu": "int", "machineSize.memoryMb": "int", "machineSize.size": "string", "machineSize.cpuLimitsMultiplier": "int", "machineSize.memoryLimitsMultiplier": "int" },
            note: "jsonb — {machineSize:{cpu,size,memoryMb,…},parallelism,maxConcurrency,maxTasks,additionalVariables}. Quote the cell, or use a sub-path." },
          { column: "inputs_instructions", type: "json", path: "inputsInstructions",
            leaves: { type: "string", "attributes.timeframeId": "uuid", "attributes.storeIds": "uuidArray", "attributes.retailer": "string", "attributes.lastOfferDays": "string" },
            note: "jsonb — {type,attributes:{…}} (type e.g. discovery / ecometrypdp …; attributes holds timeframeId, retailer, …). Quote the cell, or use a sub-path." },
          { column: "delivery_method", type: "json", path: "deliveryMethod",
            leaves: { type: "string" },
            note: "jsonb — {type,attributes:{…}} (type: rabbitmq / s3 / firehose / ecometrygeolocapi / none). Quote the cell, or use a sub-path." },
          // Read key is `reExecutionRules`; the PATCH write key is `updateReExecutionRules`
          // (custom deserializer) — hence readPath. Value shape assumed same as read. (readPath
          // ≠ path → the panel offers whole-object mode only, so `leaves` here guard the paste.)
          { column: "re_execution_rules", type: "json", path: "updateReExecutionRules", readPath: "reExecutionRules", nullable: true,
            leaves: { retries: "int", errorCategories: "stringArray", nextTriggerDelayMinutes: "int" },
            note: "jsonb — {retries,errorCategories[],nextTriggerDelayMinutes} or NULL. Write key updateReExecutionRules. Quote the cell." },
          // convenient environment_variables leaves (read-modify-write; siblings preserved)
          { column: "parallelism", type: "number", path: "environmentVariables.parallelism", int: true, note: "leaf of environment_variables" },
          { column: "max_concurrency", type: "number", path: "environmentVariables.maxConcurrency", int: true, note: "leaf of environment_variables" },
          { column: "max_tasks", type: "number", path: "environmentVariables.maxTasks", int: true, nullable: true, note: "leaf of environment_variables" },
          { column: "machine_size", type: "json", path: "environmentVariables.machineSize",
            leaves: { cpu: "int", memoryMb: "int", size: "string", cpuLimitsMultiplier: "int", memoryLimitsMultiplier: "int" },
            note: "leaf object of environment_variables: {cpu,size,memoryMb,…}. Quote the cell." },
        ],
      },
    ],
  },
];

// ---------- helpers ----------

export type PatchEnv = "dev" | "prod";

/**
 * Host for a service in the chosen environment. `host` is the prod URL; the dev host
 * derives from it (`-prod.v2.shalion.com` → `-develop.develop.shalion.com`, the pattern
 * the live scripts use, e.g. visualization-api-develop.develop.shalion.com). Dev is the
 * safe default so a single-field mass update is tried against develop first.
 */
export function hostFor(service: PatchService, env: PatchEnv): string {
  return env === "dev"
    ? service.host.replace("-prod.v2.shalion.com", "-develop.develop.shalion.com")
    : service.host;
}

/** Base path for a table's record endpoint (`{basePath}/{id}`). Defaults to the shared admin
 *  pattern `/v1.0/admin/{resource}`; a table may override it (e.g. orders → `/v2.0/orders`). */
export function tableBasePath(table: PatchTable): string {
  return table.basePath ?? `/v1.0/admin/${table.resource}`;
}

/** Real PATCH URL for one row (id interpolated raw, as the live scripts do). */
export function patchUrl(service: PatchService, table: PatchTable, id = "{id}", env: PatchEnv = "prod"): string {
  return `https://${hostFor(service, env)}${tableBasePath(table)}/${id}`;
}

/** CSV header the user should provide: `<pk>,<column>_value`. */
export function csvHeaderHint(table: PatchTable, field: PatchField): string {
  return `${table.pk},${field.column}_value`;
}

// Tokens that mean "set this column to NULL" (only on an UNquoted cell).
const NULL_TOKENS = new Set(["", "null", "NULL", "Null", "\\N", "(null)"]);
const TRUE_TOKENS = new Set(["true", "1", "yes", "y", "t"]);
const FALSE_TOKENS = new Set(["false", "0", "no", "n", "f"]);
const NUMERIC_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
export const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Validate an already-parsed JS value against a jsonb leaf type. Returns an error string, or
 * undefined when valid. null passes (it clears/leaves the key). This is the client-side guard
 * the services lack — e.g. it rejects a number `30` (or any non-UUID) for a `uuid` leaf, which
 * is what silently bricks a row whose `timeframeId` is read via a `::uuid` cast.
 */
export function leafValueError(leaf: PatchLeafType, value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const isUuid = (v: unknown) => typeof v === "string" && UUID_RE.test(v);
  switch (leaf) {
    case "uuid":
      return isUuid(value) ? undefined : `expected a UUID, got ${JSON.stringify(value)}`;
    case "string":
      return typeof value === "string" ? undefined : `expected a string, got ${typeof value}`;
    case "number":
      return typeof value === "number" && Number.isFinite(value) ? undefined : `expected a number, got ${JSON.stringify(value)}`;
    case "int":
      return typeof value === "number" && Number.isInteger(value) ? undefined : `expected a whole number, got ${JSON.stringify(value)}`;
    case "boolean":
      return typeof value === "boolean" ? undefined : `expected true/false, got ${JSON.stringify(value)}`;
    case "uuidArray":
      return Array.isArray(value) && value.every(isUuid) ? undefined : `expected an array of UUIDs`;
    case "stringArray":
      return Array.isArray(value) && value.every((x) => typeof x === "string") ? undefined : `expected an array of strings`;
    case "json":
      return undefined;
  }
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Validate a pasted whole jsonb object against its known `leaves`. The value must BE an object
 * (a scalar/array paste for a structured column is rejected). A declared leaf that is genuinely
 * ABSENT is fine, but one whose path is BLOCKED by a non-object intermediate (e.g. `attributes`
 * pasted as an array) is an error — we can't confirm the leaf and the shape is wrong. Returns
 * the first error, or undefined when valid.
 */
export function validateJsonLeaves(parsed: unknown, leaves: Record<string, PatchLeafType>): string | undefined {
  if (!isPlainObject(parsed)) return `expected a JSON object`;
  for (const [sub, leaf] of Object.entries(leaves)) {
    const segs = sub.split(".");
    let cur: unknown = parsed;
    let absent = false;
    for (let i = 0; i < segs.length - 1; i++) {
      const next = (cur as Record<string, unknown>)[segs[i]];
      if (next === undefined || next === null) { absent = true; break; } // parent absent → leaf absent (ok)
      if (!isPlainObject(next)) return `${sub}: "${segs[i]}" is not an object`; // blocked → can't validate
      cur = next;
    }
    if (absent) continue;
    const err = leafValueError(leaf, (cur as Record<string, unknown>)[segs[segs.length - 1]]);
    if (err) return `${sub}: ${err}`;
  }
  return undefined;
}

export type Coerced = { value: unknown; isNull: boolean; error?: string };

/**
 * Parse one CSV value cell into the typed JSON value (or null), validating it.
 * A `literal` (double-quoted) cell is always the literal string — never a NULL token,
 * never trimmed — so the user can express an empty string or the word "null".
 */
export function coerceValue(field: PatchField, rawIn: string, opts?: { literal?: boolean }): Coerced {
  const literal = opts?.literal ?? false;
  // jsonb columns: the cell is a JSON document (object/array/scalar). It always survives
  // CSV as a single quoted cell (splitDelimited already stripped the outer quotes + ""
  // escapes), so parse the inner text whether or not it was quoted. An empty / NULL cell
  // clears the column (only when nullable).
  if (field.type === "json") {
    const s = (rawIn ?? "").trim();
    if (NULL_TOKENS.has(s))
      return field.nullable
        ? { value: null, isNull: true }
        : { value: s, isNull: false, error: `"${field.column}" is not nullable — empty/NULL not allowed` };
    let parsed: unknown;
    try {
      parsed = JSON.parse(s);
    } catch {
      return { value: s, isNull: false, error: `invalid JSON: ${s.slice(0, 40)}${s.length > 40 ? "…" : ""}` };
    }
    // Validate the pasted object against KNOWN leaves (e.g. a bad attributes.timeframeId in a
    // whole-object paste is caught here, not just via the sub-path) — and reject a malformed
    // shape (scalar/array paste, or a non-object where an object is expected).
    if (field.leaves) {
      const err = validateJsonLeaves(parsed, field.leaves);
      if (err) return { value: parsed, isNull: false, error: err };
    }
    return { value: parsed, isNull: false };
  }
  // A single leaf INSIDE a jsonb column, targeted by a sub-path (e.g. attributes.timeframeId).
  // Only the leaf changes; the rest of the object is preserved on write (read-modify-write).
  // When the leaf's type is KNOWN (field.leaf, from jsonLeafField) the value is validated
  // against it — so a `uuid` leaf rejects a bare `30`, a `string` leaf keeps "90" a string
  // (no number drift), etc. Unknown leaves fall back to a smart scalar (quote to force string).
  if (field.type === "jsonleaf") {
    const leaf = field.leaf;
    const s = (rawIn ?? "").trim();
    if (!literal && NULL_TOKENS.has(s))
      return field.nullable
        ? { value: null, isNull: true }
        : { value: s, isNull: false, error: `"${field.column}" is not nullable — empty/NULL not allowed` };
    // string leaf: never JSON-parse — the raw text IS the value (prevents "90" → number 90).
    if (leaf === "string") return { value: literal ? (rawIn ?? "") : s, isNull: false };
    // uuid leaf: the value is the (unquoted or quoted) token, validated as a UUID.
    if (leaf === "uuid") {
      const v = literal ? (rawIn ?? "") : s;
      const err = leafValueError("uuid", v);
      return err ? { value: v, isNull: false, error: err } : { value: v, isNull: false };
    }
    // number/int/boolean/array/json/unknown: parse as JSON (or keep string), then validate.
    let value: unknown;
    if (literal) value = rawIn ?? "";
    else {
      try { value = JSON.parse(s); } catch { value = s; }
    }
    if (leaf) {
      const err = leafValueError(leaf, value);
      if (err) return { value, isNull: false, error: err };
    }
    return { value, isNull: false };
  }
  const raw = literal ? (rawIn ?? "") : (rawIn ?? "").trim();
  if (!literal && NULL_TOKENS.has(raw)) {
    if (field.nullable) return { value: null, isNull: true };
    return { value: raw, isNull: false, error: `"${field.column}" is not nullable — empty/NULL not allowed` };
  }
  switch (field.type) {
    case "number": {
      if (!NUMERIC_RE.test(raw)) return { value: raw, isNull: false, error: `not a number: "${raw}"` };
      const n = Number(raw);
      if (!Number.isFinite(n)) return { value: raw, isNull: false, error: `not a finite number: "${raw}"` };
      if (field.int && !Number.isInteger(n)) return { value: raw, isNull: false, error: `must be a whole number: "${raw}"` };
      return { value: n, isNull: false };
    }
    case "boolean": {
      const t = raw.toLowerCase();
      if (TRUE_TOKENS.has(t)) return { value: true, isNull: false };
      if (FALSE_TOKENS.has(t)) return { value: false, isNull: false };
      return { value: raw, isNull: false, error: `not a boolean: "${raw}"` };
    }
    case "uuid":
      return UUID_RE.test(raw) ? { value: raw, isNull: false } : { value: raw, isNull: false, error: `not a UUID: "${raw}"` };
    case "enum":
      return field.options && !field.options.includes(raw)
        ? { value: raw, isNull: false, error: `must be one of ${field.options.join(" / ")}` }
        : { value: raw, isNull: false };
    default:
      return { value: raw, isNull: false }; // string / uuid / date — kept as-is
  }
}

/** Build the partial PATCH body for a single field+value (nested when `path` is set). */
export function buildPayload(field: PatchField, value: unknown): Record<string, unknown> {
  const keys = (field.path ?? field.column).split(".");
  const root: Record<string, unknown> = {};
  let cur = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const next: Record<string, unknown> = {};
    cur[keys[i]] = next;
    cur = next;
  }
  cur[keys[keys.length - 1]] = value;
  return root;
}

/** True when the field is nested under a parent object that must be preserved on PATCH. */
export function isNestedField(field: PatchField): boolean {
  return (field.path ?? field.column).includes(".");
}

/**
 * Build a PATCH body that sets ONE (possibly deep) field while PRESERVING every sibling.
 * For a nested path it READ-MODIFY-WRITES the ENTIRE top-level object from the freshly
 * GET'd `record`: deep-clone the whole top-level value (e.g. all of `inputsInstructions`),
 * override just the target leaf, and send the complete object back under the top-level key.
 *
 * Re-sending the full top-level object (not merely the leaf's immediate parent) is safe at
 * ANY depth and under EITHER API semantics — whether the service deep-merges the jsonb node
 * or replaces the whole column, the body already carries the complete intended value, so no
 * sibling at any level can be dropped. Example: setting inputsInstructions.attributes.timeframeId
 * sends `{ inputsInstructions: { type, attributes: { retailer, timeframeId: <new> } } }`, so
 * `type` and `retailer` survive. For a top-level field it is just `{ key: value }`.
 */
export function buildMergedBody(field: PatchField, value: unknown, record: unknown): Record<string, unknown> {
  const segs = (field.path ?? field.column).split(".");
  if (segs.length === 1) return { [segs[0]]: value };
  const topKey = segs[0];
  const top = getByPath(record, topKey);
  const clone: Record<string, unknown> =
    top && typeof top === "object" ? (structuredClone(top) as Record<string, unknown>) : {};
  // Walk (creating intermediate objects if the live value is missing them) to the leaf's
  // parent, then set the leaf on the CLONE — never on the live record.
  let cur: Record<string, unknown> = clone;
  for (let i = 1; i < segs.length - 1; i++) {
    const k = segs[i];
    const next = cur[k];
    if (!next || typeof next !== "object") cur[k] = {};
    cur = cur[k] as Record<string, unknown>;
  }
  cur[segs[segs.length - 1]] = value;
  return { [topKey]: clone };
}

// A jsonb sub-path is a dotted chain of bare object keys — camelCase, as stored INSIDE the
// jsonb (e.g. "attributes.timeframeId"). Validated so it only ever builds JSON body keys,
// never anything that could reach the request URL.
export const JSON_SUBPATH_RE = /^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*$/;

/**
 * Expected type of the leaf a sub-path targets inside `base` (a `json` field): the field's
 * declared `leaves` map wins; otherwise a camelCase `…Id` segment → `uuid` and `…Ids` → array
 * of UUIDs (these services key relations by UUID, and a non-UUID there bricks reads). Anything
 * else is unknown → a smart scalar. `undefined` = unknown.
 */
export function leafTypeFor(base: PatchField, subPath: string): PatchLeafType | undefined {
  const declared = base.leaves?.[subPath];
  if (declared) return declared;
  const last = subPath.split(".").pop() ?? "";
  if (/(^|[a-z0-9_])Ids$/.test(last) || last === "ids") return "uuidArray";
  if (/(^|[a-z0-9_])Id$/.test(last) || last === "id") return "uuid";
  return undefined;
}

/**
 * Synthetic field for editing ONE value at `subPath` inside a jsonb column (`base`, a `json`
 * field). Its wire path is `<base path>.<subPath>` so the run read-modify-writes the whole
 * column (siblings preserved); the CSV header stays `<base column>_value`. `leaf` carries the
 * expected value type so coerceValue can VALIDATE it (a `uuid` leaf rejects a bare `30`);
 * unknown leaves fall back to a smart scalar (quote to force a string, empty to clear).
 */
export function jsonLeafField(base: PatchField, subPath: string): PatchField {
  return {
    column: base.column,
    type: "jsonleaf",
    path: `${base.path ?? base.column}.${subPath}`,
    nullable: true,
    leaf: leafTypeFor(base, subPath),
  };
}

export type ParsedRow = { line: number; id: string; raw: string; value: unknown; isNull: boolean; error?: string };
export type ParseResult = { rows: ParsedRow[]; total: number; valid: number; errors: number; nulls: number; headerSkipped: boolean };

// Split a line on `delim`, honouring double-quoted values (with "" escapes). `quoted`
// flags a field that was wrapped in quotes (→ a literal string value); the quotes are
// stripped. Works for comma (CSV) or tab (TSV / spreadsheet paste).
function splitDelimited(line: string, delim: string): { v: string; quoted: boolean }[] {
  const out: { v: string; quoted: boolean }[] = [];
  let cur = "";
  let q = false;
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else q = false;
      } else cur += ch;
    } else if (ch === '"') { q = true; quoted = true; }
    else if (ch === delim) { out.push({ v: cur, quoted }); cur = ""; quoted = false; }
    else cur += ch;
  }
  out.push({ v: cur, quoted });
  return out;
}

// Strip one pair of surrounding double-quotes from a token (→ literal cell).
function unquoteToken(s: string): { v: string; quoted: boolean } {
  const t = s.trim();
  return t.length >= 2 && t.startsWith('"') && t.endsWith('"')
    ? { v: t.slice(1, -1).replace(/""/g, '"'), quoted: true }
    : { v: t, quoted: false };
}

// Split one row into [pk, value] cells, auto-detecting the separator (all quote-aware):
//   • TAB present  → TSV (e.g. a spreadsheet/SQL paste: `"<id>"\t"<value>"`)
//   • else comma   → CSV
//   • else         → whitespace: the PK is always a bare id (no spaces) so the first token
//                    is the PK and the remainder is the value (which may contain spaces).
function splitRow(line: string): { v: string; quoted: boolean }[] {
  if (line.includes("\t")) return splitDelimited(line, "\t");
  if (line.includes(",")) return splitDelimited(line, ",");
  const m = line.match(/^(\S+)\s+([\s\S]*)$/);
  return m ? [unquoteToken(m[1]), unquoteToken(m[2])] : [unquoteToken(line)];
}

/** Parse a pasted/uploaded two-column input (`<pk>,<value>` or `<pk> <value>`) for a field. */
export function parseSuperUpdateCsv(text: string, table: PatchTable, field: PatchField): ParseResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const rows: ParsedRow[] = [];
  let headerSkipped = false;

  lines.forEach((line, idx) => {
    const cells = splitRow(line);
    // Header detection is conservative: only when the first cell IS the PK/`id` literal —
    // never inferred from the value cell (a real value could look header-ish).
    if (idx === 0) {
      const c0 = (cells[0]?.v ?? "").trim().toLowerCase();
      if (c0 === table.pk.toLowerCase() || c0 === "id") { headerSkipped = true; return; }
    }
    const id = (cells[0]?.v ?? "").trim();
    const valCell = cells[1];
    if (!id) {
      rows.push({ line: idx + 1, id: "", raw: valCell?.v ?? "", value: valCell?.v ?? "", isNull: false, error: `missing ${table.pk}` });
      return;
    }
    // The id is interpolated into the request path — reject anything that isn't a bare
    // id token (no '/', '.', '?', whitespace …) so it can't escape the {resource}/{id} path.
    if (!/^[A-Za-z0-9_-]+$/.test(id)) {
      rows.push({ line: idx + 1, id, raw: valCell?.v ?? "", value: null, isNull: false, error: `invalid ${table.pk} — expected a bare id` });
      return;
    }
    if (cells.length > 2 && cells.slice(2).some((c) => c.v.trim() !== "")) {
      rows.push({ line: idx + 1, id, raw: line, value: null, isNull: false, error: `expected 2 columns (${table.pk}, ${field.column}_value)` });
      return;
    }
    const c = coerceValue(field, valCell?.v ?? "", { literal: valCell?.quoted });
    rows.push({ line: idx + 1, id, raw: valCell?.v ?? "", value: c.value, isNull: c.isNull, error: c.error });
  });

  const errors = rows.filter((r) => r.error).length;
  const nulls = rows.filter((r) => !r.error && r.isNull).length;
  return { rows, total: rows.length, valid: rows.length - errors, errors, nulls, headerSkipped };
}

// ---------- join tables (junctions): link / unlink ----------

/**
 * A many-to-many junction patched via link (POST /{resource}/batch with [{leftKey,
 * rightKey}]) / unlink (DELETE /{resource}/{relationId}). CSV is two id columns. The
 * job-seeds shape is verified from the scripts; job-locations / job-timeframes follow the
 * same convention (verify on Dev).
 */
export type PatchJunction = {
  key: string;
  label: string;
  serviceSlug: string;
  resource: string;
  leftCol: string;   // CSV header / display, e.g. "job_id"
  rightCol: string;  // e.g. "seed_id"
  leftKey: string;   // payload key, e.g. "jobId"
  rightKey: string;  // e.g. "seedId"
  confirmed: boolean;
};

export const PATCH_JUNCTIONS: PatchJunction[] = [
  { key: "job_seed", label: "Job ↔ Seed", serviceSlug: "ecometry-tasks-api", resource: "job-seeds", leftCol: "job_id", rightCol: "seed_id", leftKey: "jobId", rightKey: "seedId", confirmed: true },
  { key: "job_location", label: "Job ↔ Location", serviceSlug: "ecometry-tasks-api", resource: "job-locations", leftCol: "job_id", rightCol: "location_id", leftKey: "jobId", rightKey: "locationId", confirmed: false },
  { key: "job_timeframe", label: "Job ↔ Timeframe", serviceSlug: "ecometry-tasks-api", resource: "job-timeframes", leftCol: "job_id", rightCol: "timeframe_id", leftKey: "jobId", rightKey: "timeframeId", confirmed: false },
];

export type JunctionOp = "link" | "unlink";

const BARE_ID = /^[A-Za-z0-9_-]+$/;

export type JunctionRow = { line: number; left: string; right: string; error?: string };
export type JunctionParseResult = { rows: JunctionRow[]; total: number; valid: number; errors: number; headerSkipped: boolean };

/** Parse a junction CSV: two id columns (comma / tab / space), both validated as bare ids. */
export function parseJunctionCsv(text: string, j: PatchJunction): JunctionParseResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const rows: JunctionRow[] = [];
  let headerSkipped = false;
  lines.forEach((line, idx) => {
    const cells = splitRow(line);
    const left = (cells[0]?.v ?? "").trim();
    const right = (cells[1]?.v ?? "").trim();
    if (idx === 0) {
      // Conservative (mirrors the field parser): only the LEFT cell, never inferred from
      // the value — a real right id could otherwise look header-ish.
      const c0 = left.toLowerCase();
      if (c0 === j.leftCol.toLowerCase() || c0 === "id") { headerSkipped = true; return; }
    }
    if (!left || !right) { rows.push({ line: idx + 1, left, right, error: `expected two ids (${j.leftCol} ${j.rightCol})` }); return; }
    if (!BARE_ID.test(left)) { rows.push({ line: idx + 1, left, right, error: `invalid ${j.leftCol} — expected a bare id` }); return; }
    if (!BARE_ID.test(right)) { rows.push({ line: idx + 1, left, right, error: `invalid ${j.rightCol} — expected a bare id` }); return; }
    rows.push({ line: idx + 1, left, right });
  });
  const errors = rows.filter((r) => r.error).length;
  return { rows, total: rows.length, valid: rows.length - errors, errors, headerSkipped };
}

/** Body for a link batch: array of `{<leftKey>, <rightKey>}` (mirrors bulk_job_seed.js). */
export function junctionLinkBody(j: PatchJunction, pairs: { left: string; right: string }[]): Record<string, string>[] {
  return pairs.map((p) => ({ [j.leftKey]: p.left, [j.rightKey]: p.right }));
}

/** Unwrap a create/list response to an array of rows (handles `[...]`, `{data}`, `{items}`, `{content}`, single obj). */
export function unwrapRows(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of ["data", "items", "content", "results"]) if (Array.isArray(o[k])) return o[k] as Record<string, unknown>[];
    if (typeof o.id === "string") return [o]; // single created row
  }
  return [];
}

// Unlink is BY RELATION ID (mirrors removeJobSeeds.js: DELETE /{resource}/{id}); the CSV is
// a single column of relation ids, validated as bare ids.
export type RelationIdRow = { line: number; id: string; error?: string };
export type RelationIdParseResult = { rows: RelationIdRow[]; total: number; valid: number; errors: number; headerSkipped: boolean };

export function parseRelationIds(text: string): RelationIdParseResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const rows: RelationIdRow[] = [];
  let headerSkipped = false;
  lines.forEach((line, idx) => {
    const id = (splitRow(line)[0]?.v ?? "").trim(); // first token only (ignore trailing cols)
    if (idx === 0 && (id.toLowerCase() === "id" || id.toLowerCase() === "relation_id")) { headerSkipped = true; return; }
    if (!id) { rows.push({ line: idx + 1, id: "", error: "missing relation id" }); return; }
    if (!BARE_ID.test(id)) { rows.push({ line: idx + 1, id, error: "invalid relation id — expected a bare id" }); return; }
    rows.push({ line: idx + 1, id });
  });
  const errors = rows.filter((r) => r.error).length;
  return { rows, total: rows.length, valid: rows.length - errors, errors, headerSkipped };
}

/** Read a relation row's left/right id — handles flat (`jobId`) and nested (`job:{id}`). */
export function relationSideId(row: unknown, payloadKey: string): string | undefined {
  if (!row || typeof row !== "object") return undefined;
  const r = row as Record<string, unknown>;
  if (typeof r[payloadKey] === "string") return r[payloadKey] as string;
  const obj = r[payloadKey.replace(/Id$/, "")]; // jobId → job
  if (obj && typeof obj === "object" && typeof (obj as Record<string, unknown>).id === "string") {
    return (obj as Record<string, unknown>).id as string;
  }
  return undefined;
}

/** Find the relation row matching a pair (by left+right id) to capture/resolve its `id`. */
export function findRelation(rows: unknown[], j: PatchJunction, left: string, right: string): Record<string, unknown> | undefined {
  return rows.find((r) => relationSideId(r, j.leftKey) === left && relationSideId(r, j.rightKey) === right) as
    | Record<string, unknown>
    | undefined;
}

export type JunctionRowResult = {
  left: string;
  right: string;
  relationId?: string; // captured on link (drives unlink rollback) / the id deleted on unlink
  status: RowStatus;
  error?: string;
  warn?: string; // e.g. linked OK but the relation id couldn't be captured → no in-tool unlink
};

export type SuperUpdateJunctionBatch = {
  id: string;
  when: string;
  kind: "apply" | "restore";
  mode: "junction";
  op: JunctionOp;
  env: PatchEnv;
  junctionKey: string;
  junctionLabel: string;
  resource: string;
  leftCol: string;
  rightCol: string;
  rows: JunctionRowResult[];
  applied: number;
  failed: number;
};

export type AnyBatch = SuperUpdateBatch | SuperUpdateJunctionBatch;
export function isJunctionBatch(b: AnyBatch): b is SuperUpdateJunctionBatch {
  return (b as SuperUpdateJunctionBatch).mode === "junction";
}

/**
 * Rollback CSV for a junction batch, re-runnable in the OPPOSITE op:
 *  - a LINK batch → the created relation ids (one column), to re-run as Unlink (by id);
 *  - an UNLINK batch → the pairs (leftCol,rightCol), to re-run as Link.
 */
export function junctionRollbackCsv(batch: SuperUpdateJunctionBatch): string {
  const ok = batch.rows.filter((r) => r.status === "ok");
  if (batch.op === "link") {
    const lines = ok.filter((r) => r.relationId).map((r) => r.relationId as string);
    return ["relation_id", ...lines].join("\n");
  }
  return [`${batch.leftCol},${batch.rightCol}`, ...ok.map((r) => `${r.left},${r.right}`)].join("\n");
}

// ---------- real run: proxy mapping + rollback history ----------

/** Live-proxy service key (live.functions) for a catalogue service — strips `-api`. */
export function proxyServiceFor(service: PatchService): string {
  return service.slug.replace(/-api$/, "");
}

/** Read a (possibly nested) value out of a fetched record by a dotted wire path. */
export function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined),
    obj,
  );
}

export type RowStatus = "ok" | "error";

/** One PK's result in a run — carries the snapshot `oldValue` for rollback. */
export type SuperUpdateRowResult = {
  pk: string;
  oldValue: unknown; // captured BEFORE the patch (the rollback value)
  newValue: unknown;
  status: RowStatus;
  error?: string;
};

/** A recorded Super Update run (session history + rollback source). */
export type SuperUpdateBatch = {
  id: string;
  when: string;
  kind: "apply" | "restore";
  mode?: "field"; // discriminates from junction batches in the shared history
  env: PatchEnv;
  serviceSlug: string;
  serviceLabel: string;
  table: string;
  resource: string;
  pk: string;
  fieldColumn: string;
  fieldPath: string;
  fieldType?: PatchFieldType; // so the Rollback CSV can round-trip a jsonb leaf faithfully
  rows: SuperUpdateRowResult[];
  applied: number;
  failed: number;
};

// CSV-escape one cell. null/undefined → bare empty cell (= restore to NULL). A STRING is
// double-quoted whenever it would otherwise re-parse ambiguously — empty string, a NULL
// token ("null"/"\N"/…), leading/trailing space, or comma/quote/newline — so the
// round-trip through parseSuperUpdateCsv restores the literal value, never a stray NULL.
function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") {
    const ambiguous = v === "" || NULL_TOKENS.has(v) || v !== v.trim() || /[",\n]/.test(v);
    return ambiguous ? `"${v.replace(/"/g, '""')}"` : v;
  }
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Rollback cell for a jsonb LEAF (jsonleaf) value — encoded so it re-parses through jsonleaf
// coercion to the SAME value when the batch's sub-path is re-selected: a STRING is always
// quoted (jsonleaf reads a quoted cell as a literal string, so "123" restores as "123" not the
// number 123), a number/boolean is bare (JSON.parse restores it), and null → empty cell. An
// object/array leaf is emitted as JSON but re-imports as a string (a quoted cell is literal) —
// use the in-tool Restore for exact object-leaf rollback.
function jsonLeafCsvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return `"${v.replace(/"/g, '""')}"`;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  const s = JSON.stringify(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * Rollback CSV (`<pk>,<column>_value`) of the captured OLD values for the rows that were
 * actually changed — re-runnable through Super Update to restore. For a jsonb sub-path (leaf)
 * batch, re-select the SAME field AND sub-path before re-running (the values round-trip through
 * jsonleaf coercion); the in-tool Restore button reverts a leaf batch without any re-selection.
 */
export function buildRollbackCsv(batch: SuperUpdateBatch): string {
  const header = `${batch.pk},${batch.fieldColumn}_value`;
  const cell = batch.fieldType === "jsonleaf" ? jsonLeafCsvCell : csvCell;
  const lines = batch.rows
    .filter((r) => r.status === "ok")
    .map((r) => `${r.pk},${cell(r.oldValue)}`);
  return [header, ...lines].join("\n");
}
