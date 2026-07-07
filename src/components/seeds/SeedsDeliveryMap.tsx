import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Interactive "Delivery map" — the Seeds API field-level transition, in three columns:
// Legacy Tasks model → Seeds API (new home) → Data Collector (Resolution engine +
// Task Generation, the spec-driven task generator). Phase chips toggle each phase's
// ribbons + fields; the Seed box carries a slider that previews the 14→4+1 merge.

type Phase = "p1" | "p2" | "p3" | "rem";

const PHASES: { key: Phase; label: string; color: string }[] = [
  { key: "p1", label: "Phase 1", color: "#2e9e5b" },
  { key: "p2", label: "Phase 2", color: "#c47d1a" },
  { key: "p3", label: "Phase 3", color: "#5b8def" },
  { key: "rem", label: "Removed", color: "#d0453f" },
];

const SEED_TYPES: { key: string; short: string; label: string; variants: string[] }[] = [
  { key: "ad", short: "Ad", label: "Ad", variants: ["keyword", "url", "api"] },
  { key: "search", short: "Search", label: "Search", variants: ["keyword"] },
  { key: "shelf", short: "Shelf", label: "Shelf", variants: ["url", "api"] },
  { key: "plp", short: "PLP", label: "Digital Shelf PLP", variants: ["keyword", "url", "api"] },
  { key: "pdp", short: "PDP", label: "Digital Shelf PDP", variants: ["url", "api"] },
  { key: "media", short: "Media", label: "Media", variants: ["url", "keyword", "api"] },
];

const GREEN = "#2e9e5b";
const AMBER = "#c47d1a";
const BLUE = "#5b8def";
const RED = "#d0453f";
const INK = "#1f2937";
const MUT = "#6b7280";
const SLATE = "#475569";

const T = { transition: "opacity .4s ease" } as const;

export function SeedsDeliveryMap() {
  const [vis, setVis] = useState<Record<Phase, boolean>>({ p1: true, p2: true, p3: true, rem: true });
  const [selType, setSelType] = useState(0);

  const allOn = PHASES.every((p) => vis[p.key]);
  const allOff = PHASES.every((p) => !vis[p.key]);
  const setAll = (v: boolean) => setVis({ p1: v, p2: v, p3: v, rem: v });
  const toggle = (k: Phase) => setVis((s) => ({ ...s, [k]: !s[k] }));

  const fOp = (k: Phase) => (vis[k] ? 1 : 0.06);
  const rOp = (k: Phase) => (vis[k] ? 0.42 : 0.05);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    const onChange = () => setIsFs(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else wrapRef.current?.requestFullscreen?.().catch(() => {});
  };

  const sel = SEED_TYPES[selType];

  return (
    <div className="h-full overflow-auto">
      <div
        ref={wrapRef}
        className={cn(
          "mx-auto bg-background px-6 py-3",
          isFs ? "flex min-h-full max-w-[1720px] flex-col justify-center overflow-auto" : "max-w-[1320px]",
        )}
      >
        {/* Header */}
        <div className="mb-1 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[17px] font-semibold text-foreground">Delivery map</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Field-level transition from the legacy Tasks model to the Seeds API — colour marks the phase each field
              lands or moves. Click a phase to show/hide its connections &amp; fields.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleFs}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-secondary"
            title={isFs ? "Exit full screen" : "Full screen"}
          >
            {isFs ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            {isFs ? "Exit full screen" : "Full screen"}
          </button>
        </div>

        {/* Phase controls */}
        <div className="my-2.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setAll(true)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              allOn ? "border-foreground/40 bg-secondary text-foreground" : "border-border text-muted-foreground hover:bg-secondary",
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setAll(false)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              allOff ? "border-foreground/40 bg-secondary text-foreground" : "border-border text-muted-foreground hover:bg-secondary",
            )}
          >
            None
          </button>
          <span className="mx-1 h-4 w-px bg-border" />
          {PHASES.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => toggle(p.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                vis[p.key] ? "text-foreground" : "border-border text-muted-foreground opacity-60 hover:opacity-100",
              )}
              style={vis[p.key] ? { borderColor: p.color, background: `${p.color}1a` } : undefined}
            >
              <span
                className="h-2.5 w-2.5 rounded-[3px] border-2"
                style={{ borderColor: p.color, background: vis[p.key] ? p.color : "transparent" }}
              />
              <span className={cn(!vis[p.key] && "line-through")}>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Diagram */}
        <div className="overflow-x-auto rounded-xl border border-border bg-card p-2 shadow-sm">
          <svg viewBox="0 0 1600 780" className="h-auto w-full min-w-[1100px]" role="img" xmlns="http://www.w3.org/2000/svg">
            <title>Seeds API — field-level transition ending in the resolution engine + task generation</title>
            <desc>
              Legacy Tasks model migrates into the Seeds API, whose Scraping option (Phase 2) feeds the Resolution
              engine and whose Selection parameters (Phase 3) feed Task Generation in the Data Collector.
            </desc>

            <text x={32} y={26} fontSize={14} letterSpacing="0.05em" fontWeight={600} fill={MUT}>LEGACY · TASKS MODEL</text>
            <text x={580} y={26} fontSize={14} letterSpacing="0.05em" fontWeight={600} fill={MUT}>SEEDS API · NEW HOME</text>
            <text x={1165} y={26} fontSize={14} letterSpacing="0.05em" fontWeight={600} fill={MUT}>DATA COLLECTOR · RESOLUTION + TASK GEN</text>

            {/* col1 → col2 ribbons (colour = phase) */}
            <g fill="none">
              <path d="M382 72 C481 72,481 90,580 90" stroke={GREEN} strokeWidth={13} opacity={rOp("p1")} style={T} />
              <path d="M382 175 C481 175,481 140,580 140" stroke={GREEN} strokeWidth={20} opacity={rOp("p1")} style={T} />
              <path d="M382 217 C481 217,481 290,580 290" stroke={GREEN} strokeWidth={18} opacity={rOp("p1")} style={T} />
              <path d="M382 300 C481 300,481 660,580 660" stroke={RED} strokeWidth={15} opacity={rOp("rem")} style={T} />
              <path d="M382 450 C481 450,481 484,580 484" stroke={GREEN} strokeWidth={18} opacity={rOp("p1")} style={T} />
              <path d="M382 486 C481 486,481 342,580 342" stroke={AMBER} strokeWidth={13} opacity={rOp("p2")} style={T} />
              <path d="M382 664 C481 664,481 596,580 596" stroke={BLUE} strokeWidth={13} opacity={rOp("p3")} style={T} />
            </g>
            {/* col2 → col3 ribbons: Scraping option (P2) → Resolution engine; Selection parameters (P3) → Task Generation */}
            <g fill="none">
              <path d="M965 342 C1065 342,1065 190,1165 190" stroke={AMBER} strokeWidth={13} opacity={rOp("p2")} style={T} />
              <path d="M965 210 C1065 210,1065 386,1165 386" stroke={BLUE} strokeWidth={13} opacity={rOp("p3")} style={T} />
            </g>

            {/* COL 1 · legacy */}
            <g fontSize={12.5} fill={INK}>
              <rect x={32} y={44} width={350} height={56} rx={8} fill="#f6f7f9" stroke="#c9c9c9" strokeDasharray="4 3" />
              <text x={50} y={70} fontSize={15} fontWeight={600}>Project ⇄ Job</text>
              <text x={50} y={90} fontSize={12} fill={MUT}>1:N · via Store Package</text>

              <rect x={32} y={112} width={350} height={248} rx={8} fill="#f6f7f9" stroke="#dcdcdc" />
              <text x={50} y={136} fontSize={15} fontWeight={600}>Job</text>
              <text x={50} y={162}>businessUnit</text>
              <text x={50} y={184}>storeId · geolocMode</text>
              <text x={50} y={206}>extractionType</text>
              <text x={50} y={228}>timeframeId</text>
              <text x={50} y={252} fontSize={10.5} letterSpacing="0.04em" fill={MUT} opacity={fOp("rem")} style={T}>OBSOLETE — TO BE REMOVED</text>
              <text x={50} y={274} fill={RED} opacity={fOp("rem")} style={T}>isQaCandidate</text>
              <text x={50} y={296} fill={RED} opacity={fOp("rem")} style={T}>Box</text>
              <text x={50} y={318} fill={RED} opacity={fOp("rem")} style={T}>Definition method (seed / box)</text>
              <text x={50} y={340} fill={RED} opacity={fOp("rem")} style={T}>Job extension</text>

              <rect x={32} y={372} width={350} height={256} rx={8} fill="#f6f7f9" stroke="#dcdcdc" />
              <text x={50} y={396} fontSize={15} fontWeight={600}>Seed (legacy)</text>
              <text x={50} y={420}>type: keyword / url / api</text>
              <text x={50} y={442}>keyword / url  (value)</text>
              <text x={50} y={464}>pageType · keywordType</text>
              <text x={50} y={486}>maxRank · maxPages · destination</text>
              <line x1={50} y1={504} x2={364} y2={504} stroke="#dcdcdc" strokeWidth={1} />
              <text x={50} y={522} fontSize={12.5} fontWeight={600} fill={GREEN} opacity={fOp("p1")} style={T}>Seeds-api refactor</text>
              <text x={50} y={538} fontSize={10.5} fill={MUT} opacity={fOp("p1")} style={T}>Seed types — 14 → 4 (KEYWORD / URL / API) + PDP</text>
              <g opacity={fOp("p1")} style={T}>
                <rect x={50} y={550} width={324} height={24} rx={12} fill="#eef1f4" stroke="#dcdcdc" />
                <rect x={52 + 54 * selType} y={552} width={50} height={20} rx={10} fill="#dcefe3" stroke={GREEN} />
                {SEED_TYPES.map((t, i) => (
                  <g key={t.key} onClick={() => setSelType(i)} style={{ cursor: "pointer" }}>
                    <rect x={50 + 54 * i} y={550} width={54} height={24} fill="transparent" />
                    <text
                      x={77 + 54 * i}
                      y={566}
                      fontSize={10.5}
                      textAnchor="middle"
                      fill={selType === i ? GREEN : MUT}
                      fontWeight={selType === i ? 600 : 400}
                    >
                      {t.short}
                    </text>
                  </g>
                ))}
              </g>
              <text x={50} y={596} fontSize={12} fill={INK} opacity={fOp("p1")} style={T}>
                {sel.label} → {sel.variants.join(" · ")}
              </text>
              <text x={50} y={612} fontSize={10.5} fill={MUT} opacity={fOp("p1")} style={T}>tap a type to preview its seed variants</text>

              <rect x={32} y={640} width={350} height={54} rx={8} fill="#f6f7f9" stroke="#dcdcdc" />
              <text x={50} y={664} fontSize={15} fontWeight={600}>Region System</text>
              <text x={50} y={684} fontSize={12.5}>Region · RegionLocation</text>
            </g>

            {/* COL 2 · seeds api */}
            <g fontSize={12.5}>
              <rect x={580} y={44} width={385} height={180} rx={8} fill="#f3f4f6" stroke="#cfcfcf" />
              <text x={598} y={68} fontSize={15} fontWeight={600} fill={INK}>Subscription</text>
              <text x={598} y={90} fill={GREEN} fontWeight={600} opacity={fOp("p1")} style={T}>projects[] — N:M, direct</text>
              <text x={598} y={110} fill={INK}>name · status · store</text>
              <text x={598} y={130} fill={GREEN} opacity={fOp("p1")} style={T}>geo → NONE / AUTO / MANUAL / VIRTUAL_STORE</text>
              <text x={598} y={150} fill={GREEN} opacity={fOp("p1")} style={T}>destinationOptions[] · Discovery</text>
              <text x={598} y={170} fill={GREEN} textDecoration={vis.p3 ? "line-through" : "none"} opacity={fOp("p1")} style={T}>locations[] (MANUAL — direct)</text>
              <text x={598} y={190} fill={BLUE} opacity={fOp("p3")} style={T}>→ locationSet reference  (P3)</text>
              <text x={598} y={210} fill={BLUE} opacity={fOp("p3")} style={T}>Selection parameters  (P3)</text>

              <rect x={580} y={236} width={385} height={180} rx={8} fill="#eaf6ef" stroke={GREEN} />
              <text x={598} y={260} fontSize={15} fontWeight={600} fill={INK}>Scrapping option  ·  new</text>
              <text x={598} y={282} fill={GREEN} opacity={fOp("p1")} style={T}>name · status · extractionType</text>
              <text x={598} y={302} fill={GREEN} textDecoration={vis.p3 ? "line-through" : "none"} opacity={fOp("p1")} style={T}>timeframes[]  (multi)</text>
              <text x={598} y={322} fill={BLUE} opacity={fOp("p3")} style={T}>→ taskGroups[]  (P3)</text>
              <text x={598} y={342} fill={AMBER} opacity={fOp("p2")} style={T}>Joints: multivariants · maxPage · maxRank</text>
              <text x={598} y={362} fill={AMBER} opacity={fOp("p2")} style={T}>Disjoints: modalities · sorting</text>
              <text x={598} y={382} fill={BLUE} opacity={fOp("p3")} style={T}>frequency — new · Daily/Weekly/Monthly/Custom</text>
              <text x={598} y={402} fill={GREEN} opacity={fOp("p1")} style={T}>meta (JSON)</text>

              <rect x={580} y={428} width={385} height={112} rx={8} fill="#eaf6ef" stroke={GREEN} />
              <text x={598} y={452} fontSize={15} fontWeight={600} fill={INK}>Seed</text>
              <text x={598} y={474} fill={GREEN} opacity={fOp("p1")} style={T}>type + PDP</text>
              <text x={598} y={494} fill={GREEN} opacity={fOp("p1")} style={T}>value · discoveryKey (PDP)</text>
              <text x={598} y={514} fill={INK}>pageType · keywordType</text>
              <text x={598} y={534} fill={INK}>maxRank · destination</text>

              <rect x={580} y={552} width={385} height={50} rx={8} fill="#eaf1fe" stroke={BLUE} />
              <text x={598} y={576} fontSize={15} fontWeight={600} fill={INK}>Location Catalog / Set</text>
              <text x={598} y={596} fill={BLUE} opacity={fOp("p3")} style={T}>rename + useCases (per client)</text>

              <rect x={580} y={614} width={385} height={152} rx={8} fill="#fdeceb" stroke={RED} />
              <text x={598} y={638} fontSize={15} fontWeight={600} fill={INK}>Removed</text>
              <text x={598} y={658} fill={RED} opacity={fOp("rem")} style={T}>isQaCandidate</text>
              <text x={598} y={678} fill={RED} opacity={fOp("rem")} style={T}>Box</text>
              <text x={598} y={698} fill={RED} opacity={fOp("rem")} style={T}>Definition method (seed / box)</text>
              <text x={598} y={718} fill={RED} opacity={fOp("rem")} style={T}>Job extension</text>
              <text x={598} y={738} fill={RED} textDecoration="line-through" opacity={fOp("rem")} style={T}>Box Subscription</text>
              <text x={598} y={758} fill={RED} textDecoration="line-through" opacity={fOp("rem")} style={T}>StorePackage · RetailerPackage</text>
            </g>

            {/* COL 3 · Resolution engine (Scraping option, P2) + Task Generation (Selection parameters, P3) */}
            <g>
              <rect x={1165} y={112} width={400} height={158} rx={10} fill="#eef2f7" stroke="#94a3b8" />
              <text x={1183} y={138} fontSize={15} fontWeight={600} fill={INK}>Resolution engine</text>
              <text x={1183} y={156} fontSize={11} fill={MUT}>Data Collector · resolves the scraping config</text>
              <line x1={1183} y1={170} x2={1547} y2={170} stroke="#dbe1e8" strokeWidth={1} />
              <text x={1183} y={190} fontSize={12.5} fill={AMBER} opacity={fOp("p2")} style={T}>← Scraping option · extraction values + taskGroups</text>
              <text x={1183} y={212} fontSize={12} fill={INK}>Joints: multivariants · maxPage · maxRank</text>
              <text x={1183} y={232} fontSize={12} fill={INK}>Disjoints: modalities · sorting</text>
              <text x={1183} y={254} fontSize={12} fill={INK}>taskGroups → grouping &amp; schedule</text>

              <rect x={1165} y={288} width={400} height={314} rx={10} fill="#eef2f7" stroke="#94a3b8" />
              <text x={1183} y={312} fontSize={15} fontWeight={600} fill={INK}>Task Generation</text>
              <text x={1183} y={330} fontSize={11} fill={MUT}>dbt dim_task · spec-driven</text>
              <text x={1183} y={352} fontSize={12} fontWeight={600} fill={GREEN}>24-CTE matrix → 4 engines · ~800 → ~300 lines</text>
              <line x1={1183} y1={366} x2={1547} y2={366} stroke="#dbe1e8" strokeWidth={1} />
              <text x={1183} y={386} fontSize={12.5} fill={BLUE} opacity={fOp("p3")} style={T}>← Selection parameters · rotation · freshness · volume</text>
              <text x={1183} y={406} fontSize={12.5} fill={BLUE} opacity={fOp("p3")} style={T}>Frequency · Daily / Weekly / Monthly / Custom</text>
              <line x1={1183} y1={422} x2={1547} y2={422} stroke="#dbe1e8" strokeWidth={1} />
              <text x={1183} y={442} fontSize={12.5} fill={SLATE}>
                ⚙  dim_seed_location_selection_params{" "}
                <a
                  href="https://app.notion.com/p/Task-generator-38b56175e1818087ac08c35539ed01c8?source=copy_link"
                  target="_blank"
                  rel="noreferrer"
                  style={{ cursor: "pointer" }}
                >
                  <tspan fill={BLUE} textDecoration="underline">(spec)</tspan>
                </a>
              </text>
              <text x={1183} y={464} fontSize={12.5} fill={INK}>🌱  ① Seed selection · none/weekly/monthly/stateful</text>
              <text x={1183} y={486} fontSize={12.5} fill={INK}>📍  ② Candidate locations · geoloc_mode (+ CMI)</text>
              <text x={1183} y={508} fontSize={12.5} fill={INK}>🔁  ③ Location rotation · none/cmi/hash 1-day/N-day</text>
              <text x={1183} y={530} fontSize={12.5} fill={INK}>🎛  ④ Volume policy · full/top-10/backfill 1.5×</text>
              <text x={1183} y={552} fontSize={12.5} fill={INK}>⏱  is_last_offer · freshness ≡ write cadence</text>
              <line x1={1183} y1={568} x2={1547} y2={568} stroke="#dbe1e8" strokeWidth={1} />
              <text x={1183} y={590} fontSize={13} fontWeight={600} fill={GREEN}>✅  tasks = seeds × locations / store</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
