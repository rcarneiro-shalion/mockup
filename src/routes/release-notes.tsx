import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Gift, Sparkles, ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { FilterBar } from "@/components/seeds/ListPrimitives";
import { cn } from "@/lib/utils";
import {
  getReleaseNotes,
  formatReleaseDate,
  latestReleaseNote,
  markReleaseSeen,
  RELEASE_NOTE_STATUS_OPTIONS,
  RELEASE_NOTE_TAG_OPTIONS,
  type ReleaseNote,
  type ReleaseNoteTag,
} from "@/lib/releaseNotes";

export const Route = createFileRoute("/release-notes")({
  head: () => ({ meta: [{ title: "Release notes — Shalion" }] }),
  component: ReleaseNotesPage,
});

const TAG_TONE: Record<ReleaseNoteTag, string> = {
  New: "bg-emerald-100 text-emerald-700",
  Improved: "bg-sky-100 text-sky-700",
  Fixed: "bg-violet-100 text-violet-700",
  Performance: "bg-amber-100 text-amber-800",
};

function TagPill({ tag }: { tag: ReleaseNoteTag }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold", TAG_TONE[tag])}>
      {tag}
    </span>
  );
}

function StatusPill({ status }: { status: ReleaseNote["status"] }) {
  const published = status === "Published";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-foreground/70">
      <span className={cn("h-1.5 w-1.5 rounded-full", published ? "bg-emerald-500" : "bg-slate-400")} />
      {status}
    </span>
  );
}

function ReleaseNotesPage() {
  const notes = getReleaseNotes();
  const [query, setQuery] = useState("");
  const [fStatus, setFStatus] = useState<string[]>([]);
  const [fTag, setFTag] = useState<string[]>([]);

  // Landing on this page counts as "seeing" the latest release — clears the balloon + dot.
  useEffect(() => {
    const latest = latestReleaseNote();
    if (latest) markReleaseSeen(latest.id);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter(
        (n) =>
          (!q || n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)) &&
          (!fStatus.length || fStatus.includes(n.status)) &&
          (!fTag.length || fTag.includes(n.tag)),
      )
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.date.localeCompare(a.date));
  }, [notes, query, fStatus, fTag]);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Gift className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Release notes</h1>
            <p className="text-sm text-muted-foreground">Follow up on the latest improvements and updates.</p>
          </div>
        </div>

        <div className="mt-5">
          <FilterBar search="Search changes by name" searchValue={query} onSearchChange={setQuery}>
            <FilterChip label="Status" options={RELEASE_NOTE_STATUS_OPTIONS} value={fStatus} onChange={setFStatus} />
            <FilterChip label="Type" options={RELEASE_NOTE_TAG_OPTIONS} value={fTag} onChange={setFTag} />
          </FilterBar>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              No release notes match your filters.
            </div>
          )}

          {filtered.map((n) => (
            <article
              key={n.id}
              className="grid grid-cols-[7rem_1fr] gap-4 max-[640px]:grid-cols-1 max-[640px]:gap-2"
            >
              <div className="pt-1 text-right text-xs max-[640px]:text-left">
                <div className="font-medium text-foreground/70">{formatReleaseDate(n.date)}</div>
                {n.sprint && <div className="mt-0.5 text-muted-foreground">{n.sprint}</div>}
              </div>

              <div
                className={cn(
                  "rounded-xl border bg-card p-5 shadow-sm",
                  n.featured ? "border-primary/30 ring-1 ring-primary/10" : "border-border",
                )}
              >
                {n.featured && (
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary/15 to-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Featured release
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[15px] font-semibold leading-snug text-foreground">{n.title}</h2>
                  <div className="flex shrink-0 items-center gap-2">
                    <TagPill tag={n.tag} />
                    {n.status === "Draft" && <StatusPill status={n.status} />}
                  </div>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{n.summary}</p>

                {n.highlights && n.highlights.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {n.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground/75">
                        <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-primary" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {n.link && (
                  <a
                    href={n.link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {n.link.label} <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
