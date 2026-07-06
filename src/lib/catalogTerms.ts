import { getAppVersion } from "@/lib/appVersion";

// The Retailers "Location Catalog" feature is a generalization/rename of the original
// "Region System" model (real service: visualization-api — RegionSystem → Region →
// RegionLocation). Phasing mirrors the Seeds API rollout: the rename (+ the per-client
// use-cases / "Purpose" concept, which only exists post-generalization) is a Phase 3
// change, so V1/V2 present the ORIGINAL "Region system" naming and V3 keeps
// "Location Catalog". This is a TERMINOLOGY layer only — the underlying data types,
// storage keys, routes and component structure are identical across versions (same
// pattern as the Timeframes / Timeframes-(legacy) gating in the sidebar).
export type CatalogTerms = {
  legacy: boolean;
  // Root entity (data type: LocationCatalog)
  title: string; // list heading + sidebar label
  root: string; // sentence-case singular ("Region system" | "Location catalog")
  rootLower: string; // lower-case singular, for inline sentences
  newRoot: string;
  addRoot: string;
  saveRoot: string;
  rootNotFound: string;
  // Set entity (data type: LocationSet)
  set: string;
  setLower: string;
  sets: string; // plural — the sub-grid heading + list column
  addSet: string;
  noSets: string;
  // The per-catalog "Purpose" / per-client "Use cases" concept only exists once the
  // model has been generalized (V3). Hidden in the legacy Region-system phase.
  showPurpose: boolean;
  // Client bottom-tab labels
  clientTab: string;
  clientAdd: string;
  clientEmpty: string;
};

const LEGACY: CatalogTerms = {
  legacy: true,
  title: "Region systems",
  root: "Region system",
  rootLower: "region system",
  newRoot: "New region system",
  addRoot: "Add region system",
  saveRoot: "Save region system",
  rootNotFound: "Region system not found.",
  set: "Region",
  setLower: "region",
  sets: "Regions",
  addSet: "Add region",
  noSets: "No regions yet.",
  showPurpose: false,
  clientTab: "Region systems",
  clientAdd: "Assign region system",
  clientEmpty: "No region systems yet.",
};

const CURRENT: CatalogTerms = {
  legacy: false,
  title: "Location Catalog",
  root: "Location catalog",
  rootLower: "location catalog",
  newRoot: "New location catalog",
  addRoot: "Add location catalog",
  saveRoot: "Save location catalog",
  rootNotFound: "Location catalog not found.",
  set: "Location set",
  setLower: "location set",
  sets: "Location sets",
  addSet: "Add location set",
  noSets: "No location sets yet.",
  showPurpose: true,
  clientTab: "Location catalogs",
  clientAdd: "Enable location catalog",
  clientEmpty: "No location catalogs enabled yet.",
};

/** Version-aware vocabulary for the Location Catalog / Region System feature.
 *  V1/V2 → "Region system"; V3 → "Location Catalog". */
export function catalogTerms(): CatalogTerms {
  return getAppVersion() <= 2 ? LEGACY : CURRENT;
}
