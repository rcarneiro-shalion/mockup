import { useState } from "react";
import { ChevronDown, Copy, GripVertical, LayoutList, Plus, Box, X, Globe, MapPin, LayoutGrid, Store, Target, ArrowUp, ArrowDown, Filter, Check, Search, ShoppingCart, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { flag, countryLabel, COUNTRY_OPTIONS } from "@/lib/retailers";
import { getDashboardApps } from "@/lib/dashboardApps";
import { usePersistentState } from "@/hooks/usePersistentState";
import { MU_SEED } from "@/lib/massiveUpdate";

type SectionType = "CUSTOM" | "BUILT_IN";
type Maestro = string;
type Section = { id: string; path: string; type: SectionType; maestro: Maestro; group?: string; label?: string };
type Cube = { id: string; name: string; createdAt: string; updatedAt: string };
type CountryRow = { id: string; code: string; createdAt: string; updatedAt: string };

const INITIAL_SECTIONS: Section[] = [
  { id: "1", path: "/dse-scorecard-coke/scorecard", type: "CUSTOM", maestro: "Digital Shelf Maestro" },
  { id: "2", path: "/dse-scorecard-coke/latam-scorecard", type: "CUSTOM", maestro: "Digital Shelf Maestro" },
  { id: "3", path: "/dse-range/oos", type: "BUILT_IN", maestro: "Digital Shelf Maestro" },
  { id: "4", path: "/dse-range/assortment", type: "BUILT_IN", maestro: "Digital Shelf Maestro" },
  { id: "5", path: "/dse-range/price", type: "BUILT_IN", maestro: "Digital Shelf Maestro" },
  { id: "6", path: "/dse-range/promos", type: "BUILT_IN", maestro: "Digital Shelf Maestro" },
  { id: "7", path: "/dse-content/content", type: "CUSTOM", maestro: "Digital Shelf Maestro" },
  { id: "8", path: "/dse-content/ratings-reviews", type: "CUSTOM", maestro: "Digital Shelf Maestro" },
  { id: "9", path: "/dse-content/ingredientsnutritients", type: "BUILT_IN", maestro: "Digital Shelf Maestro" },
  { id: "10", path: "/dse-content/image-validation", type: "CUSTOM", maestro: "Digital Shelf Maestro" },
  { id: "11", path: "/dsm-visibility/share-of-voice", type: "BUILT_IN", maestro: "Digital Shelf Maestro" },
  { id: "12", path: "/dsm-visibility/visibility-shares-location", type: "BUILT_IN", maestro: "Digital Shelf Maestro" },
  { id: "13", path: "actionplan", type: "CUSTOM", maestro: "Amazon Shelf Maestro" },
  { id: "14", path: "syntheticqueries", type: "CUSTOM", maestro: "Amazon Shelf Maestro" },
];
const CUBE_NAMES = [
  "mart_asm", "rufus_query_results", "rufus_actions", "mart_range", "mart_range_agg_brand_region",
  "mart_range_agg_brand_location", "mart_range_agg_dk_region", "mart_content_assortment_ilo", "mart_content_assortment",
  "mart_content_monthly_ilo", "mart_content_monthly", "mart_visibility_agg_placements", "mart_visibility_agg_brand",
  "mart_coke_global_scorecard", "mart_coke_scorecard", "mart_content_assortment_ni", "mart_content_assortment_nutrients_ilo",
  "restaurant_branches_by_period", "restaurant_by_period", "mart_marketplace", "mart_ai_keyword_intel_dsm",
  "mart_ai_market_share", "mart_discovery",
];
const INITIAL_CUBES: Cube[] = CUBE_NAMES.map((name, i) => ({
  id: `c${i + 1}`, name, createdAt: "Mon, Apr 27, 2026 2:46 PM", updatedAt: "Mon, Apr 27, 2026 2:46 PM",
}));

type ClientRegion = { id: string; name: string; regionSystem: string; country: string };
const CLIENT_REGIONS: ClientRegion[] = [
  { id: "cr1", name: "FEMSA MX", regionSystem: "MX - Coke Bottlers", country: "MX" },
  { id: "cr2", name: "FEMSA NI", regionSystem: "NI - Coke Bottlers", country: "NI" },
  { id: "cr3", name: "Arca AR", regionSystem: "AR - Coke Bottlers", country: "AR" },
  { id: "cr4", name: "FEMSA VE", regionSystem: "VE - Coke Bottlers", country: "VE" },
  { id: "cr5", name: "FEMSA CR", regionSystem: "CR - Coke Bottlers", country: "CR" },
  { id: "cr6", name: "Solar BR", regionSystem: "BR - Coke Bottlers", country: "BR" },
  { id: "cr7", name: "Embol BO", regionSystem: "BO - Coke Bottlers", country: "BO" },
  { id: "cr8", name: "FEMSA BR", regionSystem: "BR - Coke Bottlers", country: "BR" },
  { id: "cr9", name: "Colima MX", regionSystem: "MX - Coke Bottlers", country: "MX" },
  { id: "cr10", name: "FEMSA Monresa UY", regionSystem: "UY - Coke Bottlers", country: "UY" },
  { id: "cr11", name: "Brasal BR", regionSystem: "BR - Coke Bottlers", country: "BR" },
  { id: "cr12", name: "Bepensa MX", regionSystem: "MX - Coke Bottlers", country: "MX" },
  { id: "cr13", name: "Lee AR", regionSystem: "AR - Coke Bottlers", country: "AR" },
];

const CATEGORIES = [
  "Beverages > Ready-to-drink > Other", "Beverages > Waters > Other", "Beverages > Soft Drinks > Other",
  "Beverages > Waters > Sparkling Water", "Beverages > Waters > Flavored Water", "Beverages > Juices > Other",
  "Beverages > Ready-to-drink > Iced Coffee", "Beverages > Soft Drinks > Soda", "Beverages > Ready-to-drink > Iced Tea",
  "Beverages > Soft Drinks > Energy Drinks", "Beverages > Ready-to-drink > Hard Seltzers", "Beverages > Waters > Still Water",
  "Beverages > Soft Drinks > Sport Drinks",
];

const EXTRACTION_TYPES = ["SEARCH", "SHELF", "AD", "DIGITAL_SHELF_PDP", "DIGITAL_SHELF_PLP", "MEDIA", "FSA"];
const EXTRACTION_STORES = [
  "Walmart Mismo Dia MX", "Naguno BR", "GrabFood MM - FSA", "El Corte Ingles Supermercado ES", "GrabFood VN - QCA",
  "Farmacorp BO", "iFood BR - FSA", "Uber Eats BR - Pao de Acucar", "Extra Bom App BR", "La Torre GT",
  "Uber Eats CR - Perimercados", "Uber Eats CN - FSA", "Rappi APP AR - Vea", "Walmart NI", "Chedraui MX",
  "Tata UY", "Glovo RS - FSA", "La Comer MX", "Uber Eats MX - FSA", "Walt IL - FSA",
  "Super Muffato BR", "Uber Eats MX - Costco", "Dia AR", "PedidosYa NC - FSA", "PedidosYa APP PE - Market",
];

const TARGET_OPTIONS = [
  "description_score_target", "secondary_image_score_target", "image_count_target", "availability_target",
  "rating_average_target", "outofstock_target", "image_score_target", "drop_price_alert_threshold", "overprice_threshold",
];
const CATEGORY_PICKER: { value: string; hint?: string }[] = [
  { value: "Pharma > Health > Allergy and Asthma", hint: "Allergy and asthma such as loratadine" },
  { value: "Beverages > Soft Drinks > Other", hint: "MOTHER CATEGORY Drinks that do not have a specific category: kombucha, coconut water, iced tea" },
  { value: "Electronics > Other > Other", hint: "MOTHER CATEGORY (Alarms, alarm clocks, tracking devices such as Airtags)" },
  { value: "Pantry > Snacks > Dips", hint: "Dips and spreadable salsas like hummus, guacamole, cheese dips, etc." },
  { value: "Pantry > Snacks > Pretzels", hint: "Baked snack characterized by its unique knot-like shape and a salty flavor" },
  { value: "Pantry > Snacks > Chips", hint: "Fries, tortilla chips, corn chips, pork rinds, etc." },
  { value: "Beverages > Juices > Other", hint: "Juices and nectars" },
  { value: "Beverages > Waters > Still Water", hint: "Non-sparkling bottled water" },
];
const REGION_SYSTEM_OPTIONS = ["MX - Coke Bottlers", "BR - Coke Bottlers", "AR - Coke Bottlers", "CO - Coke Bottlers", "US - Coke Bottlers"];
const REGION_OPTIONS = ["FEMSA MX", "Arca AR", "Solar BR", "Embol BO", "Colima MX", "Bepensa MX", "Lee AR", "Brasal BR"];

/** Reusable single-select "assign" modal with a searchable list. */
function AssignPicker({
  title, label, placeholder, options, getLabel, getHint, confirmLabel, onAssign, onClose,
}: {
  title: string;
  label: string;
  placeholder?: string;
  options: string[];
  getLabel?: (o: string) => React.ReactNode;
  getHint?: (o: string) => string | undefined;
  confirmLabel: string;
  onAssign: (value: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("");
  const text = (o: string) => (typeof getLabel?.(o) === "string" ? (getLabel!(o) as string) : o);
  const filtered = options.filter((o) => text(o).toLowerCase().includes(q.toLowerCase()) || (getHint?.(o) ?? "").toLowerCase().includes(q.toLowerCase()));
  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">{label} <span className="text-destructive">*</span></label>
        <input
          value={sel ? text(sel) : q}
          onChange={(e) => { setQ(e.target.value); setSel(""); }}
          placeholder={placeholder ?? "Search"}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="max-h-64 overflow-auto rounded-md border border-border">
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">No results.</div>
          ) : filtered.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => { setSel(o); setQ(""); }}
              className={cn("flex w-full flex-col items-start gap-0.5 border-b border-border px-3 py-2 text-left last:border-0 hover:bg-accent", sel === o && "bg-accent")}
            >
              <span className="text-sm text-foreground">{getLabel ? getLabel(o) : o}</span>
              {getHint?.(o) && <span className="text-xs text-muted-foreground">{getHint(o)}</span>}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
          <button onClick={() => sel && onAssign(sel)} disabled={!sel} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">{confirmLabel}</button>
        </div>
      </div>
    </Modal>
  );
}

function AssignClientRegionModal({ onClose, onAssign }: { onClose: () => void; onAssign: (r: { regionSystem: string; region: string }) => void }) {
  const [regionSystem, setRegionSystem] = useState("");
  const [region, setRegion] = useState("");
  const Sel = ({ value, onChange, options, ph }: { value: string; onChange: (v: string) => void; options: string[]; ph: string }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
      <option value="">{ph}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  return (
    <Modal title="Assign client region" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Region system <span className="text-destructive">*</span></label>
          <Sel value={regionSystem} onChange={setRegionSystem} options={REGION_SYSTEM_OPTIONS} ph="Select a region system" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Region <span className="text-destructive">*</span></label>
          <Sel value={region} onChange={setRegion} options={REGION_OPTIONS} ph="Select a region" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
          <button onClick={() => regionSystem && region && onAssign({ regionSystem, region })} disabled={!regionSystem || !region} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">Assign client region</button>
        </div>
      </div>
    </Modal>
  );
}
const COUNTRY_CODES = [
  "CR", "CA", "NO", "NZ", "BE", "VN", "PH", "GT", "LU", "ID", "MY", "AU", "VE", "SE", "SA",
  "CZ", "AR", "PK", "IT", "KH", "MM", "CH", "TH", "PA", "TR", "KZ", "FI", "GB", "FR", "RO",
  "NI", "ES", "US", "BO", "MX", "EE", "HK", "GR", "BG", "UY", "IN", "TW", "NL", "LK", "PE",
  "BD", "HU", "CL", "CO", "BR", "AT", "EC", "ZA", "PL", "DK", "PT", "SG", "DE", "IE", "AE",
];
const INITIAL_COUNTRIES: CountryRow[] = COUNTRY_CODES.map((code, i) => ({
  id: `cn-${i}`,
  code,
  createdAt: i % 3 === 0 ? "Mon, May 19, 2025 11:00" : "Tue, Oct 15, 2024 9:05",
  updatedAt: i % 3 === 0 ? "Mon, May 19, 2025 11:00" : "Tue, Oct 15, 2024 9:11",
}));

type TabKey = "countries" | "client-regions" | "categories" | "store-extraction-types" | "targets" | "retailers" | "sections" | "cubes";

const ALL_TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "countries", label: "Countries", icon: <Globe className="h-4 w-4" /> },
  { key: "client-regions", label: "Client regions", icon: <MapPin className="h-4 w-4" /> },
  { key: "categories", label: "Categories", icon: <LayoutGrid className="h-4 w-4" /> },
  { key: "store-extraction-types", label: "Store extraction types", icon: <Store className="h-4 w-4" /> },
  { key: "targets", label: "Targets", icon: <Target className="h-4 w-4" /> },
  { key: "retailers", label: "Retailers", icon: <ShoppingCart className="h-4 w-4" /> },
  { key: "sections", label: "Dashboard sections", icon: <LayoutList className="h-4 w-4" /> },
  { key: "cubes", label: "Cubes", icon: <Box className="h-4 w-4" /> },
];
const PARENT_TAB_KEYS: TabKey[] = ["sections", "cubes"];

export function DataGroupTabs({ isParent = false, dataGroupId, dashboardType = "Brand" }: { isParent?: boolean; dataGroupId?: string; dashboardType?: "Brand" | "Agency" }) {
  const visibleTabs = isParent ? ALL_TABS.filter((t) => PARENT_TAB_KEYS.includes(t.key)) : ALL_TABS;
  // Deep-linkable tab (?tab=retailers) — handy for demos/screenshots.
  const urlTab = typeof window !== "undefined"
    ? (new URLSearchParams(window.location.search).get("tab") as TabKey | null)
    : null;
  const [tab, setTab] = useState<TabKey>(
    urlTab && ALL_TABS.some((t) => t.key === urlTab) ? urlTab : isParent ? "sections" : "countries",
  );
  const activeTab = visibleTabs.some((t) => t.key === tab) ? tab : visibleTabs[0].key;

  // Sections are per data group + persisted (this is the thing being managed).
  const [sections, setSections] = usePersistentState<Section[]>(
    `dg-sections:${dataGroupId ?? "default"}:v1`,
    INITIAL_SECTIONS,
  );
  const [sectionsCollapsed, setSectionsCollapsed] = useState(false);
  const [cubes, setCubes] = useState<Cube[]>(INITIAL_CUBES);
  const [countries, setCountries] = useState<CountryRow[]>(INITIAL_COUNTRIES);

  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [assignCubeOpen, setAssignCubeOpen] = useState(false);

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border">
        {visibleTabs.map((t) => (
          <TabButton key={t.key} active={activeTab === t.key} onClick={() => setTab(t.key)} icon={t.icon}>
            {t.label}
          </TabButton>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === "countries" && <CountriesPanel countries={countries} setCountries={setCountries} />}
        {activeTab === "client-regions" && <ClientRegionsPanel />}
        {activeTab === "categories" && <CategoriesPanel />}
        {activeTab === "store-extraction-types" && <StoreExtractionPanel />}
        {activeTab === "targets" && <TargetsPanel />}
        {activeTab === "retailers" && <RetailersPanel dashboardType={dashboardType} dataGroupId={dataGroupId} dgSectionPaths={sections.map((s) => s.path)} />}
        {activeTab === "sections" && (
          <SectionsPanel sections={sections} setSections={setSections} collapsed={sectionsCollapsed} setCollapsed={setSectionsCollapsed} onAdd={() => setAddSectionOpen(true)} />
        )}
        {activeTab === "cubes" && <CubesPanel cubes={cubes} setCubes={setCubes} onAssign={() => setAssignCubeOpen(true)} />}
      </div>

      {addSectionOpen && (
        <AddSectionModal
          existingPaths={new Set(sections.map((s) => s.path))}
          onClose={() => setAddSectionOpen(false)}
          onAdd={(items) => {
            setSections((p) => [...p, ...items.map((s) => ({ ...s, id: crypto.randomUUID() }))]);
            setAddSectionOpen(false);
          }}
        />
      )}
      {assignCubeOpen && (
        <AssignCubeModal existing={cubes.map((c) => c.name)} onClose={() => setAssignCubeOpen(false)} onAssign={(name) => { const now = formatNow(); setCubes((p) => [...p, { id: crypto.randomUUID(), name, createdAt: now, updatedAt: now }]); setAssignCubeOpen(false); }} />
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("relative inline-flex items-center gap-2 px-4 py-3 text-sm transition-colors", active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground")}>
      {icon}
      {children}
      {active && <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-foreground rounded-full" />}
    </button>
  );
}

function CountriesPanel({ countries, setCountries }: { countries: CountryRow[]; setCountries: React.Dispatch<React.SetStateAction<CountryRow[]>> }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const available = COUNTRY_OPTIONS.filter((c) => !countries.some((r) => r.code === c));
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Countries</h3>
        <button onClick={() => setAssignOpen(true)} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
          <Plus className="h-3.5 w-3.5" /> Assign country
        </button>
      </div>
      {assignOpen && (
        <AssignPicker
          title="Assign country"
          label="Country"
          placeholder="Search country"
          options={available}
          getLabel={(c) => `${flag(c)} ${countryLabel(c).replace(/^[^\s]+\s/, "")} (${c})`}
          confirmLabel="Assign country"
          onClose={() => setAssignOpen(false)}
          onAssign={(c) => {
            setCountries((p) => [...p, { id: crypto.randomUUID(), code: c, createdAt: formatNow(), updatedAt: formatNow() }]);
            setAssignOpen(false);
          }}
        />
      )}
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">Country code</th>
              <th className="px-4 py-2.5 text-left font-medium">Created at</th>
              <th className="px-4 py-2.5 text-left font-medium">Updated at</th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {countries.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-2 text-foreground"><span className="inline-flex items-center gap-2"><span>{flag(c.code)}</span>{c.code}</span></td>
                <td className="px-4 py-2 text-muted-foreground">{c.createdAt}</td>
                <td className="px-4 py-2 text-muted-foreground">{c.updatedAt}</td>
                <td className="px-2 py-2 text-right">
                  <button onClick={() => setCountries((rows) => rows.filter((r) => r.id !== c.id))} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive transition-colors" aria-label={`Remove ${c.code}`}>
                    <X className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination total={countries.length} />
    </div>
  );
}

function PanelHeader({ title, addLabel, onAdd }: { title: string; addLabel: string; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <button onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  );
}

function ClientRegionsPanel() {
  const [rows, setRows] = useState<ClientRegion[]>(CLIENT_REGIONS);
  const [assignOpen, setAssignOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <PanelHeader title="Client regions" addLabel="Assign client region" onAdd={() => setAssignOpen(true)} />
      {assignOpen && (
        <AssignClientRegionModal
          onClose={() => setAssignOpen(false)}
          onAssign={({ regionSystem, region }) => {
            setRows((p) => [...p, { id: crypto.randomUUID(), name: region, regionSystem, country: regionSystem.split(" - ")[0] }]);
            setAssignOpen(false);
          }}
        />
      )}
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">Name</th>
              <th className="px-4 py-2.5 text-left font-medium">Region system</th>
              <th className="px-4 py-2.5 text-left font-medium">Country</th>
              <th className="px-4 py-2.5 text-left font-medium">Created at</th>
              <th className="px-4 py-2.5 text-left font-medium">Updated at</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-2.5 text-[var(--sidebar-active-fg)] hover:underline cursor-pointer">{r.name}</td>
                <td className="px-4 py-2.5 text-[var(--sidebar-active-fg)] hover:underline cursor-pointer">{r.regionSystem}</td>
                <td className="px-4 py-2.5 text-foreground"><span className="inline-flex items-center gap-2"><span>{flag(r.country)}</span>{r.country}</span></td>
                <td className="px-4 py-2.5 text-muted-foreground">Thu, Jan 29, 2026 5:00</td>
                <td className="px-4 py-2.5 text-muted-foreground">Thu, Jan 29, 2026 5:00</td>
                <td className="px-2 py-2.5 text-right">
                  <button onClick={() => setRows((p) => p.filter((x) => x.id !== r.id))} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive transition-colors" aria-label={`Remove ${r.name}`}><X className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination total={rows.length} />
    </div>
  );
}

function CategoriesPanel() {
  const [rows, setRows] = useState<string[]>(CATEGORIES);
  const [assignOpen, setAssignOpen] = useState(false);
  const available = CATEGORY_PICKER.filter((c) => !rows.includes(c.value)).map((c) => c.value);
  const hintFor = (v: string) => CATEGORY_PICKER.find((c) => c.value === v)?.hint;
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <PanelHeader title="Categories" addLabel="Assign category" onAdd={() => setAssignOpen(true)} />
      {assignOpen && (
        <AssignPicker
          title="Assign category"
          label="Category"
          placeholder="Search category"
          options={available}
          getHint={hintFor}
          confirmLabel="Assign category"
          onClose={() => setAssignOpen(false)}
          onAssign={(c) => { setRows((p) => [...p, c]); setAssignOpen(false); }}
        />
      )}
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground"><th className="px-4 py-2.5 text-left font-medium">Name</th><th className="w-10" /></tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c} className="border-t border-border">
                <td className="px-4 py-2.5 text-[var(--sidebar-active-fg)] hover:underline cursor-pointer">{c}</td>
                <td className="px-2 py-2.5 text-right">
                  <button onClick={() => setRows((p) => p.filter((x) => x !== c))} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive transition-colors" aria-label={`Remove ${c}`}><X className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination total={rows.length} />
    </div>
  );
}

function StoreExtractionPanel() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">Store extraction types</h3>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">Store</th>
              {EXTRACTION_TYPES.map((t) => <th key={t} className="px-3 py-2.5 text-center font-medium text-xs">{t}</th>)}
            </tr>
          </thead>
          <tbody>
            {EXTRACTION_STORES.map((s) => (
              <tr key={s} className="border-t border-border">
                <td className="px-4 py-2 text-foreground whitespace-nowrap">{s}</td>
                {EXTRACTION_TYPES.map((t) => (
                  <td key={t} className="px-3 py-2 text-center">
                    <input type="checkbox" className="h-4 w-4 rounded border-border" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination total={EXTRACTION_STORES.length} />
    </div>
  );
}

type TargetRow = { id: string; name: string; value: string; defaultValue: string; createdAt: string; updatedAt: string };
function TargetsPanel() {
  const [rows, setRows] = useState<TargetRow[]>([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const available = TARGET_OPTIONS.filter((t) => !rows.some((r) => r.name === t));
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <PanelHeader title="Targets" addLabel="Assign target" onAdd={() => setAssignOpen(true)} />
      {assignOpen && (
        <AssignPicker
          title="Add data group target"
          label="Target"
          placeholder="Search target"
          options={available}
          confirmLabel="Add target"
          onClose={() => setAssignOpen(false)}
          onAssign={(t) => {
            const now = formatNow();
            setRows((p) => [...p, { id: crypto.randomUUID(), name: t, value: "—", defaultValue: "—", createdAt: now, updatedAt: now }]);
            setAssignOpen(false);
          }}
        />
      )}
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">Name</th>
              <th className="px-4 py-2.5 text-left font-medium">Value</th>
              <th className="px-4 py-2.5 text-left font-medium">Default value</th>
              <th className="px-4 py-2.5 text-left font-medium">Created at</th>
              <th className="px-4 py-2.5 text-left font-medium">Updated at</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">There are no data</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-2.5 text-foreground">{r.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{r.value}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{r.defaultValue}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{r.createdAt}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{r.updatedAt}</td>
                <td className="px-2 py-2.5 text-right">
                  <button onClick={() => setRows((p) => p.filter((x) => x.id !== r.id))} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive transition-colors" aria-label={`Remove ${r.name}`}><X className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination total={rows.length} />
    </div>
  );
}

function SectionsPanel({ sections, setSections, collapsed, setCollapsed, onAdd }: { sections: Section[]; setSections: React.Dispatch<React.SetStateAction<Section[]>>; collapsed: boolean; setCollapsed: (v: boolean) => void; onAdd: () => void }) {
  const [appFilter, setAppFilter] = useState("All");
  const apps = ["All", ...Array.from(new Set(sections.map((s) => s.maestro)))];
  const filtering = appFilter !== "All";
  const visible = filtering ? sections.filter((s) => s.maestro === appFilter) : sections;

  const move = (id: string, dir: -1 | 1) =>
    setSections((prev) => {
      const i = prev.findIndex((s) => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <button onClick={() => setCollapsed(!collapsed)} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="grid place-items-center h-6 w-6 rounded bg-muted">
            <ChevronDown className={cn("h-4 w-4 transition-transform", collapsed && "-rotate-90")} />
          </span>
          Dashboard sections <span className="text-xs font-normal text-muted-foreground">({sections.length})</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select value={appFilter} onChange={(e) => setAppFilter(e.target.value)} className="bg-transparent text-foreground focus:outline-none" aria-label="Filter by application">
              {apps.map((a) => <option key={a} value={a}>{a === "All" ? "All applications" : a}</option>)}
            </select>
          </span>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
            <Copy className="h-3.5 w-3.5" /> Clone sections
          </button>
          <button onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add sections
          </button>
        </div>
      </div>
      {!collapsed && (
        <div className="px-4 pb-4 space-y-2">
          {filtering && (
            <p className="text-xs text-muted-foreground">
              Showing {visible.length} of {sections.length} — clear the filter to reorder.
            </p>
          )}
          {visible.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-3 py-10 text-center text-sm text-muted-foreground">
              No sections{filtering ? ` for ${appFilter}` : ""} yet. Use “Add sections”.
            </div>
          ) : (
            visible.map((s) => {
              const idx = sections.findIndex((x) => x.id === s.id);
              return (
                <div key={s.id} className="group flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5 hover:border-primary/40 transition-colors">
                  <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">{idx + 1}</span>
                  <div className="flex shrink-0 flex-col">
                    <button disabled={filtering || idx === 0} onClick={() => move(s.id, -1)} className="text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25" aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button disabled={filtering || idx === sections.length - 1} onClick={() => move(s.id, 1)} className="text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25" aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
                  </div>
                  <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                  <div className="min-w-0 flex-1">
                    <code className="block truncate text-sm text-foreground">{s.path}</code>
                    {s.label && <span className="block truncate text-xs text-muted-foreground">{s.label}</span>}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {s.group && <Badge variant="neutral">{s.group}</Badge>}
                    <Badge variant="warning">{s.maestro}</Badge>
                  </div>
                  <button onClick={() => setSections((rows) => rows.filter((r) => r.id !== s.id))} className="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-destructive transition-all" aria-label="Remove section">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function CubesPanel({ cubes, setCubes, onAssign }: { cubes: Cube[]; setCubes: React.Dispatch<React.SetStateAction<Cube[]>>; onAssign: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Cubes</h3>
        <button onClick={onAssign} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
          <Plus className="h-3.5 w-3.5" /> Assign cube
        </button>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">Name</th>
              <th className="px-4 py-2.5 text-left font-medium">Created at</th>
              <th className="px-4 py-2.5 text-left font-medium">Updated at</th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {cubes.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No cubes assigned.</td></tr>
            ) : (
              cubes.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-2.5 text-[var(--sidebar-active-fg)] hover:underline cursor-pointer">{c.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c.createdAt}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c.updatedAt}</td>
                  <td className="px-2 py-2.5 text-right">
                    <button onClick={() => setCubes((rows) => rows.filter((r) => r.id !== c.id))} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive transition-colors" aria-label="Remove cube"><X className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination total={cubes.length} />
    </div>
  );
}

function Badge({ children, variant }: { children: React.ReactNode; variant: "neutral" | "warning" }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", variant === "neutral" && "border-border bg-muted text-foreground", variant === "warning" && "border-amber-300 bg-amber-50 text-amber-700")}>
      {children}
    </span>
  );
}

function Pagination({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-end gap-4 pt-3 text-xs text-muted-foreground">
      <span>Rows per page:</span>
      <select className="rounded border border-border bg-background px-2 py-0.5"><option>100</option></select>
      <span>1–{total} of {total}</span>
      <div className="flex items-center gap-1">
        <button className="rounded p-1 hover:bg-accent disabled:opacity-40" disabled>‹</button>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-foreground">1</span>
        <button className="rounded p-1 hover:bg-accent disabled:opacity-40" disabled>›</button>
      </div>
    </div>
  );
}

function formatNow() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-card shadow-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors -mr-2" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Add sections to the data group: pick a dashboard application (and optionally a
 *  group), then multi-select from that application's real sections. */
function AddSectionModal({
  existingPaths,
  onClose,
  onAdd,
}: {
  existingPaths: Set<string>;
  onClose: () => void;
  onAdd: (items: Omit<Section, "id">[]) => void;
}) {
  const apps = MU_SEED.apps;
  const [appSlug, setAppSlug] = useState(apps[0]?.slug ?? "");
  const app = apps.find((a) => a.slug === appSlug);
  const groups = MU_SEED.groups.filter((g) => g.appSlug === appSlug);
  const [groupId, setGroupId] = useState("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Set<string>>(new Set());

  const catalogue = MU_SEED.sections
    .map((s) => {
      const g = groups.find((gg) => gg.id === s.groupId);
      return g ? { ...s, groupLabel: g.label } : null;
    })
    .filter((s): s is (typeof MU_SEED.sections)[number] & { groupLabel: string } => s !== null);

  const ql = q.trim().toLowerCase();
  const list = catalogue.filter(
    (s) =>
      (groupId === "all" || s.groupId === groupId) &&
      !existingPaths.has(s.path) &&
      (!ql || `${s.label} ${s.path}`.toLowerCase().includes(ql)),
  );

  const toggle = (path: string) =>
    setSel((p) => {
      const n = new Set(p);
      n.has(path) ? n.delete(path) : n.add(path);
      return n;
    });

  const onAppChange = (slug: string) => {
    setAppSlug(slug);
    setGroupId("all");
  };

  const add = () => {
    const items = catalogue
      .filter((s) => sel.has(s.path))
      .map((s) => ({ path: s.path, label: s.label, type: "CUSTOM" as const, maestro: app?.label ?? "", group: s.groupLabel }));
    if (items.length) onAdd(items);
  };

  const Sel = ({ value, onChange, children, label }: { value: string; onChange: (v: string) => void; children: React.ReactNode; label: string }) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        {children}
      </select>
    </div>
  );

  return (
    <Modal title="Add dashboard sections" onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Sel label="Dashboard application" value={appSlug} onChange={onAppChange}>
            {apps.map((a) => <option key={a.slug} value={a.slug}>{a.label}</option>)}
          </Sel>
          <Sel label="Dashboard group" value={groupId} onChange={setGroupId}>
            <option value="all">All groups</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
          </Sel>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sections by name or path" className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="max-h-64 overflow-auto rounded-md border border-border">
          {list.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No available sections{ql ? " match" : ""} for this application/group.
            </div>
          ) : (
            list.map((s) => {
              const checked = sel.has(s.path);
              return (
                <button key={s.id} type="button" onClick={() => toggle(s.path)} className={cn("flex w-full items-center gap-2.5 border-b border-border px-3 py-2 text-left last:border-0 hover:bg-accent", checked && "bg-accent")}>
                  <span className={cn("grid h-4 w-4 shrink-0 place-items-center rounded border", checked ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                    {checked && <Check className="h-3 w-3" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-foreground">{s.label}</span>
                    <code className="block truncate text-xs text-muted-foreground">{s.path}</code>
                  </span>
                  <Badge variant="neutral">{s.groupLabel}</Badge>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">{sel.size} selected</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
            <button onClick={add} disabled={!sel.size} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
              Add {sel.size || ""} section{sel.size === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

const CUBE_OPTIONS = [
  "aux_media_rmm_seed_brand_plp_categories_overlap", "mart_content_assortment_ilo", "mart_range_agg_brand_region",
  "mart_visibility_agg_placements", "mart_coke_global_scorecard", "mart_marketplace", "mart_content_monthly_ilo",
  "mart_media_agg_placements", "mart_content_assortment_nutrients_detail", "mart_visibility_share", "mart_pricing_promos",
  "mart_ratings_reviews", "mart_action_plans",
];

function AssignCubeModal({ existing, onClose, onAssign }: { existing: string[]; onClose: () => void; onAssign: (n: string) => void }) {
  const available = CUBE_OPTIONS.filter((n) => !existing.includes(n));
  return (
    <AssignPicker
      title="Assign cube"
      label="Cube"
      placeholder="Search cube"
      options={available}
      confirmLabel="Assign cube"
      onClose={onClose}
      onAssign={onAssign}
    />
  );
}

// ---------------------------------------------------------------------------
// Retailers tab — per-retailer dashboard-section visibility (Agency dashboards).
// As-is: "Hidden sections" (subtract from the dashboard). New (Inés / Dentsu
// Global): "Shown sections" — an EXCLUSIVE allowlist; when non-empty, only
// those sections render for that retailer (hidden entries still subtract).
// ---------------------------------------------------------------------------

type SectionRef = { path: string; app: string };
type RetailerVisibilityRow = {
  id: string; name: string; createdAt: string; updatedAt: string;
  shown: SectionRef[]; hidden: SectionRef[];
};

const appTag = (label: string) => {
  const words = label.trim().split(/\s+/);
  return (words.length > 1 ? words.map((w) => w[0]).join("") : label).toUpperCase().slice(0, 4);
};

/**
 * Two-step picker mirroring the real console modal:
 * 1. choose a Dashboard application, 2. choose one of its sections (grouped by
 * dashboard group). `exclude` holds paths that are not eligible (already added /
 * already in the data group's Dashboard sections / hidden for this retailer).
 */
function AddRetailerSectionModal({ kind, exclude, onAdd, onClose }: {
  kind: "shown" | "hidden";
  exclude: Set<string>;
  onAdd: (s: SectionRef) => void;
  onClose: () => void;
}) {
  const apps = getDashboardApps();
  const [appId, setAppId] = useState("");
  const [path, setPath] = useState("");
  const app = apps.find((a) => a.id === appId);
  const groups = (app?.groups ?? [])
    .map((g) => ({ label: g.label, sections: (g.sections ?? []).filter((s) => !exclude.has(s.path)) }))
    .filter((g) => g.sections.length > 0);
  const submit = () => {
    if (app && path) onAdd({ path, app: app.label });
    onClose();
  };
  const selectCls = "w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <Modal title={`Add retailer dashboard ${kind} section`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Dashboard applications</label>
          <select value={appId} onChange={(e) => { setAppId(e.target.value); setPath(""); }} className={selectCls}>
            <option value="" />
            {apps.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        </div>
        {app && (
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Retailer dashboard {kind} section <span className="text-destructive">*</span>
            </label>
            <select value={path} onChange={(e) => setPath(e.target.value)} className={selectCls}>
              <option value="" />
              {groups.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.sections.map((s) => <option key={s.path} value={s.path}>{s.path}</option>)}
                </optgroup>
              ))}
            </select>
            {groups.length === 0 && (
              <p className="mt-1 text-xs text-muted-foreground">No eligible sections in this application.</p>
            )}
          </div>
        )}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-md border border-border px-3.5 py-1.5 text-sm font-medium hover:bg-secondary">Cancel</button>
          <button type="button" onClick={submit} disabled={!path} className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50">Add section</button>
        </div>
      </div>
    </Modal>
  );
}

// GroupM Global — Agency set (mirrors the real console; varied configs for testing:
// shown-only, hidden-only, both, multi-entry, and untouched rows).
const GRPM_RETAILER_VISIBILITY: RetailerVisibilityRow[] = [
  { id: "gr1", name: "Leclerc FR", createdAt: "2024-03-13, 15:50:31", updatedAt: "2024-03-13, 15:50:31",
    shown: [{ path: "/keyword-intelligence/leclerc_fr-intelligencev2", app: "CMI" }],
    hidden: [{ path: "/keyword-intelligence/keyword-intelligence", app: "CMI" }] },
  { id: "gr2", name: "Morrisons UK", createdAt: "2024-03-13, 15:50:31", updatedAt: "2024-03-13, 15:50:31",
    shown: [],
    hidden: [{ path: "/keyword-intelligence/keyword-intelligence", app: "CMI" }, { path: "/dse-content/ratings-reviews", app: "Digital Shelf Maestro" }] },
  { id: "gr3", name: "Petsmart US", createdAt: "2024-02-29, 11:52:09", updatedAt: "2024-02-29, 11:52:09",
    shown: [{ path: "/keyword-intelligence/petsmart_us-intelligence", app: "CMI" }, { path: "/dse-range/assortment", app: "Digital Shelf Maestro" }],
    hidden: [] },
  { id: "gr4", name: "Dia ES", createdAt: "2024-03-13, 15:50:31", updatedAt: "2024-03-13, 15:50:31", shown: [], hidden: [] },
  { id: "gr5", name: "Walmart US", createdAt: "2024-03-11, 16:15:42", updatedAt: "2024-03-11, 16:15:42",
    shown: [], hidden: [{ path: "/dse-range/price", app: "Digital Shelf Maestro" }] },
  { id: "gr6", name: "Tokopedia ID", createdAt: "2024-03-13, 15:50:31", updatedAt: "2024-03-13, 15:50:31", shown: [], hidden: [] },
  { id: "gr7", name: "Tesco UK", createdAt: "2024-03-13, 15:50:31", updatedAt: "2024-03-13, 15:50:31",
    shown: [], hidden: [{ path: "/dse-content/image-validation", app: "Digital Shelf Maestro" }] },
  { id: "gr8", name: "Lidl DE", createdAt: "2024-03-13, 15:50:31", updatedAt: "2024-03-13, 15:50:31", shown: [], hidden: [] },
];

const INITIAL_RETAILER_VISIBILITY: RetailerVisibilityRow[] = [
  { id: "rv1", name: "Eroski ES", createdAt: "2025-12-12, 15:36:29", updatedAt: "2025-12-12, 15:36:29", shown: [], hidden: [{ path: "/keyword-intelligence/keyword-intelligence", app: "CMI" }] },
  { id: "rv2", name: "Dia ES", createdAt: "2025-06-16, 14:34:55", updatedAt: "2025-06-16, 14:34:55", shown: [{ path: "/keyword-intelligence/dia_es-intelligencev2", app: "CMI" }], hidden: [{ path: "/keyword-intelligence/keyword-intelligence", app: "CMI" }] },
  { id: "rv3", name: "Alcampo ES", createdAt: "2025-06-16, 14:34:44", updatedAt: "2025-06-16, 14:34:44", shown: [], hidden: [] },
  { id: "rv4", name: "Glovo ES", createdAt: "2026-02-12, 15:23:25", updatedAt: "2026-02-12, 15:23:25", shown: [], hidden: [] },
  { id: "rv5", name: "Amazon ES", createdAt: "2025-06-16, 14:34:25", updatedAt: "2025-06-16, 14:34:25", shown: [], hidden: [] },
  { id: "rv6", name: "El Corte Ingles ES", createdAt: "2026-02-12, 15:22:35", updatedAt: "2026-02-12, 15:22:35", shown: [], hidden: [] },
  { id: "rv7", name: "Carrefour ES", createdAt: "2025-06-16, 14:34:33", updatedAt: "2025-06-16, 14:34:33", shown: [], hidden: [] },
];

function SectionChip({ s, onRemove }: { s: SectionRef; onRemove: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm">
      <span className="truncate font-mono text-xs text-foreground/85">{s.path}</span>
      <span className="rounded-full border border-amber-400/70 px-1.5 py-px text-[10px] font-semibold text-amber-600">{appTag(s.app)}</span>
      <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${s.path}`}>
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

function SectionListEditor({ title, subtitle, kind, list, excludePaths, exclusiveHint, onChange }: {
  title: string; subtitle: string; kind: "shown" | "hidden"; list: SectionRef[];
  excludePaths: string[]; exclusiveHint?: boolean;
  onChange: (v: SectionRef[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  // Never offer what's already in this list + the caller's exclusions.
  const exclude = new Set([...excludePaths, ...list.map((l) => l.path)]);
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-2 flex flex-col items-start gap-1.5">
        {list.map((s) => (
          <SectionChip key={s.path} s={s} onRemove={() => onChange(list.filter((x) => x.path !== s.path))} />
        ))}
        <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <Plus className="h-4 w-4" /> Add {kind} section
        </button>
      </div>
      {exclusiveHint && list.length > 0 && (
        <p className="mt-2 text-xs font-medium text-amber-600">Shown ONLY to this retailer — rendered in addition to the data group's Dashboard sections.</p>
      )}
      {adding && (
        <AddRetailerSectionModal
          kind={kind}
          exclude={exclude}
          onAdd={(s) => onChange([...list, s])}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  );
}

function RetailersPanel({ dashboardType, dataGroupId, dgSectionPaths }: { dashboardType: "Brand" | "Agency"; dataGroupId?: string; dgSectionPaths: string[] }) {
  const isGrpm = (dataGroupId ?? "").startsWith("grpm");
  const [rows, setRows] = useState<RetailerVisibilityRow[]>(
    isGrpm ? GRPM_RETAILER_VISIBILITY : INITIAL_RETAILER_VISIBILITY,
  );
  const [open, setOpen] = useState<string | null>(isGrpm ? "gr1" : "rv2");
  const patch = (id: string, p: Partial<RetailerVisibilityRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)));
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Retailers</h3>
        <button type="button" className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary">
          <Plus className="h-4 w-4" /> Assign retailer
        </button>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              <th className="w-10 px-3 py-2.5" />
              <th className="px-2 py-2.5 text-left font-medium">Retailer</th>
              <th className="w-44 px-3 py-2.5 text-left font-medium">Created at</th>
              <th className="w-44 px-3 py-2.5 text-left font-medium">Updated at</th>
              <th className="w-10 px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <>
                <tr key={r.id} className="border-t border-border">
                  <td className="px-3 py-2.5">
                    <button type="button" onClick={() => setOpen(open === r.id ? null : r.id)}
                      className="grid h-6 w-6 place-items-center rounded border border-border text-muted-foreground hover:bg-secondary"
                      aria-label={open === r.id ? "Collapse" : "Expand"}>
                      {open === r.id ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </button>
                  </td>
                  <td className="px-2 py-2.5 text-foreground">{r.name}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{r.createdAt}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{r.updatedAt}</td>
                  <td className="px-3 py-2.5">
                    <button type="button" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
                      className="text-muted-foreground hover:text-destructive" aria-label={`Unassign ${r.name}`}>
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                {open === r.id && (
                  <tr key={`${r.id}-detail`} className="border-t border-border/60 bg-muted/20">
                    <td colSpan={5} className="px-5 py-4">
                      {dashboardType === "Agency" ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <SectionListEditor
                            title="Shown sections"
                            subtitle="Extra sections shown ONLY for this retailer, on top of the data group's Dashboard sections"
                            kind="shown"
                            list={r.shown}
                            excludePaths={[...dgSectionPaths, ...r.hidden.map((h) => h.path)]}
                            exclusiveHint
                            onChange={(v) => patch(r.id, { shown: v })}
                          />
                          <SectionListEditor
                            title="Hidden sections"
                            subtitle="These sections will not be shown in the dashboard"
                            kind="hidden"
                            list={r.hidden}
                            excludePaths={[]}
                            onChange={(v) => patch(r.id, { hidden: v })}
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Section visibility is configured on <span className="font-medium text-foreground">Agency</span> dashboards only.</p>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination total={rows.length} />
    </div>
  );
}
