import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/seeds/FilterChip";
import { Pill } from "@/components/seeds/ListPrimitives";
import { BULK_METHODS, BULK_GROUPS, type BulkMethod } from "@/lib/bulkMethods";
import { BookOpen, ChevronDown, Download, FileSpreadsheet, Layers, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTION_TONE: Record<string, "green" | "blue" | "amber" | "red" | "violet" | "slate"> = {
  Create: "green",
  Upsert: "blue",
  Update: "amber",
  Delete: "red",
};
const actionTone = (a: string) => ACTION_TONE[a] ?? (/rematch/i.test(a) ? "violet" : "slate");

function MethodCard({ m, open, onToggle }: { m: BulkMethod; open: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
        <span className="text-sm font-medium text-foreground">{m.entity}</span>
        <Pill tone={actionTone(m.action)}>{m.action}</Pill>
        <span className="ml-auto hidden max-w-[44%] truncate text-sm text-muted-foreground md:block">
          {m.goal}
        </span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-border px-4 pb-4 pt-3">
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

/** The bulk-methods manual/helper, shown in a modal triggered from the Bulk page. */
export function BulkMethodsModal({ trigger }: { trigger?: React.ReactNode }) {
  const [q, setQ] = useState("");
  const [actions, setActions] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const allActions = useMemo(() => [...new Set(BULK_METHODS.map((m) => m.action))].sort(), []);
  const ql = q.trim().toLowerCase();
  const filtered = BULK_METHODS.filter((m) => {
    if (actions.length && !actions.includes(m.action)) return false;
    if (groups.length && !groups.includes(m.group)) return false;
    if (!ql) return true;
    return [m.entity, m.action, m.goal, m.fileName, ...m.mandatoryFields, ...m.notes]
      .join(" ")
      .toLowerCase()
      .includes(ql);
  });
  const id = (m: BulkMethod) => `${m.entity}::${m.action}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <BookOpen className="h-4 w-4" /> Bulk methods
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 space-y-1.5 border-b border-border px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-[var(--sidebar-active-fg)]" />
            Bulk import methods
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-normal text-muted-foreground">
              {BULK_METHODS.length}
            </span>
          </DialogTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every supported bulk operation. Pick the entity and action, download its example file,
            fill it in following the mandatory fields and particularities, then upload it on this page.
          </p>
        </DialogHeader>

        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-6 py-3">
          <div className="relative min-w-[220px] flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search methods by entity, goal or field"
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <FilterChip label="Group" icon={Layers} options={[...BULK_GROUPS]} value={groups} onChange={setGroups} />
          <FilterChip label="Action" icon={Wand2} options={allActions} value={actions} onChange={setActions} />
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {BULK_GROUPS.filter((g) => filtered.some((m) => m.group === g)).map((g) => {
            const methods = filtered.filter((m) => m.group === g);
            return (
              <div key={g}>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{g}</h3>
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
      </DialogContent>
    </Dialog>
  );
}
