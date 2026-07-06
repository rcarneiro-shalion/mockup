import { useState } from "react";
import { cn } from "@/lib/utils";

// Interactive "Delivery map" — the Seeds API field-level transition sankey.
// Each legacy Tasks-model field / relationship flows to its new home, coloured by
// the PHASE the move happens in. The phase chips toggle each phase's ribbons and
// destination fields on/off so the transition can be walked through step by step.

type Phase = "p1" | "p2" | "p3" | "rem";

const PHASES: { key: Phase; label: string; color: string }[] = [
  { key: "p1", label: "Phase 1", color: "#2e9e5b" },
  { key: "p2", label: "Phase 2", color: "#c47d1a" },
  { key: "p3", label: "Phase 3", color: "#5b8def" },
  { key: "rem", label: "Removed", color: "#d0453f" },
];

const GREEN = "#2e9e5b";
const AMBER = "#c47d1a";
const BLUE = "#5b8def";
const RED = "#d0453f";
const INK = "#1f2937";
const MUT = "#6b7280";

const T = { transition: "opacity .4s ease" } as const;

export function SeedsDeliveryMap() {
  const [vis, setVis] = useState<Record<Phase, boolean>>({ p1: true, p2: true, p3: true, rem: true });

  const allOn = PHASES.every((p) => vis[p.key]);
  const allOff = PHASES.every((p) => !vis[p.key]);
  const setAll = (v: boolean) => setVis({ p1: v, p2: v, p3: v, rem: v });
  const toggle = (k: Phase) => setVis((s) => ({ ...s, [k]: !s[k] }));

  // Opacity for a field (text) and a ribbon (path) given its phase's visibility.
  const fOp = (k: Phase) => (vis[k] ? 1 : 0.06);
  const rOp = (k: Phase) => (vis[k] ? 0.42 : 0.05);

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-[1240px] px-6 py-6">
        {/* Header */}
        <div className="mb-1">
          <h1 className="text-[17px] font-semibold text-foreground">Delivery map</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Field-level transition from the legacy Tasks model to the Seeds API — colour marks the phase each field
            lands or moves. Click a phase to show/hide its connections &amp; fields.
          </p>
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
          <svg viewBox="0 0 1600 800" className="h-auto w-full min-w-[960px]" role="img" xmlns="http://www.w3.org/2000/svg">
            <title>Seeds API — field-level transition by phase</title>
            <desc>
              Legacy Tasks-model fields and relationships flow to their new homes in the Seeds API, coloured and
              toggleable by phase.
            </desc>

            <text x={48} y={40} fontSize={15} letterSpacing="0.06em" fontWeight={600} fill={MUT}>
              LEGACY · TASKS MODEL
            </text>
            <text x={1112} y={40} fontSize={15} letterSpacing="0.06em" fontWeight={600} fill={MUT}>
              SEEDS API · NEW HOME
            </text>

            {/* ribbons — colour = phase */}
            <g fill="none">
              <path className="ph1" d="M488 132 C800 132,800 150,1112 150" stroke={GREEN} strokeWidth={14} opacity={rOp("p1")} style={T} />
              <path className="ph1" d="M488 300 C800 300,800 205,1112 205" stroke={GREEN} strokeWidth={24} opacity={rOp("p1")} style={T} />
              <path className="ph3" d="M488 320 C800 320,800 262,1112 262" stroke={BLUE} strokeWidth={14} opacity={rOp("p3")} style={T} />
              <path className="ph1" d="M488 356 C800 356,800 348,1112 348" stroke={GREEN} strokeWidth={20} opacity={rOp("p1")} style={T} />
              <path className="ph2" d="M488 406 C800 406,800 401,1112 401" stroke={AMBER} strokeWidth={14} opacity={rOp("p2")} style={T} />
              <path className="ph3" d="M488 436 C800 436,800 440,1112 440" stroke={BLUE} strokeWidth={14} opacity={rOp("p3")} style={T} />
              <path className="phrem" d="M488 466 C800 466,800 734,1112 734" stroke={RED} strokeWidth={16} opacity={rOp("rem")} style={T} />
              <path className="ph1" d="M488 600 C800 600,800 547,1112 547" stroke={GREEN} strokeWidth={20} opacity={rOp("p1")} style={T} />
              <path className="ph2" d="M488 650 C800 650,800 415,1112 415" stroke={AMBER} strokeWidth={14} opacity={rOp("p2")} style={T} />
              <path className="ph3" d="M488 728 C800 728,800 650,1112 650" stroke={BLUE} strokeWidth={14} opacity={rOp("p3")} style={T} />
            </g>

            {/* legacy boxes (left) */}
            <g fontSize={14.5} fill={INK}>
              <rect x={48} y={104} width={440} height={70} rx={8} fill="#f6f7f9" stroke="#c9c9c9" strokeDasharray="4 3" />
              <text x={66} y={132} fontSize={17} fontWeight={600}>Project ⇄ Job</text>
              <text x={66} y={156} fill={MUT}>1:N · grouped via Store Package</text>

              <rect x={48} y={228} width={440} height={258} rx={8} fill="#f6f7f9" stroke="#dcdcdc" />
              <text x={66} y={256} fontSize={17} fontWeight={600}>Job</text>
              <text x={66} y={286}>status · businessUnit</text>
              <text x={66} y={316}>storeId · geolocMode</text>
              <text x={66} y={346}>extractionType</text>
              <text x={66} y={376}>timeframeId</text>
              <text x={66} y={406}>frequency · maxPages</text>
              <text x={66} y={436}>isQaCandidate</text>
              <text x={66} y={466}>boxIds · storePackage</text>

              <rect x={48} y={528} width={440} height={150} rx={8} fill="#f6f7f9" stroke="#dcdcdc" />
              <text x={66} y={556} fontSize={17} fontWeight={600}>Seed (legacy)</text>
              <text x={66} y={586}>type: keyword / url / api</text>
              <text x={66} y={616}>keyword / url  (value)</text>
              <text x={66} y={646}>pageType · keywordType</text>
              <text x={66} y={676}>maxRank · destination</text>

              <rect x={48} y={700} width={440} height={58} rx={8} fill="#f6f7f9" stroke="#dcdcdc" />
              <text x={66} y={726} fontSize={17} fontWeight={600}>Region System</text>
              <text x={66} y={750} fontSize={13.5}>Region · RegionLocation</text>
            </g>

            {/* seeds-api boxes (right) */}
            <g fontSize={14.5}>
              <rect x={1112} y={104} width={440} height={178} rx={8} fill="#f3f4f6" stroke="#cfcfcf" />
              <text x={1130} y={128} fontSize={17} fontWeight={600} fill={INK}>Subscription</text>
              <text className="ph1" x={1130} y={150} fill={GREEN} fontWeight={600} opacity={fOp("p1")} style={T}>projects[] — N:M, direct</text>
              <text x={1130} y={171} fill={INK}>name · status · store</text>
              <text className="ph1" x={1130} y={192} fill={GREEN} opacity={fOp("p1")} style={T}>geo → NONE / AUTO / MANUAL / VIRTUAL_STORE</text>
              <text className="ph1" x={1130} y={213} fill={GREEN} opacity={fOp("p1")} style={T}>destinationOptions[] · Discovery</text>
              <text className="ph1" x={1130} y={234} fill={GREEN} opacity={fOp("p1")} style={T}>locations[] (MANUAL — direct)</text>
              <text className="ph3" x={1130} y={255} fill={BLUE} opacity={fOp("p3")} style={T}>→ locationSet reference  (P3)</text>
              <text className="ph3" x={1130} y={276} fill={BLUE} opacity={fOp("p3")} style={T}>Selection parameters  (P3)</text>

              <rect x={1112} y={292} width={440} height={178} rx={8} fill="#eaf6ef" stroke={GREEN} />
              <text x={1130} y={316} fontSize={17} fontWeight={600} fill={INK}>Scrapping option  ·  new</text>
              <text className="ph1" x={1130} y={338} fill={GREEN} opacity={fOp("p1")} style={T}>name · status · extractionType</text>
              <text className="ph1" x={1130} y={359} fill={GREEN} opacity={fOp("p1")} style={T}>timeframes[]  (multi)</text>
              <text className="ph3" x={1130} y={380} fill={BLUE} opacity={fOp("p3")} style={T}>→ taskGroups[]  (P3)</text>
              <text className="ph2" x={1130} y={401} fill={AMBER} opacity={fOp("p2")} style={T}>Joints: multivariants · maxPage · maxRank</text>
              <text className="ph2" x={1130} y={422} fill={AMBER} opacity={fOp("p2")} style={T}>Disjoints: modalities · sorting</text>
              <text className="ph3" x={1130} y={443} fill={BLUE} opacity={fOp("p3")} style={T}>frequency — Daily/Weekly/Monthly/Custom (P3)</text>
              <text className="ph1" x={1130} y={464} fill={GREEN} opacity={fOp("p1")} style={T}>meta (JSON)</text>

              <rect x={1112} y={480} width={440} height={115} rx={8} fill="#eaf6ef" stroke={GREEN} />
              <text x={1130} y={504} fontSize={17} fontWeight={600} fill={INK}>Seed</text>
              <text className="ph1" x={1130} y={526} fill={GREEN} opacity={fOp("p1")} style={T}>type + PDP</text>
              <text className="ph1" x={1130} y={547} fill={GREEN} opacity={fOp("p1")} style={T}>value · discoveryKey (PDP)</text>
              <text x={1130} y={568} fill={INK}>pageType · keywordType</text>
              <text x={1130} y={589} fill={INK}>maxRank · destination</text>

              <rect x={1112} y={605} width={440} height={52} rx={8} fill="#eaf1fe" stroke={BLUE} />
              <text x={1130} y={629} fontSize={17} fontWeight={600} fill={INK}>Location Catalog / Set</text>
              <text className="ph3" x={1130} y={650} fill={BLUE} opacity={fOp("p3")} style={T}>rename + useCases (per client)</text>

              <rect x={1112} y={667} width={440} height={94} rx={8} fill="#fdeceb" stroke={RED} />
              <text x={1130} y={691} fontSize={17} fontWeight={600} fill={INK}>Removed</text>
              <text className="phrem" x={1130} y={713} fill={RED} opacity={fOp("rem")} style={T}>isQaCandidate</text>
              <text className="phrem" x={1130} y={734} fill={RED} opacity={fOp("rem")} style={T}>Box / Box Subscription</text>
              <text className="phrem" x={1130} y={755} fill={RED} opacity={fOp("rem")} style={T}>storePackage · retailerPackage</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
