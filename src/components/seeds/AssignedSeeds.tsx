import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/seeds/ListPrimitives";
import { AssignSeedsDialog } from "@/components/seeds/AssignSeedsDialog";
import { readPersistedList } from "@/lib/seedOptions";
import { SEEDS_KEY, INITIAL_SEEDS, type Seed, type SeedType } from "@/lib/seeds";
import { cn } from "@/lib/utils";
import { Plus, Search, Sparkles, Sprout, X } from "lucide-react";

const TABS: { key: SeedType; label: string; icon?: typeof Sparkles }[] = [
  { key: "KEYWORD", label: "Keyword" },
  { key: "URL", label: "URL" },
  { key: "API", label: "API" },
  // PDP seeds are the discovery-generated Virtual Seeds.
  { key: "PDP", label: "Virtual Seed (PDP)", icon: Sparkles },
];

function StatusDot({ status }: { status?: Seed["status"] }) {
  const active = (status ?? "Active") !== "Inactive";
  return (
    <span className="inline-flex items-center gap-1.5 text-foreground/80">
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-slate-400")} />
      {status ?? "Active"}
    </span>
  );
}

/**
 * Assigned seeds for a subscription — a tabbed (Keyword / URL / API / Virtual Seed)
 * searchable grid. PDP seeds are the Virtual Seeds produced by Discovery over a PLP
 * extraction. `seeds` holds the assigned seed descriptions; each is resolved against
 * the seeds store to render type-specific columns.
 */
export function AssignedSeeds({
  seeds,
  onChange,
}: {
  seeds: string[];
  onChange: (next: string[]) => void;
}) {
  const [tab, setTab] = useState<SeedType>("KEYWORD");
  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const store = readPersistedList<Seed>(SEEDS_KEY);
  const all = store.length ? store : INITIAL_SEEDS;
  const byDesc = new Map<string, Seed>();
  for (const s of all) if (!byDesc.has(s.d)) byDesc.set(s.d, s);

  const typeOf = (s: Seed): SeedType => s.type ?? "KEYWORD";
  const resolved: Seed[] = seeds.map(
    (name) => byDesc.get(name) ?? ({ id: name, d: name, store: "", cat: "", c: "", u: "", type: "KEYWORD" } as Seed),
  );
  const countByType = (t: SeedType) => resolved.filter((s) => typeOf(s) === t).length;

  const q = search.trim().toLowerCase();
  const rowsForTab = resolved.filter(
    (s) => typeOf(s) === tab && (!q || s.d.toLowerCase().includes(q) || (s.value ?? "").toLowerCase().includes(q)),
  );

  const remove = (name: string) => onChange(seeds.filter((x) => x !== name));
  const available = all.filter((s) => !seeds.includes(s.d));
  // Merge a batch of newly-picked seed descriptions, skipping any already assigned.
  const assignMany = (names: string[]) => {
    const fresh = names.filter((n) => !seeds.includes(n));
    if (fresh.length) onChange([...seeds, ...fresh]);
  };

  const valueHeader = tab === "URL" || tab === "PDP" ? "URL" : tab === "API" ? "API origin" : "Keyword";
  const extraHeader = tab === "KEYWORD" ? "Keyword type" : "Page type";
  const tabLabel = TABS.find((t) => t.key === tab)?.label.toLowerCase() ?? "";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Sprout className="h-4 w-4 text-muted-foreground" />
          Assigned seeds
        </span>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground/80 hover:bg-secondary"
        >
          <Plus className="h-3.5 w-3.5" /> Assign seeds
        </button>
        <AssignSeedsDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          available={available}
          onAssign={assignMany}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-5 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-0.5 pb-2 text-sm transition-colors",
              tab === t.key
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.icon && <t.icon className="h-3.5 w-3.5" />}
            {t.label}
            <span className="rounded-full bg-secondary px-1.5 text-[11px] text-muted-foreground">{countByType(t.key)}</span>
          </button>
        ))}
      </div>

      {/* Search within tab */}
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${tabLabel} seeds`}
          className="h-8 pl-8 text-sm"
        />
      </div>

      {/* Grid */}
      <div className="mt-2 max-h-56 overflow-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-secondary/60">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium">{valueHeader}</th>
              <th className="px-3 py-2 font-medium">{extraHeader}</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="w-8 px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rowsForTab.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-5 text-center text-muted-foreground">
                  No {tabLabel} seeds assigned.
                </td>
              </tr>
            )}
            {rowsForTab.map((s) => (
              <tr key={s.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-3 py-2 text-[var(--sidebar-active-fg)]">{s.d}</td>
                <td className="px-3 py-2 text-foreground/80">
                  <span className="block max-w-[220px] truncate" title={s.value}>{s.value || "—"}</span>
                </td>
                <td className="px-3 py-2">
                  {tab === "KEYWORD"
                    ? s.keywordType
                      ? <Pill tone={s.keywordType === "BRANDED" ? "violet" : "slate"}>{s.keywordType}</Pill>
                      : <span className="text-muted-foreground">—</span>
                    : s.pageType
                      ? <Pill tone="slate">{s.pageType}</Pill>
                      : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-3 py-2"><StatusDot status={s.status} /></td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => remove(s.d)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${s.d}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
