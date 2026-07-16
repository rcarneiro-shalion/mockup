import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  Calendar,
  ChevronDown,
  SlidersHorizontal,
  Regex,
  Maximize2,
  Minimize2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// "Try regex" modal — mirrors the real console BrandTryRegexModal: a regex
// filter bar + Last-date-found range, Listings / Ads tabs, and a wide results
// grid (Image, Title, Retailer, Brand, Category, Discovery key, dates, Matching
// type, Matching count). Sample data only; no real query. Switching tabs or
// clearing resets to the "Apply filters to view …" overlay.
// ---------------------------------------------------------------------------

type Listing = {
  id: string;
  title: string;
  retailer: string;
  brand: string;
  category: string;
  discoveryKey: string;
  firstDate: string;
  lastDate: string;
  matchingType: string;
  matchingCount: number;
};

const SODA = "Beverages > Soft Drinks > Soda";
const L = (
  id: string,
  title: string,
  retailer: string,
  brand: string,
  discoveryKey: string,
  firstDate: string,
  matchingCount: number,
): Listing => ({
  id,
  title,
  retailer,
  brand,
  category: SODA,
  discoveryKey,
  firstDate,
  lastDate: "2026-07-15",
  matchingType: "AUTO",
  matchingCount,
});

// Realistic Coca-Cola / Inca Kola listings (matches the real "coca" search).
const SAMPLE_LISTINGS: Listing[] = [
  L("l1", "Pack Gaseosa 1.5L: Coca Cola + Inca Kola", "Metro PE", "Inca Kola", "1096900", "2026-03-15", 1),
  L("l2", "Coca Cola Coca Cola Pack Gaseosa: Coca Cola 3L + Inca Kola 3L", "Metro PE", "Inca Kola", "82", "2025-10-04", 1),
  L("l3", "Coca-cola Jarabe Diet Coke Para Bolsa De 2.5 Galones", "Mercado Libre MX", "Coca-Cola", "MLM5546856256", "2026-06-30", 1),
  L("l4", "COCA-COLA Gaseosa Coca Cola+Sprite+Fanta+Fresca mini lata - 1896 ml", "Mas x Menos CR", "Fresca", "8749", "2025-08-01", 1),
  L("l5", "Gaseosa Coca-Cola 3 L + Gaseosa Inca Kola 3 L", "PedidosYa PE", "Coca-Cola", "66bf3b210c624b782be", "2025-05-17", 19),
  L("l6", "Coca-Cola Gaseosa + Inca Kola Gaseosa - 2 X 3 L", "Rappi PE", "Inca Kola", "https://images.rappi.pe/", "2025-09-09", 45),
  L("l7", "Coca Cola Coca Cola Soda Schweppes Club Soda Lata x 355 ml", "Farmatodo VE", "Coca-Cola", "111017435", "2026-06-08", 1),
  L("l8", "Gaseosa Coca Cola Original 3L + Gaseosa Inca Kola Original 3L 2un", "Metro PE", "Coca-Cola", "40753", "2026-03-17", 2),
  L("l9", "Coca-Cola Pack Gaseosa Original + Inka Kola Sabor Original - 3 X 3 L", "Rappi PE", "Inca Kola", "https://images.rappi.pe/3df7-4b24", "2025-05-21", 12),
  L("l10", "Pack Gaseosa: Coca Cola Sin Azúcar 1.5L + Inca Kola Sin Azúcar 1.5L", "Metro PE", "Inca Kola Sin Azúcar", "994909", "2025-10-01", 2),
  L("l11", "Coca-Cola Coca-Cola Gaseosa Coca-Cola 3 L + Gaseosa Inca Kola 3 L", "PedidosYa PE", "Coca-Cola", "66bf3b210c624b782beddf4", "2026-06-01", 12),
  L("l12", "COCA COLA Gaseosa Sabor Original + INCA KOLA Botella 3L Paquete 2un", "Plaza Vea PE", "Inca Kola", "5094", "2025-06-09", 1),
  L("l13", "Coca Cola Pack Gaseosas: Coca Cola 1.5L + Schweppes Ginger Ale 1.5L", "Cencosud Wong PE", "Coca-Cola", "2050044448533", "2025-12-13", 1),
  L("l14", "Ahorrapack Gaseosas 2.25L: Coca Cola + Inca Kola", "Metro PE", "Coca-Cola", "1100904", "2026-06-07", 1),
];

const ADS_SAMPLE: Listing[] = [
  L("a1", "Coca-Cola Original 3L — Sponsored", "Rappi PE", "Coca-Cola", "AD-88213", "2026-05-02", 7),
  L("a2", "Inca Kola Sin Azúcar 1.5L — Featured", "Metro PE", "Inca Kola Sin Azúcar", "AD-90455", "2026-06-11", 3),
  L("a3", "Coca-Cola Zero Pack — Promoted", "PedidosYa PE", "Coca-Cola", "AD-77120", "2026-04-19", 5),
];

const linkCls = "text-[var(--sidebar-active-fg)] hover:underline cursor-pointer";
const cellPad = "px-3 py-2.5 align-top";

function Thumb() {
  return (
    <div className="grid h-10 w-12 place-items-center rounded border border-border bg-secondary text-base">
      🥤
    </div>
  );
}

export function TryRegexModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [tab, setTab] = useState<"listings" | "ads">("listings");
  const [regex, setRegex] = useState("");
  const [applied, setApplied] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const canApply = regex.trim().length > 0;
  const rows = applied ? (tab === "listings" ? SAMPLE_LISTINGS : ADS_SAMPLE) : [];
  const total = applied ? 314689 : 0;
  const pages = applied ? 3147 : 0;
  const noun = tab === "listings" ? "listings" : "ads";

  const apply = () => canApply && setApplied(true);
  const clearAll = () => {
    setRegex("");
    setApplied(false);
  };
  const switchTab = (t: "listings" | "ads") => {
    setTab(t);
    setApplied(false); // real modal resets results on tab change
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex flex-col gap-0 overflow-hidden p-0",
          maximized ? "h-[96vh] w-[98vw] max-w-none" : "h-[88vh] w-[95vw] max-w-6xl",
        )}
      >
        {/* Header */}
        <DialogHeader className="space-y-0 border-b border-border px-5 pb-4 pt-5 text-left">
          <div className="flex items-start gap-2.5">
            <Regex className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <DialogTitle className="text-base font-semibold">Try regex</DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter a regex to get the results that will match with listings and ads
                <br />
                Date range defaults to the last 60 days.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMaximized((m) => !m)}
            className="absolute right-11 top-4 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label={maximized ? "Restore" : "Maximize"}
          >
            {maximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </DialogHeader>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
          <div className="relative min-w-[280px] flex-1 sm:flex-none">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              placeholder="Enter a regex"
              onKeyDown={(e) => e.key === "Enter" && apply()}
              className="h-9 pl-8 font-mono text-xs"
            />
          </div>
          <button
            type="button"
            title="Date range — defaults to the last 60 days"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-foreground/80 hover:bg-secondary"
          >
            <Calendar className="h-4 w-4 text-muted-foreground" /> Last date found
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          <Button size="sm" className="h-9" disabled={!canApply} onClick={apply}>
            Apply filters
          </Button>
          {applied && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-9 items-center gap-1.5 px-2 text-sm font-medium text-[var(--sidebar-active-fg)] hover:underline"
            >
              <span className="text-base leading-none">×</span> Clear all filters
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border px-5">
          {(["listings", "ads"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchTab(t)}
              className={cn(
                "relative px-3 py-2.5 text-sm capitalize",
                tab === t
                  ? "font-medium text-foreground after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[var(--sidebar-active-fg)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="min-h-0 flex-1 overflow-auto">
          {rows.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <SlidersHorizontal className="h-5 w-5" />
              <span className="text-sm">Apply filters to view {noun}</span>
            </div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-secondary/80 text-xs text-muted-foreground backdrop-blur">
                <tr className="border-b border-border">
                  <th className={cn(cellPad, "w-[120px] text-left font-medium")}>Image</th>
                  <th className={cn(cellPad, "min-w-[280px] text-left font-medium")}>Title</th>
                  <th className={cn(cellPad, "min-w-[180px] text-left font-medium")}>Retailer</th>
                  <th className={cn(cellPad, "min-w-[170px] text-left font-medium")}>Brand</th>
                  <th className={cn(cellPad, "min-w-[200px] text-left font-medium")}>Category</th>
                  <th className={cn(cellPad, "min-w-[200px] text-left font-medium")}>Discovery key</th>
                  <th className={cn(cellPad, "min-w-[160px] text-left font-medium")}>First date found</th>
                  <th className={cn(cellPad, "min-w-[160px] text-left font-medium")}>Last date found</th>
                  <th className={cn(cellPad, "min-w-[130px] text-left font-medium")}>Matching type</th>
                  <th className={cn(cellPad, "min-w-[130px] text-left font-medium")}>Matching count</th>
                  <th className={cn(cellPad, "w-10")} />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-secondary/40">
                    <td className={cellPad}>
                      <Thumb />
                    </td>
                    <td className={cn(cellPad, "text-foreground/90")}>{r.title}</td>
                    <td className={cellPad}>
                      <span className={linkCls}>{r.retailer}</span>
                    </td>
                    <td className={cellPad}>
                      <span className={linkCls}>{r.brand}</span>
                    </td>
                    <td className={cellPad}>
                      <span className={linkCls}>{r.category}</span>
                    </td>
                    <td className={cn(cellPad, "truncate text-foreground/70")}>{r.discoveryKey}</td>
                    <td className={cn(cellPad, "whitespace-nowrap text-muted-foreground")}>
                      {r.firstDate}, 00:00:00
                    </td>
                    <td className={cn(cellPad, "whitespace-nowrap text-muted-foreground")}>
                      {r.lastDate}, 00:00:00
                    </td>
                    <td className={cellPad}>
                      <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground/70">
                        {r.matchingType}
                      </span>
                    </td>
                    <td className={cn(cellPad, "text-foreground/80")}>{r.matchingCount}</td>
                    <td className={cellPad}>
                      <button
                        type="button"
                        className="rounded p-1 text-muted-foreground hover:bg-secondary"
                        aria-label="Row actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-5 border-t border-border px-5 py-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            Rows per page:
            <span className="rounded border border-border px-2 py-0.5 text-foreground">100</span>
          </span>
          <span>
            {rows.length === 0 ? "0–0 of 0" : `1–100 of ${total.toLocaleString("en-US")}`}
          </span>
          <div className="flex items-center gap-1">
            <button className="rounded p-1 hover:bg-secondary disabled:opacity-40" disabled aria-label="Previous">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pages > 0 &&
              [1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={cn(
                    "grid h-6 min-w-6 place-items-center rounded px-1 text-xs",
                    n === 1
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:bg-secondary",
                  )}
                >
                  {n}
                </span>
              ))}
            {pages > 0 && (
              <>
                <span className="px-1">…</span>
                <span className="grid h-6 min-w-6 place-items-center rounded px-1 text-xs text-muted-foreground">
                  {pages}
                </span>
              </>
            )}
            <button
              className="rounded p-1 hover:bg-secondary disabled:opacity-40"
              disabled={pages === 0}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
