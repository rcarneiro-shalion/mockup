# Data group → Dashboard sections manager — Jun 2026

Per-datagroup management of the dashboard **sections** assigned to it (the
`datagroup-dashboardsections` join in the visualization API; sections belong to a
dashboard group → dashboard application). Lives in **Clients → Data groups →
[datagroup] → Dashboard sections** tab.

## What it does (easy add / remove / reorder, scoped by application)
`src/components/clients/DataGroupTabs.tsx` → `SectionsPanel` + `AddSectionModal`:
- **Add sections**: modal with a **Dashboard application** select + **Dashboard group**
  select (or All) → a searchable, **multi-select** list of that application's real
  sections (from the MU_SEED catalogue), excluding already-assigned (dedup by path).
  "Add N sections" appends them.
- **Remove**: per-row ✕.
- **Reorder (change order = position)**: per-row ▲/▼ move buttons (swap neighbours);
  rows are numbered; a grip handle is shown. Reorder is disabled while an app filter
  is active (clear it to reorder).
- **Filter by application**: a dropdown filters the assigned list to one app.
- Section model gained `group?` + `label?`; rows show group + app (amber) badges.

## Persistence / wiring
- Sections are **per datagroup + persisted**: `usePersistentState("dg-sections:<dataGroupId>:v1", INITIAL_SECTIONS)`.
- `dataGroupId` threaded: route `$clientId.data-groups.$dataGroupId.tsx` → `DataGroupPage`
  (new `dataGroupId` prop) → `DataGroupTabs dataGroupId=`.
- Catalogue (apps → groups → sections) reused from `src/lib/massiveUpdate.ts` (MU_SEED),
  which mirrors the live dashboardapplications/groups/sections.

Verified: add 14→16, reorder swap, app filter, remove. This is the single-datagroup
counterpart to Settings → Dashboard applications → **Massive update** (section → many
datagroups).
