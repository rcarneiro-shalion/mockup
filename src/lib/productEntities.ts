import { SPECS } from "./approxEntities";
import { readPersistedList } from "./seedOptions";

// Distinct, sorted names from a Product approx-entity list (persisted edits if any,
// else the seeded spec rows). Used to make the MSRP dialog's Business unit / Client
// category fields searchable against the real entities data.
function entityNames(key: string): string[] {
  const persisted = readPersistedList<{ name?: string }>(`approx:${key}:v3`);
  const rows = persisted.length ? persisted : (((SPECS[key]?.rows as { name?: string }[]) ?? []));
  return [...new Set(rows.map((r) => String(r.name ?? "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export const getBusinessUnitNames = (): string[] => entityNames("business-units");
export const getClientCategoryNames = (): string[] => entityNames("client-categories");
