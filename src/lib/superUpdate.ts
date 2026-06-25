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

export type PatchFieldType = "string" | "number" | "boolean" | "enum" | "uuid" | "date";

export type PatchField = {
  /** DB column — the CSV value header is `<column>_value` (what the user types). */
  column: string;
  type: PatchFieldType;
  /** Real JSON body key / dotted path (camelCase). Defaults to `column` when identical. */
  path?: string;
  /** CSV empty cell / `null` / `\N` becomes JSON `null` (only when nullable). */
  nullable?: boolean;
  /** Allowed values for `enum`. */
  options?: string[];
  /** `number` fields that must be whole integers. */
  int?: boolean;
  note?: string;
};

export type PatchTable = {
  /** Logical table name (display). */
  table: string;
  /** Admin endpoint segment, e.g. `jobs`, `client-skus`. */
  resource: string;
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
    label: "ecometry-tasks-api",
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
    label: "product-api",
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
    label: "codification-api",
    host: "codification-api-prod.v2.shalion.com",
    tables: [
      {
        table: "brand", resource: "brands", pk: "brand_id",
        fields: [
          { column: "name", type: "string" },
          { column: "manufacturer_id", type: "uuid", path: "manufacturerId", nullable: true },
          { column: "status", type: "enum", options: [...STATUS] },
        ],
      },
      {
        table: "manufacturer", resource: "manufacturers", pk: "manufacturer_id",
        fields: [
          { column: "name", type: "string" },
          { column: "status", type: "enum", options: [...STATUS] },
        ],
      },
    ],
  },
  {
    slug: "visualization-api",
    label: "visualization-api",
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
    label: "backoffice-api",
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
    slug: "iam-api",
    label: "iam-api",
    host: "iam-api-prod.v2.shalion.com",
    tables: [
      {
        table: "user", resource: "users", pk: "user_id",
        fields: [
          { column: "status", type: "enum", options: [...STATUS] },
          { column: "default_application_id", type: "uuid", path: "defaultApplicationId", nullable: true },
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

/** Real PATCH URL for one row (id interpolated raw, as the live scripts do). */
export function patchUrl(service: PatchService, table: PatchTable, id = "{id}", env: PatchEnv = "prod"): string {
  return `https://${hostFor(service, env)}/v1.0/admin/${table.resource}/${id}`;
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

export type Coerced = { value: unknown; isNull: boolean; error?: string };

/**
 * Parse one CSV value cell into the typed JSON value (or null), validating it.
 * A `literal` (double-quoted) cell is always the literal string — never a NULL token,
 * never trimmed — so the user can express an empty string or the word "null".
 */
export function coerceValue(field: PatchField, rawIn: string, opts?: { literal?: boolean }): Coerced {
  const literal = opts?.literal ?? false;
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
 * Build a PATCH body that sets ONE field while PRESERVING its siblings. For a nested
 * field it READ-MODIFY-WRITES the parent object from the freshly-GET'd `record`: clone
 * the live parent (e.g. seedType.attributes), override the one leaf, and re-wrap up the
 * path — so the body carries the FULL parent (siblings intact) and is safe whether the
 * API merges or replaces that node. For a top-level field it is just `{ key: value }`.
 */
export function buildMergedBody(field: PatchField, value: unknown, record: unknown): Record<string, unknown> {
  const segs = (field.path ?? field.column).split(".");
  if (segs.length === 1) return { [segs[0]]: value };
  const parentSegs = segs.slice(0, -1);
  const leaf = segs[segs.length - 1];
  const parent = getByPath(record, parentSegs.join("."));
  let body: Record<string, unknown> = {
    ...(parent && typeof parent === "object" ? (structuredClone(parent) as Record<string, unknown>) : {}),
    [leaf]: value,
  };
  for (let i = parentSegs.length - 1; i >= 0; i--) body = { [parentSegs[i]]: body };
  return body;
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

/**
 * Rollback CSV (`<pk>,<column>_value`) of the captured OLD values for the rows that were
 * actually changed — re-runnable through Super Update (same table+field) to restore.
 */
export function buildRollbackCsv(batch: SuperUpdateBatch): string {
  const header = `${batch.pk},${batch.fieldColumn}_value`;
  const lines = batch.rows
    .filter((r) => r.status === "ok")
    .map((r) => `${r.pk},${csvCell(r.oldValue)}`);
  return [header, ...lines].join("\n");
}
