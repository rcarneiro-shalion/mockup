import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
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

  // Full-screen the whole map region (title + chips + diagram) so the phase
  // toggles stay usable while presenting.
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

  return (
    <div className="h-full overflow-auto">
      <div
        ref={wrapRef}
        className={cn(
          "mx-auto bg-background px-6 py-6",
          isFs ? "flex min-h-full max-w-[1600px] flex-col justify-center overflow-auto" : "max-w-[1240px]",
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
          <svg viewBox="0 0 1600 1010" className="h-auto w-full min-w-[960px]" role="img" xmlns="http://www.w3.org/2000/svg">
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

            {/* ribbons — colour = phase (only true cross-entity migrations get a ribbon) */}
            <g fill="none">
              {/* Project ⇄ Job → Subscription.proj[] (P1) */}
              <path className="ph1" d="M488 132 C800 132,800 150,1112 150" stroke={GREEN} strokeWidth={14} opacity={rOp("p1")} style={T} />
              {/* Job → Subscription — businessUnit · storeId · geolocMode (P1) */}
              <path className="ph1" d="M488 300 C800 300,800 205,1112 205" stroke={GREEN} strokeWidth={22} opacity={rOp("p1")} style={T} />
              {/* Job → Scrapping option — extractionType · timeframeId (P1) */}
              <path className="ph1" d="M488 356 C800 356,800 348,1112 348" stroke={GREEN} strokeWidth={20} opacity={rOp("p1")} style={T} />
              {/* Seed → Seed (P1) */}
              <path className="ph1" d="M488 600 C800 600,800 547,1112 547" stroke={GREEN} strokeWidth={20} opacity={rOp("p1")} style={T} />
              {/* Seed fine-tuning attrs (maxPages · maxRank) → Scrapping option Joints/Disjoints (P2) */}
              <path className="ph2" d="M488 650 C800 650,800 415,1112 415" stroke={AMBER} strokeWidth={14} opacity={rOp("p2")} style={T} />
              {/* Region System → Location Catalog (P3) */}
              <path className="ph3" d="M488 728 C800 728,800 650,1112 650" stroke={BLUE} strokeWidth={14} opacity={rOp("p3")} style={T} />
            </g>

            {/* legacy boxes (left) */}
            <g fontSize={14.5} fill={INK}>
              <rect x={48} y={104} width={440} height={70} rx={8} fill="#f6f7f9" stroke="#c9c9c9" strokeDasharray="4 3" />
              <text x={66} y={132} fontSize={17} fontWeight={600}>Project ⇄ Job</text>
              <text x={66} y={156} fill={MUT}>1:N · grouped via Store Package</text>

              <rect x={48} y={228} width={440} height={290} rx={8} fill="#f6f7f9" stroke="#dcdcdc" />
              <text x={66} y={256} fontSize={17} fontWeight={600}>Job</text>
              <text x={66} y={286}>businessUnit</text>
              <text x={66} y={316}>storeId · geolocMode</text>
              <text x={66} y={346}>extractionType</text>
              <text x={66} y={376}>timeframeId</text>
              <text className="phrem" x={66} y={404} fontSize={11} letterSpacing="0.04em" fill={MUT} opacity={fOp("rem")} style={T}>OBSOLETE — TO BE REMOVED</text>
              <text className="phrem" x={66} y={428} fill={RED} opacity={fOp("rem")} style={T}>isQaCandidate</text>
              <text className="phrem" x={66} y={452} fill={RED} opacity={fOp("rem")} style={T}>Box</text>
              <text className="phrem" x={66} y={476} fill={RED} opacity={fOp("rem")} style={T}>Definition method (seed / box)</text>
              <text className="phrem" x={66} y={500} fill={RED} opacity={fOp("rem")} style={T}>Job extension</text>

              <rect x={48} y={528} width={440} height={150} rx={8} fill="#f6f7f9" stroke="#dcdcdc" />
              <text x={66} y={556} fontSize={17} fontWeight={600}>Seed (legacy)</text>
              <text x={66} y={586}>type: keyword / url / api</text>
              <text x={66} y={616}>keyword / url  (value)</text>
              <text x={66} y={646}>pageType · keywordType</text>
              <text x={66} y={676}>maxRank · maxPages · destination</text>

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
              <text className="ph3" x={1130} y={443} fill={BLUE} opacity={fOp("p3")} style={T}>frequency — new · Daily/Weekly/Monthly/Custom</text>
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

            </g>

            {/* Seeds-api refactor — seed-type merge (14 → 4+1) + retired legacy entities.
                A reference panel below the sankey; its obsolete list toggles with Removed. */}
            <g>
              <rect x={48} y={770} width={1504} height={222} rx={10} fill="#f6f7f9" stroke="#cfcfcf" />
              <text x={66} y={800} fontSize={17} fontWeight={600} fill={INK}>Seeds-api refactor</text>
              <text x={66} y={822} fontSize={13} fill={MUT}>Seed merge — 14 legacy types → 4 seed types (KEYWORD / URL / API) + PDP</text>

              {/* column dividers */}
              <g stroke="#e5e7eb" strokeWidth={1}>
                <line x1={298} y1={846} x2={298} y2={926} />
                <line x1={546} y1={846} x2={546} y2={926} />
                <line x1={794} y1={846} x2={794} y2={926} />
                <line x1={1042} y1={846} x2={1042} y2={926} />
                <line x1={1290} y1={846} x2={1290} y2={926} />
              </g>

              {/* 6 extraction-type columns; items are the seed-type variants that merge */}
              <g fontSize={12.5} fill={MUT}>
                <text x={66} y={862} fontSize={13.5} fontWeight={600} fill={INK}>Ad</text>
                <text x={66} y={884}>keyword</text>
                <text x={66} y={904}>url</text>
                <text x={66} y={924}>api</text>

                <text x={314} y={862} fontSize={13.5} fontWeight={600} fill={INK}>Search</text>
                <text x={314} y={884}>keyword</text>

                <text x={562} y={862} fontSize={13.5} fontWeight={600} fill={INK}>Shelf</text>
                <text x={562} y={884}>url</text>
                <text x={562} y={904}>api</text>

                <text x={810} y={862} fontSize={13.5} fontWeight={600} fill={INK}>Digital Shelf PLP</text>
                <text x={810} y={884}>keyword</text>
                <text x={810} y={904}>url</text>
                <text x={810} y={924}>api</text>

                <text x={1058} y={862} fontSize={13.5} fontWeight={600} fill={INK}>Digital Shelf PDP</text>
                <text x={1058} y={884}>url</text>
                <text x={1058} y={904}>api</text>

                <text x={1306} y={862} fontSize={13.5} fontWeight={600} fill={INK}>Media</text>
                <text x={1306} y={884}>url</text>
                <text x={1306} y={904}>keyword</text>
                <text x={1306} y={924}>api</text>
              </g>

              <line x1={66} y1={948} x2={1534} y2={948} stroke="#e5e7eb" strokeWidth={1} />

              {/* retired seeds-api legacy entities */}
              <text className="phrem" x={66} y={966} fontSize={11} letterSpacing="0.04em" fill={MUT} opacity={fOp("rem")} style={T}>OBSOLETE — TO BE REMOVED</text>
              <text className="phrem" x={66} y={984} fontSize={13} fill={RED} opacity={fOp("rem")} style={T}>Box Subscription  ·  StorePackage  ·  RetailerPackage</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
