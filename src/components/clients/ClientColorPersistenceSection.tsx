import { useMemo, useState } from "react";
import { ChevronDown, Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePersistentState } from "@/hooks/usePersistentState";
import type { Client } from "@/lib/clients";
import { getBrands, MANUFACTURERS } from "@/lib/brands";
import { getCategories } from "@/lib/settings";
import { getRetailers, COUNTRY_OPTIONS, countryLabel, flag } from "@/lib/retailers";

// ---------------------------------------------------------------------------
// Color persistence (spec: Color persistence — client colours for chart
// dimensions). Client-level section between Projects and Users: bind dimension
// values to exclusive colours, globally or per data group, constrained to a
// client palette. R1: colour exclusive per dimension+scope. R2: one mapping
// per value+scope. R3: colours picked from the client palette only.
// ---------------------------------------------------------------------------

const DIMENSIONS = ["Brand", "Category", "Retailer", "Manufacturer", "Country"] as const;
type Dimension = (typeof DIMENSIONS)[number];

type ColorMapping = {
  id: string;
  dimension: Dimension;
  value: string;
  color: string;
  /** "GLOBAL" or a data-group id of this client */
  level: string;
};

type ColorConfig = { presetId: string; customColors: string[]; mappings: ColorMapping[] };

const PALETTE_PRESETS: { id: string; name: string; colors: string[] }[] = [
  { id: "vivid", name: "Shalion vivid (default)", colors: ["#E01A2B", "#FF8A00", "#00A651", "#146EB4", "#6F2DA8", "#F1BF00", "#B31942", "#0B7285"] },
  { id: "pastel", name: "Pastel", colors: ["#F4A6A6", "#F9C98A", "#A8D8B9", "#9EC5E8", "#C5B3E6", "#F7E2A0", "#E8AFC6", "#9FD5D1"] },
  { id: "contrast", name: "High contrast", colors: ["#D00000", "#FF7B00", "#007F2D", "#0053B3", "#5A189A", "#B69800", "#8D0033", "#005F6B"] },
  { id: "custom", name: "Custom", colors: [] },
];

const SEED_BY_CLIENT: Record<string, ColorMapping[]> = {
  coca: [
    { id: "cm1", dimension: "Brand", value: "Coca-Cola 1L", color: "#E01A2B", level: "GLOBAL" },
    { id: "cm2", dimension: "Brand", value: "Fanta", color: "#FF8A00", level: "GLOBAL" },
    { id: "cm3", dimension: "Brand", value: "Sprite", color: "#00A651", level: "GLOBAL" },
    { id: "cm4", dimension: "Retailer", value: "Amazon ES", color: "#146EB4", level: "dg2" },
    { id: "cm5", dimension: "Category", value: "Beverages > Soft Drinks > Soda", color: "#6F2DA8", level: "GLOBAL" },
    { id: "cm6", dimension: "Manufacturer", value: "The Coca-Cola Company", color: "#B31942", level: "dg2" },
    { id: "cm7", dimension: "Country", value: "ES — Spain", color: "#F1BF00", level: "GLOBAL" },
  ],
};

const LEVEL_CHIP_COLORS = [
  "bg-sky-100 text-sky-800", "bg-emerald-100 text-emerald-800", "bg-violet-100 text-violet-800",
  "bg-amber-100 text-amber-800", "bg-rose-100 text-rose-800", "bg-cyan-100 text-cyan-800",
];
const levelChipClass = (id: string) =>
  LEVEL_CHIP_COLORS[Math.abs([...id].reduce((h, c) => h * 31 + c.charCodeAt(0), 7)) % LEVEL_CHIP_COLORS.length];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function ClientColorPersistenceSection({ client }: { client: Client }) {
  const [open, setOpen] = usePersistentState<boolean>(
    "pref:clientForm:colorsOpen",
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("colors") === "open",
  );
  const [cfg, setCfg] = usePersistentState<ColorConfig>(`settings:color-persistence:${client.id}:v1`, {
    presetId: "vivid",
    customColors: ["#E01A2B", "#FF8A00", "#00A651", "#146EB4"],
    mappings: SEED_BY_CLIENT[client.id] ?? [],
  });

  const dataGroups = client.dataGroups ?? [];
  const dgName = (level: string) => dataGroups.find((d) => d.id === level)?.name ?? level;
  const preset = PALETTE_PRESETS.find((p) => p.id === cfg.presetId) ?? PALETTE_PRESETS[0];
  const palette = cfg.presetId === "custom" ? cfg.customColors : preset.colors;

  // ---- add-mapping editor state ----
  const [adding, setAdding] = useState(false);
  const [dim, setDim] = useState<Dimension>("Brand");
  const [value, setValue] = useState("");
  const [valueQuery, setValueQuery] = useState("");
  const [valueOpen, setValueOpen] = useState(false);
  const [color, setColor] = useState("");
  const [level, setLevel] = useState("GLOBAL");
  const [newHex, setNewHex] = useState("");
  const [coolors, setCoolors] = useState("");

  const valueOptions = useMemo(() => {
    switch (dim) {
      case "Brand": return getBrands().map((b) => b.name);
      case "Category": return getCategories().map((c) => c.name);
      case "Retailer": return getRetailers().map((r) => r.name);
      case "Manufacturer": return [...MANUFACTURERS];
      case "Country": return COUNTRY_OPTIONS.map((c) => `${c.toUpperCase()} — ${countryLabel(c)}`);
    }
  }, [dim]);
  const filteredValues = useMemo(
    () => valueOptions.filter((v) => v.toLowerCase().includes(valueQuery.toLowerCase())).slice(0, 8),
    [valueOptions, valueQuery],
  );

  // R1: colours already taken within the candidate scope (same dimension + level)
  const takenColors = new Set(cfg.mappings.filter((m) => m.dimension === dim && m.level === level).map((m) => m.color));
  // R2: value already mapped in the candidate scope
  const valueTaken = cfg.mappings.some((m) => m.dimension === dim && m.level === level && m.value === value);
  const colorConflict = color !== "" && takenColors.has(color);
  const conflictOwner = colorConflict
    ? cfg.mappings.find((m) => m.dimension === dim && m.level === level && m.color === color)
    : undefined;
  const canAdd = !!value && HEX_RE.test(color) && !colorConflict && !valueTaken;

  const addMapping = () => {
    if (!canAdd) return;
    setCfg({ ...cfg, mappings: [...cfg.mappings, { id: `cm-${Date.now()}`, dimension: dim, value, color, level }] });
    setValue(""); setValueQuery(""); setColor(""); setAdding(false);
  };
  const removeMapping = (id: string) => setCfg({ ...cfg, mappings: cfg.mappings.filter((m) => m.id !== id) });

  const importCoolors = () => {
    // coolors.co/aabbcc-112233-… → last path segment, dash-separated hexes
    const seg = coolors.split("/").filter(Boolean).pop() ?? "";
    const colors = seg.split("-").map((h) => `#${h}`).filter((h) => HEX_RE.test(h));
    if (colors.length) setCfg({ ...cfg, presetId: "custom", customColors: colors });
    setCoolors("");
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 px-5 py-4 text-left">
        <span className={cn("grid h-6 w-6 place-items-center rounded-full bg-secondary text-muted-foreground transition-transform", open && "rotate-180")}>
          <ChevronDown className="h-4 w-4" />
        </span>
        <span className="text-base font-semibold text-foreground">Color persistence</span>
      </button>

      {open && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Client colours for chart dimensions — the same value always renders with the same colour, in every chart of every dashboard.
          </p>

          {/* Client palette */}
          <div className="mb-1 text-sm font-semibold text-foreground">Client palette</div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={cfg.presetId}
              onChange={(e) => setCfg({ ...cfg, presetId: e.target.value })}
              className="rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {PALETTE_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div className="flex items-center gap-1.5">
              {palette.map((c) => (
                <span key={c} className="group relative">
                  <span className="block h-7 w-7 rounded-md border border-black/10" style={{ background: c }} title={c} />
                  {cfg.presetId === "custom" && (
                    <button
                      type="button"
                      onClick={() => setCfg({ ...cfg, customColors: cfg.customColors.filter((x) => x !== c) })}
                      className="absolute -right-1.5 -top-1.5 hidden h-4 w-4 place-items-center rounded-full bg-destructive text-[9px] text-destructive-foreground group-hover:grid"
                      aria-label={`Remove ${c}`}
                    >×</button>
                  )}
                </span>
              ))}
              {cfg.presetId === "custom" && (
                <span className="ml-1 flex items-center gap-1">
                  <input
                    value={newHex} onChange={(e) => setNewHex(e.target.value)} placeholder="#RRGGBB"
                    className="w-24 rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button" disabled={!HEX_RE.test(newHex) || cfg.customColors.includes(newHex)}
                    onClick={() => { setCfg({ ...cfg, customColors: [...cfg.customColors, newHex] }); setNewHex(""); }}
                    className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-secondary disabled:opacity-40"
                    aria-label="Add colour"
                  ><Plus className="h-3.5 w-3.5" /></button>
                </span>
              )}
            </div>
            <span className="flex items-center gap-1">
              <input
                value={coolors} onChange={(e) => setCoolors(e.target.value)} placeholder="Import coolors.co URL…"
                className="w-52 rounded-md border border-border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="button" onClick={importCoolors} disabled={!coolors.includes("coolors.co")}
                className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-secondary disabled:opacity-40">
                Import
              </button>
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">Mappings pick from this palette. Importing a coolors.co palette switches to Custom.</p>

          {/* Mappings */}
          <div className="mt-5 overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground">
                  <th className="w-36 px-4 py-2.5 text-left font-medium">Dimension</th>
                  <th className="px-3 py-2.5 text-left font-medium">Value</th>
                  <th className="w-44 px-3 py-2.5 text-left font-medium">Colour</th>
                  <th className="w-48 px-3 py-2.5 text-left font-medium">Level</th>
                  <th className="w-10 px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {cfg.mappings.map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="px-4 py-2.5 font-medium text-foreground">{m.dimension}</td>
                    <td className="px-3 py-2.5 text-foreground">{m.dimension === "Country" ? `${flag(m.value.slice(0, 2).toLowerCase())} ${m.value}` : m.value}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 rounded border border-black/10" style={{ background: m.color }} />
                        <span className="font-mono text-xs text-muted-foreground">{m.color}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {m.level === "GLOBAL"
                        ? <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">Global</span>
                        : <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", levelChipClass(m.level))}>{dgName(m.level)}</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <button type="button" onClick={() => removeMapping(m.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${m.value}`}>
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {adding && (
                  <tr className="border-t border-border bg-muted/20 align-top">
                    <td className="px-4 py-2.5">
                      <select value={dim} onChange={(e) => { setDim(e.target.value as Dimension); setValue(""); setValueQuery(""); }}
                        className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        {DIMENSIONS.map((d) => <option key={d}>{d}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="relative">
                        <input
                          value={valueOpen ? valueQuery : value}
                          onChange={(e) => { setValueQuery(e.target.value); setValueOpen(true); }}
                          onFocus={() => setValueOpen(true)}
                          placeholder={`Search ${dim.toLowerCase()}…`}
                          className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {valueOpen && (
                          <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-md">
                            {filteredValues.length === 0 && <div className="px-3 py-2 text-xs text-muted-foreground">No matches.</div>}
                            {filteredValues.map((v) => (
                              <button key={v} type="button"
                                onClick={() => { setValue(v); setValueQuery(v); setValueOpen(false); }}
                                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-secondary">
                                {value === v && <Check className="h-3.5 w-3.5 text-primary" />}<span className="truncate">{v}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {palette.map((c) => {
                          const taken = takenColors.has(c);
                          return (
                            <button key={c} type="button" disabled={taken}
                              onClick={() => setColor(c)}
                              title={taken ? "Already used in this dimension + level" : c}
                              className={cn("h-6 w-6 rounded-md border", color === c ? "ring-2 ring-ring ring-offset-1" : "border-black/10", taken && "cursor-not-allowed opacity-25")}
                              style={{ background: c }}
                              aria-label={c}
                            />
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <select value={level} onChange={(e) => setLevel(e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="GLOBAL">Global — all data groups</option>
                        {dataGroups.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={addMapping} disabled={!canAdd}
                          className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50">Add</button>
                        <button type="button" onClick={() => setAdding(false)} className="px-1.5 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {colorConflict && conflictOwner && (
            <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Colour <span className="font-mono">{color}</span> is already used by {conflictOwner.dimension} “{conflictOwner.value}” in this scope — each colour is exclusive per dimension. Pick another colour.
            </p>
          )}
          {valueTaken && (
            <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              “{value}” already has a colour in this scope — edit or remove the existing mapping instead.
            </p>
          )}

          {!adding && (
            <button type="button" onClick={() => setAdding(true)} className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <Plus className="h-4 w-4" /> Add mapping
            </button>
          )}
        </div>
      )}
    </div>
  );
}
