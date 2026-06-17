import type { DashSection } from "./dashboardApps";

// Per-section version history (backup / restore). Stored as a map of
// sectionId -> snapshots (newest first), capped per section. This is the safety
// net for live edits: snapshot before a save or a restore so any change to a
// real dashboard section can be rolled back from the editor.
export type SectionVersion = {
  id: string;
  savedAt: string; // human-readable local timestamp
  source: string; // why it was captured: "Manual backup", "Before save", "Before restore", "Loaded from live"
  env: string; // "local" | "develop" | "prod"
  section: DashSection; // full snapshot of the section at capture time
};

export type SectionVersionMap = Record<string, SectionVersion[]>;

export const SECTION_VERSIONS_KEY = "settings:dash-section-versions:v1";
export const MAX_VERSIONS_PER_SECTION = 25;

export const versionId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : String(Math.random()).slice(2, 10);

export const versionStamp = () => new Date().toLocaleString();

/** A deep copy so a snapshot never aliases the live, still-editing section. */
function clone(section: DashSection): DashSection {
  return typeof structuredClone === "function"
    ? structuredClone(section)
    : (JSON.parse(JSON.stringify(section)) as DashSection);
}

/** Prepend a snapshot of `section` to its history (capped, newest first). */
export function pushVersion(
  map: SectionVersionMap,
  section: DashSection,
  source: string,
  env: string,
): SectionVersionMap {
  const list = map[section.id] ?? [];
  const v: SectionVersion = { id: versionId(), savedAt: versionStamp(), source, env, section: clone(section) };
  return { ...map, [section.id]: [v, ...list].slice(0, MAX_VERSIONS_PER_SECTION) };
}

export function removeVersion(map: SectionVersionMap, sectionId: string, versionIdToRemove: string): SectionVersionMap {
  const list = map[sectionId] ?? [];
  return { ...map, [sectionId]: list.filter((v) => v.id !== versionIdToRemove) };
}
