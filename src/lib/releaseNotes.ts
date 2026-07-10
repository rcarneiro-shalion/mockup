import { useEffect, useState } from "react";
import { versionedKey } from "@/lib/appVersion";
import { readPersistedList } from "@/lib/seedOptions";

// Release notes are a CONSOLE-WIDE feature (a "Changelog"): the same feed across all
// three app versions, so the storage key uses an UNVERSIONED prefix ("mu:"). The feed is
// read-only (no editor UI), so getReleaseNotes() always falls back to INITIAL_RELEASE_NOTES
// — nothing is ever persisted, so this needs no APP_SCHEMA_VERSION bump.

export type ReleaseNoteStatus = "Published" | "Draft";
export type ReleaseNoteTag = "New" | "Improved" | "Fixed" | "Performance";

export type ReleaseNote = {
  id: string;
  title: string;
  /** ISO date "YYYY-MM-DD" — sortable + tz-safe formatted for display. */
  date: string;
  sprint?: string;
  status: ReleaseNoteStatus;
  tag: ReleaseNoteTag;
  summary: string;
  highlights?: string[];
  /** Floats to the top of the feed and renders with a "Featured release" banner. */
  featured?: boolean;
  /** Optional external link (e.g. a launch walkthrough). */
  link?: { label: string; url: string };
};

export const RELEASE_NOTES_KEY = "mu:releaseNotes";
export const RELEASE_NOTES_SEEN_KEY = "mu:releaseNotes:seen";
/** Fired when the visitor marks a release seen, so balloon + sidebar dot update live. */
export const RELEASE_SEEN_EVENT = "mu:release-seen";

export const RELEASE_NOTE_STATUS_OPTIONS: ReleaseNoteStatus[] = ["Published", "Draft"];
export const RELEASE_NOTE_TAG_OPTIONS: ReleaseNoteTag[] = ["New", "Improved", "Fixed", "Performance"];

export const INITIAL_RELEASE_NOTES: ReleaseNote[] = [
  {
    id: "users-client-level",
    title: "Users now live at the client level",
    date: "2026-07-10",
    sprint: "Sprint S1",
    status: "Published",
    tag: "New",
    featured: true,
    summary:
      "Managing who can see what just got a single home. Every user for a client now appears once — with all of their data groups on one line — so you can find people, review their full access, edit it, and onboard new users without ever hopping between data groups.",
    highlights: [
      "One Users grid per client — no more opening each data group to find someone",
      "Filter by data group to answer 'who can access this?' in a click (e.g. 33 of 360)",
      "Add or remove several data groups in one action; bulk-create users with permissions and an automatic invite",
    ],
    link: {
      label: "Watch the 2-minute walkthrough",
      url: "https://claude.ai/code/artifact/85774a4e-9559-468b-9e47-4daf806965ba",
    },
  },
  {
    id: "location-catalog-preview",
    title: "Reusable Location Catalogs are on the way",
    date: "2026-07-16",
    sprint: "Sprint S2",
    status: "Draft",
    tag: "New",
    summary:
      "Region systems are becoming a flexible Location Catalog — reusable location sets you can share across subscriptions and scope by use-case (Dashboard, MSRP, Assortment, Scraping). Rolling out with Seeds API v3.",
    highlights: [
      "Reuse one location set across many subscriptions instead of re-listing locations per job",
      "Tag each catalog by the use-cases it serves",
    ],
  },
  {
    id: "super-update-safe-edits",
    title: "Bulk Super Update: safer edits across services",
    date: "2026-07-08",
    sprint: "Sprint S1",
    status: "Published",
    tag: "Improved",
    summary:
      "The Bulk > Super Update tool can now change a single value deep inside a record and checks every value's type before it is sent — so one paste can update hundreds of records across services without a bad value slipping through.",
    highlights: [
      "Edit one field inside a complex record without touching the rest",
      "Type checks catch bad values before they ever reach production",
    ],
  },
  {
    id: "msrp-by-level",
    title: "MSRP is now Client Configuration",
    date: "2026-07-10",
    sprint: "Sprint S1",
    status: "Published",
    tag: "Improved",
    summary:
      "What used to be a single MSRP is now a flexible Client Configuration: pricing can be set across four levels — Global, Region, Store, and Region & Store — with the most specific level winning. And it is no longer just a price — business unit, client category, validity dates and the hero flag now live at each level too.",
    highlights: [
      "Price a SKU globally, by region, by store, or by a store within a region — the rightmost defined value wins",
      "Business unit, client category, active-from/to and hero moved onto the configuration (out of the client SKU)",
      "Renamed across the console today; the data migration and table renames follow next",
    ],
    link: {
      label: "Read the full story",
      url: "https://claude.ai/code/artifact/7579f72c-56e7-431a-8793-3ec244edef35",
    },
  },
  {
    id: "discovery-key-rename",
    title: "Clearer naming: 'Matching string' is now 'Discovery key'",
    date: "2026-06-30",
    sprint: "Sprint S1",
    status: "Published",
    tag: "Improved",
    summary:
      "We renamed the manual-listing 'Matching string' field to 'Discovery key' — the same field, with the name the team actually uses. Nothing changes on your side.",
  },
];

export function getReleaseNotes(): ReleaseNote[] {
  const list = readPersistedList<ReleaseNote>(RELEASE_NOTES_KEY);
  return list.length ? list : INITIAL_RELEASE_NOTES;
}

export function publishedReleaseNotes(): ReleaseNote[] {
  return getReleaseNotes().filter((n) => n.status === "Published");
}

/** Newest published note (drives the balloon + the sidebar "unseen" dot). */
export function latestReleaseNote(): ReleaseNote | undefined {
  return [...publishedReleaseNotes()].sort((a, b) => b.date.localeCompare(a.date))[0];
}

// ---- per-visitor "seen" tracking (global; client-only) ----
export function getSeenReleaseId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(versionedKey(RELEASE_NOTES_SEEN_KEY));
  } catch {
    return null;
  }
}

export function markReleaseSeen(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(versionedKey(RELEASE_NOTES_SEEN_KEY), id);
    window.dispatchEvent(new Event(RELEASE_SEEN_EVENT));
  } catch {
    /* ignore quota / serialization errors */
  }
}

/**
 * The newest published note the visitor has NOT seen yet, or null. Returns null during
 * SSR and the first client paint (so it never causes a hydration mismatch), then resolves
 * after mount and stays in sync via the RELEASE_SEEN_EVENT.
 */
export function useLatestUnseenRelease(): ReleaseNote | null {
  const [note, setNote] = useState<ReleaseNote | null>(null);
  useEffect(() => {
    const check = () => {
      const latest = latestReleaseNote();
      setNote(latest && getSeenReleaseId() !== latest.id ? latest : null);
    };
    check();
    window.addEventListener(RELEASE_SEEN_EVENT, check);
    return () => window.removeEventListener(RELEASE_SEEN_EVENT, check);
  }, []);
  return note;
}

// ---- display helpers ----
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-07-10" -> "July 10, 2026" (no Date parsing, so no timezone drift). */
export function formatReleaseDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, y, mo, d] = m;
  return `${MONTHS[Number(mo) - 1]} ${Number(d)}, ${y}`;
}
