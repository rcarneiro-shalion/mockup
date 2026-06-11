import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterBar } from "@/components/seeds/ListPrimitives";
import { FilterChip } from "@/components/seeds/FilterChip";
import { Pill } from "@/components/seeds/ListPrimitives";
import { BULK_METHODS, BULK_GROUPS, type BulkMethod } from "@/lib/bulkMethods";
import { ChevronDown, Download, FileSpreadsheet, Layers, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTION_TONE: Record<string, "green" | "blue" | "amber" | "red" | "violet" | "slate"> = {
  Create: "green",
  Upsert: "blue",
  Update: "amber",
  Delete: "red",
};
const actionTone = (a: string) =>
  ACTION_TONE[a] ?? (/rematch/i.test(a) ? "violet" : "slate");

function MethodCard({ m, open, onToggle }: { m: BulkMethod; open: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left"
      >
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
        <span className="font-medium text-foreground">{m.entity}</span>
        <Pill tone={actionTone(m.action)}>{m.action}</Pill>
        <span className="ml-auto hidden max-w-[46%] truncate text-sm text-muted-foreground md:block">
          {m.goal}
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-border px-5 pb-5 pt-4">
          <p className="text-sm leading-relaxed text-foreground/90">{m.goal}</p>

          {m.mandatoryFields.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Mandatory fields
              </h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {m.mandatoryFields.map((f) => (
                  <span
                    key={f}
                    className="rounded-md border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-foreground/80"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {m.notes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Particularities
              </h4>
              <ul className="mt-2 space-y-1.5">
                {m.notes.map((n, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sidebar-active-fg)]" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {m.fileUrl && (
            <a
              href={m.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-[var(--sidebar-active-fg)] hover:bg-secondary"
            >
              <Download className="h-4 w-4" />
              Download example file
              <span className="font-mono text-xs text-muted-foreground">{m.fileName}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function BulkManual() {
  const [q, setQ] = useState("");
  const [actions, setActions] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const allActions = useMemo(
    () => [...new Set(BULK_METHODS.map((m) => m.action))].sort(),
    [],
  );

  const ql = q.trim().toLowerCase();
  const filtered = BULK_METHODS.filter((m) => {
    if (actions.length && !actions.includes(m.action)) return false;
    if (groups.length && !groups.includes(m.group)) return false;
    if (!ql) return true;
    const hay = [m.entity, m.action, m.goal, m.fileName, ...m.mandatoryFields, ...m.notes]
      .join(" ")
      .toLowerCase();
    return hay.includes(ql);
  });

  const id = (m: BulkMethod) => `${m.entity}::${m.action}`;

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-semibold text-foreground">Bulk</h1>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {BULK_METHODS.length} methods
            </span>
          </div>
        </div>

        <div className="px-6 pt-1">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Bulk lets you import or update many records at once by uploading a spreadsheet. This is
            the catalogue of every supported method — pick the entity and action, download its
            example file, fill it in following the mandatory fields and particularities, then upload.
          </p>
        </div>

        <FilterBar search="Search methods by entity, goal or field" searchValue={q} onSearchChange={setQ}>
          <FilterChip label="Group" icon={Layers} options={[...BULK_GROUPS]} value={groups} onChange={setGroups} />
          <FilterChip label="Action" icon={Wand2} options={allActions} value={actions} onChange={setActions} />
        </FilterBar>

        <div className="flex-1 space-y-6 overflow-auto px-6 pb-8">
          {BULK_GROUPS.filter((g) => filtered.some((m) => m.group === g)).map((g) => {
            const methods = filtered.filter((m) => m.group === g);
            return (
              <div key={g}>
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">{g}</h2>
                  <span className="text-xs text-muted-foreground">{methods.length}</span>
                </div>
                <div className="space-y-2">
                  {methods.map((m) => (
                    <MethodCard
                      key={id(m)}
                      m={m}
                      open={!!open[id(m)]}
                      onToggle={() => setOpen((p) => ({ ...p, [id(m)]: !p[id(m)] }))}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No bulk methods match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
