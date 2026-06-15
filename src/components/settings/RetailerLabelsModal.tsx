import { useMemo, useState } from "react";
import { X, Plus, Trash2, Check, Search, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LABEL_COLOR_CLASSES,
  LABEL_COLOR_KEYS,
  DEFAULT_LABEL_ID,
  assignManyToLabel,
  assignRetailerToLabel,
  clearManyFromLabel,
  labelForRetailer,
  makeLabelId,
  type LabelColor,
  type RetailerLabel,
} from "@/lib/retailerLabels";

/**
 * Manage retailer labels: create / rename / recolor / delete labels, and assign
 * retailers to them (single membership). Persists via the parent's setLabels.
 */
export function RetailerLabelsModal({
  labels,
  setLabels,
  retailers,
  onClose,
}: {
  labels: RetailerLabel[];
  setLabels: (l: RetailerLabel[]) => void;
  retailers: { id: string; name: string }[];
  onClose: () => void;
}) {
  const [selId, setSelId] = useState(labels[0]?.id ?? DEFAULT_LABEL_ID);
  const [q, setQ] = useState("");
  const [newName, setNewName] = useState("");

  const selected = labels.find((l) => l.id === selId) ?? labels[0];
  const ql = q.trim().toLowerCase();
  const visibleRetailers = useMemo(
    () => retailers.filter((r) => !ql || r.name.toLowerCase().includes(ql)),
    [retailers, ql],
  );
  const countFor = (l: RetailerLabel) =>
    l.id === DEFAULT_LABEL_ID
      ? retailers.filter((r) => labelForRetailer(labels, r.name).id === DEFAULT_LABEL_ID).length
      : l.retailers.filter((name) => retailers.some((r) => r.name === name)).length;

  const createLabel = () => {
    const name = newName.trim();
    if (!name) return;
    let id = makeLabelId(name);
    if (labels.some((l) => l.id === id)) id = `${id}-${labels.length}`;
    const next: RetailerLabel = { id, name, color: LABEL_COLOR_KEYS[labels.length % LABEL_COLOR_KEYS.length], retailers: [] };
    setLabels([...labels, next]);
    setSelId(id);
    setNewName("");
  };
  const rename = (name: string) => setLabels(labels.map((l) => (l.id === selId ? { ...l, name } : l)));
  const recolor = (color: LabelColor) => setLabels(labels.map((l) => (l.id === selId ? { ...l, color } : l)));
  const removeLabel = () => {
    if (!selected || selected.id === DEFAULT_LABEL_ID) return;
    setLabels(labels.filter((l) => l.id !== selected.id)); // its retailers fall back to STANDARD
    setSelId(DEFAULT_LABEL_ID);
  };
  const toggleRetailer = (name: string) => {
    const inSel = selected && selected.id !== DEFAULT_LABEL_ID && selected.retailers.includes(name);
    setLabels(assignRetailerToLabel(labels, name, inSel ? DEFAULT_LABEL_ID : selId));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Tags className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Retailer labels</h2>
          <span className="text-sm text-muted-foreground">classify retailers by the dashboard sections they receive</span>
          <button onClick={onClose} className="ml-auto rounded-md border border-border px-2 py-1 text-sm hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[260px_1fr]">
          {/* Labels list */}
          <div className="flex min-h-0 flex-col border-r border-border">
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {labels.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelId(l.id)}
                  className={cn(
                    "mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                    selId === l.id ? "bg-secondary" : "hover:bg-secondary/60",
                  )}
                >
                  <span className={cn("h-3 w-3 shrink-0 rounded-full border", LABEL_COLOR_CLASSES[l.color])} />
                  <span className="min-w-0 flex-1 truncate">{l.name}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{countFor(l)}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 border-t border-border p-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createLabel()}
                placeholder="New label name"
                className="h-8 flex-1 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button size="sm" className="h-8 gap-1" onClick={createLabel} disabled={!newName.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Label editor */}
          {selected ? (
            <div className="flex min-h-0 flex-col">
              <div className="flex flex-col gap-3 border-b border-border p-4">
                <div className="flex items-center gap-2">
                  <input
                    value={selected.name}
                    onChange={(e) => rename(e.target.value)}
                    disabled={selected.id === DEFAULT_LABEL_ID}
                    className="h-9 flex-1 rounded-md border border-border bg-background px-2.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-60"
                  />
                  <span className={cn("rounded-full border px-2.5 py-1 text-xs font-medium", LABEL_COLOR_CLASSES[selected.color])}>
                    {selected.name}
                  </span>
                  {selected.id !== DEFAULT_LABEL_ID && (
                    <Button variant="ghost" size="sm" className="h-9 gap-1 text-red-600 hover:text-red-700" onClick={removeLabel}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Tag color:</span>
                  {LABEL_COLOR_KEYS.map((c) => (
                    <button
                      key={c}
                      onClick={() => recolor(c)}
                      title={c}
                      className={cn(
                        "h-6 w-6 rounded-full border-2",
                        LABEL_COLOR_CLASSES[c],
                        selected.color === c ? "ring-2 ring-ring ring-offset-1" : "",
                      )}
                    />
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search retailers to assign"
                    className="h-8 w-full rounded-md border border-border bg-background pl-7 pr-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {selected.id === DEFAULT_LABEL_ID
                      ? "NON-CLASSIFIED is the default — any retailer not in another label lands here."
                      : "Check a retailer to add it to this label (removed from any other)."}
                  </p>
                  <div className="flex shrink-0 items-center gap-2 text-xs">
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline"
                      onClick={() => setLabels(assignManyToLabel(labels, visibleRetailers.map((r) => r.name), selId))}
                    >
                      {selected.id === DEFAULT_LABEL_ID ? "Reset all" : "Select all"}
                      {q.trim() ? " (filtered)" : ""} ({visibleRetailers.length})
                    </button>
                    {selected.id !== DEFAULT_LABEL_ID && (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setLabels(clearManyFromLabel(labels, visibleRetailers.map((r) => r.name), selId))}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {visibleRetailers.map((r) => {
                  const l = labelForRetailer(labels, r.name);
                  const inSel = l.id === selected.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggleRetailer(r.name)}
                      className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-secondary/60"
                    >
                      <span
                        className={cn(
                          "grid h-4 w-4 shrink-0 place-items-center rounded border",
                          inSel ? "border-primary bg-primary text-primary-foreground" : "border-border",
                        )}
                      >
                        {inSel && <Check className="h-3 w-3" />}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{r.name}</span>
                      <span className={cn("shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium", LABEL_COLOR_CLASSES[l.color])}>
                        {l.name}
                      </span>
                    </button>
                  );
                })}
                {!visibleRetailers.length && (
                  <p className="px-3 py-10 text-center text-sm text-muted-foreground">No retailers match.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid place-items-center text-sm text-muted-foreground">Select a label.</div>
          )}
        </div>
      </div>
    </div>
  );
}
