import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Interactive "Delivery map" — the Seeds API field-level transition, in three columns:
// Legacy Tasks model → Seeds API (new home) → Data Collector resolution engine (the
// spec-driven task generator). Phase chips toggle each phase's ribbons + fields; the
// Seed box carries a slider that previews the 14→4+1 seed-type merge.

type Phase = "p1" | "p2" | "p3" | "rem";

const PHASES: { key: Phase; label: string; color: string }[] = [
  { key: "p1", label: "Phase 1", color: "#2e9e5b" },
  { key: "p2", label: "Phase 2", color: "#c47d1a" },
  { key: "p3", label: "Phase 3", color: "#5b8def" },
  { key: "rem", label: "Removed", color: "#d0453f" },
];

// 14 legacy seed types collapse to 4 (KEYWORD / URL / API) + PDP, by extraction type.
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
          "mx-auto bg-background px-6 py-6",
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
        <div className="my-4 flex flex-wrap items-center gap-2">
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
          <svg viewBox="0 0 1600 930" className="h-auto w-full min-w-[1100px]" role="img" xmlns="http://www.w3.org/2000/svg">
            <title>Seeds API — field-level transition ending in the resolution engine</title>
            <desc>
              Legacy Tasks model migrates into the Seeds API, whose Scraping option (Phase 2) and Selection parameters
              (Phase 3) feed the Data Collector's spec-driven task generator.
            </desc>

            <text x={32} y={40} fontSize={14} letterSpacing="0.05em" fontWeight={600} fill={MUT}>LEGACY · TASKS MODEL</text>
            <text x={580} y={40} fontSize={14} letterSpacing="0.05em" fontWeight={600} fill={MUT}>SEEDS API · NEW HOME</text>
            <text x={1165} y={40} fontSize={14} letterSpacing="0.05em" fontWeight={600} fill={MUT}>DATA COLLECTOR · RESOLUTION + TASK GEN</text>

            {/* col1 → col2 ribbons (colour = phase) */}
            <g fill="none">
              <path d="M382 132 C481 132,481 150,580 150" stroke={GREEN} strokeWidth={14} opacity={rOp("p1")} style={T} />
              <path d="M382 300 C481 300,481 205,580 205" stroke={GREEN} strokeWidth={22} opacity={rOp("p1")} style={T} />
              <path d="M382 356 C481 356,481 348,580 348" stroke={GREEN} strokeWidth={20} opacity={rOp("p1")} style={T} />
              <path d="M382 466 C481 466,481 720,580 720" stroke={RED} strokeWidth={16} opacity={rOp("rem")} style={T} />
              <path d="M382 600 C481 600,481 547,580 547" stroke={GREEN} strokeWidth={20} opacity={rOp("p1")} style={T} />
              <path d="M382 650 C481 650,481 415,580 415" stroke={AMBER} strokeWidth={14} opacity={rOp("p2")} style={T} />
              <path d="M382 886 C481 886,481 650,580 650" stroke={BLUE} strokeWidth={14} opacity={rOp("p3")} style={T} />
            </g>
            {/* col2 → col3 ribbons: Scraping option (P2) → Resolution engine; Selection parameters (P3) → Task Generation */}
            <g fill="none">
              <path d="M965 400 C1065 400,1065 248,1165 248" stroke={AMBER} strokeWidth={13} opacity={rOp("p2")} style={T} />
              <path d="M965 276 C1065 276,1065 454,1165 454" stroke={BLUE} strokeWidth={13} opacity={rOp("p3")} style={T} />
            </g>

            {/* COL 1 · legacy */}
            <g fontSize={13.5} fill={INK}>
              <rect x={32} y={104} width={350} height={70} rx={8} fill="#f6f7f9" stroke="#c9c9c9" strokeDasharray="4 3" />
              <text x={50} y={132} fontSize={16} fontWeight={600}>Project ⇄ Job</text>
              <text x={50} y={156} fontSize={12.5} fill={MUT}>1:N · via Store Package</text>

              <rect x={32} y={228} width={350} height={290} rx={8} fill="#f6f7f9" stroke="#dcdcdc" />
              <text x={50} y={256} fontSize={16} fontWeight={600}>Job</text>
              <text x={50} y={286}>businessUnit</text>
              <text x={50} y={316}>storeId · geolocMode</text>
              <text x={50} y={346}>extractionType</text>
              <text x={50} y={376}>timeframeId</text>
              <text x={50} y={404} fontSize={11} letterSpacing="0.04em" fill={MUT} opacity={fOp("rem")} style={T}>OBSOLETE — TO BE REMOVED</text>
              <text x={50} y={428} fill={RED} opacity={fOp("rem")} style={T}>isQaCandidate</text>
              <text x={50} y={452} fill={RED} opacity={fOp("rem")} style={T}>Box</text>
              <text x={50} y={476} fill={RED} opacity={fOp("rem")} style={T}>Definition method (seed / box)</text>
              <text x={50} y={500} fill={RED} opacity={fOp("rem")} style={T}>Job extension</text>

              <rect x={32} y={528} width={350} height={312} rx={8} fill="#f6f7f9" stroke="#dcdcdc" />
              <text x={50} y={556} fontSize={16} fontWeight={600}>Seed (legacy)</text>
              <text x={50} y={586}>type: keyword / url / api</text>
              <text x={50} y={616}>keyword / url  (value)</text>
              <text x={50} y={646}>pageType · keywordType</text>
              <text x={50} y={676}>maxRank · maxPages · destination</text>
              <line x1={50} y1={700} x2={364} y2={700} stroke="#dcdcdc" strokeWidth={1} />
              <text x={50} y={722} fontSize={13} fontWeight={600} fill={GREEN} opacity={fOp("p1")} style={T}>Seeds-api refactor</text>
              <text x={50} y={740} fontSize={10.5} fill={MUT} opacity={fOp("p1")} style={T}>Seed types — 14 → 4 (KEYWORD / URL / API) + PDP</text>
              <g opacity={fOp("p1")} style={T}>
                <rect x={50} y={752} width={324} height={26} rx={13} fill="#eef1f4" stroke="#dcdcdc" />
                <rect x={52 + 54 * selType} y={754} width={50} height={22} rx={11} fill="#dcefe3" stroke={GREEN} />
                {SEED_TYPES.map((t, i) => (
                  <g key={t.key} onClick={() => setSelType(i)} style={{ cursor: "pointer" }}>
                    <rect x={50 + 54 * i} y={752} width={54} height={26} fill="transparent" />
                    <text
                      x={77 + 54 * i}
                      y={769}
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
              <text x={50} y={806} fontSize={12.5} fill={INK} opacity={fOp("p1")} style={T}>
                {sel.label} → {sel.variants.join(" · ")}
              </text>
              <text x={50} y={826} fontSize={10.5} fill={MUT} opacity={fOp("p1")} style={T}>tap a type to preview its seed variants</text>

              <rect x={32} y={858} width={350} height={58} rx={8} fill="#f6f7f9" stroke="#dcdcdc" />
              <text x={50} y={884} fontSize={16} fontWeight={600}>Region System</text>
              <text x={50} y={906} fontSize={13}>Region · RegionLocation</text>
            </g>

            {/* COL 2 · seeds api */}
            <g fontSize={13.5}>
              <rect x={580} y={104} width={385} height={178} rx={8} fill="#f3f4f6" stroke="#cfcfcf" />
              <text x={598} y={128} fontSize={16} fontWeight={600} fill={INK}>Subscription</text>
              <text x={598} y={150} fill={GREEN} fontWeight={600} opacity={fOp("p1")} style={T}>projects[] — N:M, direct</text>
              <text x={598} y={171} fill={INK}>name · status · store</text>
              <text x={598} y={192} fill={GREEN} opacity={fOp("p1")} style={T}>geo → NONE / AUTO / MANUAL / VIRTUAL_STORE</text>
              <text x={598} y={213} fill={GREEN} opacity={fOp("p1")} style={T}>destinationOptions[] · Discovery</text>
              <text x={598} y={234} fill={GREEN} textDecoration={vis.p3 ? "line-through" : "none"} opacity={fOp("p1")} style={T}>locations[] (MANUAL — direct)</text>
              <text x={598} y={255} fill={BLUE} opacity={fOp("p3")} style={T}>→ locationSet reference  (P3)</text>
              <text x={598} y={276} fill={BLUE} opacity={fOp("p3")} style={T}>Selection parameters  (P3)</text>

              <rect x={580} y={292} width={385} height={178} rx={8} fill="#eaf6ef" stroke={GREEN} />
              <text x={598} y={316} fontSize={16} fontWeight={600} fill={INK}>Scrapping option  ·  new</text>
              <text x={598} y={338} fill={GREEN} opacity={fOp("p1")} style={T}>name · status · extractionType</text>
              <text x={598} y={359} fill={GREEN} textDecoration={vis.p3 ? "line-through" : "none"} opacity={fOp("p1")} style={T}>timeframes[]  (multi)</text>
              <text x={598} y={380} fill={BLUE} opacity={fOp("p3")} style={T}>→ taskGroups[]  (P3)</text>
              <text x={598} y={401} fill={AMBER} opacity={fOp("p2")} style={T}>Joints: multivariants · maxPage · maxRank</text>
              <text x={598} y={422} fill={AMBER} opacity={fOp("p2")} style={T}>Disjoints: modalities · sorting</text>
              <text x={598} y={443} fill={BLUE} opacity={fOp("p3")} style={T}>frequency — new · Daily/Weekly/Monthly/Custom</text>
              <text x={598} y={464} fill={GREEN} opacity={fOp("p1")} style={T}>meta (JSON)</text>

              <rect x={580} y={480} width={385} height={115} rx={8} fill="#eaf6ef" stroke={GREEN} />
              <text x={598} y={504} fontSize={16} fontWeight={600} fill={INK}>Seed</text>
              <text x={598} y={526} fill={GREEN} opacity={fOp("p1")} style={T}>type + PDP</text>
              <text x={598} y={547} fill={GREEN} opacity={fOp("p1")} style={T}>value · discoveryKey (PDP)</text>
              <text x={598} y={568} fill={INK}>pageType · keywordType</text>
              <text x={598} y={589} fill={INK}>maxRank · destination</text>

              <rect x={580} y={605} width={385} height={52} rx={8} fill="#eaf1fe" stroke={BLUE} />
              <text x={598} y={629} fontSize={16} fontWeight={600} fill={INK}>Location Catalog / Set</text>
              <text x={598} y={650} fill={BLUE} opacity={fOp("p3")} style={T}>rename + useCases (per client)</text>

              <rect x={580} y={667} width={385} height={168} rx={8} fill="#fdeceb" stroke={RED} />
              <text x={598} y={691} fontSize={16} fontWeight={600} fill={INK}>Removed</text>
              <text x={598} y={713} fontSize={13} fill={RED} opacity={fOp("rem")} style={T}>isQaCandidate</text>
              <text x={598} y={733} fontSize={13} fill={RED} opacity={fOp("rem")} style={T}>Box</text>
              <text x={598} y={753} fontSize={13} fill={RED} opacity={fOp("rem")} style={T}>Definition method (seed / box)</text>
              <text x={598} y={773} fontSize={13} fill={RED} opacity={fOp("rem")} style={T}>Job extension</text>
              <text x={598} y={793} fontSize={13} fill={RED} textDecoration="line-through" opacity={fOp("rem")} style={T}>Box Subscription</text>
              <text x={598} y={813} fontSize={13} fill={RED} textDecoration="line-through" opacity={fOp("rem")} style={T}>StorePackage · RetailerPackage</text>
            </g>

            {/* COL 3 · two boxes — Resolution engine (fed by Scraping option, P2) + Task Generation (fed by Selection parameters, P3) */}
            <g>
              {/* Box 1 — Resolution engine */}
              <rect x={1165} y={168} width={400} height={166} rx={10} fill="#eef2f7" stroke="#94a3b8" />
              <text x={1183} y={196} fontSize={16} fontWeight={600} fill={INK}>Resolution engine</text>
              <text x={1183} y={214} fontSize={11} fill={MUT}>Data Collector · resolves the scraping config</text>
              <line x1={1183} y1={228} x2={1547} y2={228} stroke="#dbe1e8" strokeWidth={1} />
              <text x={1183} y={248} fontSize={12.5} fill={AMBER} opacity={fOp("p2")} style={T}>← Scraping option · extraction values + taskGroups</text>
              <text x={1183} y={270} fontSize={12} fill={INK}>Joints: multivariants · maxPage · maxRank</text>
              <text x={1183} y={290} fontSize={12} fill={INK}>Disjoints: modalities · sorting</text>
              <text x={1183} y={312} fontSize={12} fill={INK}>taskGroups → grouping &amp; schedule</text>

              {/* Box 2 — Task Generation (the spec-driven task generator summary) */}
              <rect x={1165} y={352} width={400} height={324} rx={10} fill="#eef2f7" stroke="#94a3b8" />
              <text x={1183} y={380} fontSize={16} fontWeight={600} fill={INK}>Task Generation</text>
              <text x={1183} y={398} fontSize={11} fill={MUT}>dbt dim_task · spec-driven</text>
              <text x={1183} y={420} fontSize={12} fontWeight={600} fill={GREEN}>24-CTE matrix → 4 engines · ~800 → ~300 lines</text>
              <line x1={1183} y1={434} x2={1547} y2={434} stroke="#dbe1e8" strokeWidth={1} />
              <text x={1183} y={454} fontSize={12.5} fill={BLUE} opacity={fOp("p3")} style={T}>← Selection parameters · rotation · freshness · volume</text>
              <text x={1183} y={474} fontSize={12.5} fill={BLUE} opacity={fOp("p3")} style={T}>Frequency · Daily / Weekly / Monthly / Custom</text>
              <line x1={1183} y1={490} x2={1547} y2={490} stroke="#dbe1e8" strokeWidth={1} />
              <text x={1183} y={510} fontSize={11} fill={SLATE}>⚙  dim_seed_location_selection_params (spec)</text>
              <text x={1183} y={532} fontSize={12.5} fill={INK}>🌱  ① Seed selection · none/weekly/monthly/stateful</text>
              <text x={1183} y={554} fontSize={12.5} fill={INK}>📍  ② Candidate locations · geoloc_mode (+ CMI)</text>
              <text x={1183} y={576} fontSize={12.5} fill={INK}>🔁  ③ Location rotation · none/cmi/hash 1-day/N-day</text>
              <text x={1183} y={598} fontSize={12.5} fill={INK}>🎛  ④ Volume policy · full/top-10/backfill 1.5×</text>
              <text x={1183} y={620} fontSize={12.5} fill={INK}>⏱  is_last_offer · freshness ≡ write cadence</text>
              <line x1={1183} y1={636} x2={1547} y2={636} stroke="#dbe1e8" strokeWidth={1} />
              <text x={1183} y={658} fontSize={13} fontWeight={600} fill={GREEN}>✅  tasks = seeds × locations / store</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
