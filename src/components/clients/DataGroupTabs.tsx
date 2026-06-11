import { useMemo, useState } from "react";
import { ChevronDown, Copy, GripVertical, LayoutList, Mail, Plus, Trash2, Users, Box, X, Globe, MapPin, LayoutGrid, Store, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { flag } from "@/lib/retailers";

type SectionType = "CUSTOM" | "BUILT_IN";
type Maestro = "Digital Shelf Maestro" | "Amazon Shelf Maestro";
type Section = { id: string; path: string; type: SectionType; maestro: Maestro };
type User = { id: string; email: string; status: "Active" | "Inactive"; createdAt: string; updatedAt: string };
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
// Emails are anonymized for the mockup (no real PII).
const USER_DOMAINS = ["coca-cola.com", "ccep.com", "shalion.com"];
const INITIAL_USERS: User[] = Array.from({ length: 27 }, (_, i) => ({
  id: `u${i + 1}`,
  email: `user${String(i + 1).padStart(2, "0")}@${USER_DOMAINS[i % USER_DOMAINS.length]}`,
  status: "Active",
  createdAt: "Mon, Nov 24, 2025 3:00",
  updatedAt: "Mon, Nov 24, 2025 3:00",
}));

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

type TabKey = "countries" | "client-regions" | "categories" | "store-extraction-types" | "targets" | "sections" | "users" | "cubes";

const ALL_TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "countries", label: "Countries", icon: <Globe className="h-4 w-4" /> },
  { key: "client-regions", label: "Client regions", icon: <MapPin className="h-4 w-4" /> },
  { key: "categories", label: "Categories", icon: <LayoutGrid className="h-4 w-4" /> },
  { key: "store-extraction-types", label: "Store extraction types", icon: <Store className="h-4 w-4" /> },
  { key: "targets", label: "Targets", icon: <Target className="h-4 w-4" /> },
  { key: "sections", label: "Dashboard sections", icon: <LayoutList className="h-4 w-4" /> },
  { key: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
  { key: "cubes", label: "Cubes", icon: <Box className="h-4 w-4" /> },
];
const PARENT_TAB_KEYS: TabKey[] = ["sections", "users", "cubes"];

export function DataGroupTabs({ isParent = false }: { isParent?: boolean }) {
  const visibleTabs = isParent ? ALL_TABS.filter((t) => PARENT_TAB_KEYS.includes(t.key)) : ALL_TABS;
  const [tab, setTab] = useState<TabKey>(isParent ? "sections" : "countries");
  const activeTab = visibleTabs.some((t) => t.key === tab) ? tab : visibleTabs[0].key;

  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [sectionsCollapsed, setSectionsCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [cubes, setCubes] = useState<Cube[]>(INITIAL_CUBES);
  const [countries, setCountries] = useState<CountryRow[]>(INITIAL_COUNTRIES);

  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
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
        {activeTab === "sections" && (
          <SectionsPanel sections={sections} setSections={setSections} collapsed={sectionsCollapsed} setCollapsed={setSectionsCollapsed} onAdd={() => setAddSectionOpen(true)} />
        )}
        {activeTab === "users" && <UsersPanel users={users} setUsers={setUsers} onCreate={() => setCreateUserOpen(true)} />}
        {activeTab === "cubes" && <CubesPanel cubes={cubes} setCubes={setCubes} onAssign={() => setAssignCubeOpen(true)} />}
      </div>

      {addSectionOpen && (
        <AddSectionModal onClose={() => setAddSectionOpen(false)} onAdd={(s) => { setSections((p) => [...p, { ...s, id: crypto.randomUUID() }]); setAddSectionOpen(false); }} />
      )}
      {createUserOpen && (
        <CreateUserModal onClose={() => setCreateUserOpen(false)} onCreate={(email) => { const now = formatNow(); setUsers((p) => [...p, { id: crypto.randomUUID(), email, status: "Active", createdAt: now, updatedAt: now }]); setCreateUserOpen(false); }} />
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
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Countries</h3>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
          <Plus className="h-3.5 w-3.5" /> Assign country
        </button>
      </div>
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

function PanelHeader({ title, addLabel }: { title: string; addLabel: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  );
}

function ClientRegionsPanel() {
  const [rows, setRows] = useState<ClientRegion[]>(CLIENT_REGIONS);
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <PanelHeader title="Client regions" addLabel="Assign client region" />
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
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <PanelHeader title="Categories" addLabel="Assign category" />
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

function TargetsPanel() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <PanelHeader title="Targets" addLabel="Assign target" />
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">Name</th>
              <th className="px-4 py-2.5 text-left font-medium">Value</th>
              <th className="px-4 py-2.5 text-left font-medium">Default value</th>
              <th className="px-4 py-2.5 text-left font-medium">Created at</th>
              <th className="px-4 py-2.5 text-left font-medium">Updated at</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">There are no data</td></tr>
          </tbody>
        </table>
      </div>
      <Pagination total={0} />
    </div>
  );
}

function SectionsPanel({ sections, setSections, collapsed, setCollapsed, onAdd }: { sections: Section[]; setSections: React.Dispatch<React.SetStateAction<Section[]>>; collapsed: boolean; setCollapsed: (v: boolean) => void; onAdd: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => setCollapsed(!collapsed)} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="grid place-items-center h-6 w-6 rounded bg-muted">
            <ChevronDown className={cn("h-4 w-4 transition-transform", collapsed && "-rotate-90")} />
          </span>
          Dashboard sections
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
          <Copy className="h-3.5 w-3.5" /> Clone sections
        </button>
      </div>
      {!collapsed && (
        <div className="px-4 pb-4 space-y-2">
          {sections.map((s) => (
            <div key={s.id} className="group flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 hover:border-primary/40 transition-colors">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <code className="text-sm text-foreground flex-shrink-0">{s.path}</code>
              <Badge variant="neutral">{s.type}</Badge>
              <Badge variant="warning">{s.maestro}</Badge>
              <button onClick={() => setSections((rows) => rows.filter((r) => r.id !== s.id))} className="ml-auto rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-destructive transition-all" aria-label="Remove section">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button onClick={onAdd} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline pt-2">
            <Plus className="h-4 w-4" /> Add section
          </button>
        </div>
      )}
    </div>
  );
}

function UsersPanel({ users, setUsers, onCreate }: { users: User[]; setUsers: React.Dispatch<React.SetStateAction<User[]>>; onCreate: () => void }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => users.filter((u) => u.email.toLowerCase().includes(search.toLowerCase())), [users, search]);
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-foreground">Users</h3>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users" className="w-64 rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
            <Users className="h-3.5 w-3.5" /> Assign user
          </button>
          <button onClick={onCreate} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
            <Plus className="h-3.5 w-3.5" /> Create users
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">Email</th>
              <th className="px-4 py-2.5 text-left font-medium">Status</th>
              <th className="px-4 py-2.5 text-left font-medium">Created at</th>
              <th className="px-4 py-2.5 text-left font-medium">Updated at</th>
              <th className="w-20" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No users found.</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-2.5 text-foreground">{u.email}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{u.createdAt}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{u.updatedAt}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" aria-label="Email user"><Mail className="h-4 w-4" /></button>
                      <button onClick={() => setUsers((rows) => rows.filter((r) => r.id !== u.id))} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive transition-colors" aria-label="Delete user"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination total={filtered.length} />
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

function AddSectionModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Omit<Section, "id">) => void }) {
  const [path, setPath] = useState("");
  const [type, setType] = useState<SectionType>("CUSTOM");
  const [maestro, setMaestro] = useState<Maestro>("Digital Shelf Maestro");
  return (
    <Modal title="Add section" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Section path</label>
          <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/example/section" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as SectionType)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="CUSTOM">CUSTOM</option>
              <option value="BUILT_IN">BUILT_IN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Maestro</label>
            <select value={maestro} onChange={(e) => setMaestro(e.target.value as Maestro)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option>Digital Shelf Maestro</option>
              <option>Amazon Shelf Maestro</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
          <button onClick={() => path && onAdd({ path, type, maestro })} disabled={!path} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">Add section</button>
        </div>
      </div>
    </Modal>
  );
}

function CreateUserModal({ onClose, onCreate }: { onClose: () => void; onCreate: (email: string) => void }) {
  const [email, setEmail] = useState("");
  return (
    <Modal title="Create user" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.com" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
          <button onClick={() => email && onCreate(email)} disabled={!email} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">Create user</button>
        </div>
      </div>
    </Modal>
  );
}

const CUBE_OPTIONS = ["mart_content_assortment_ilo", "mart_visibility_share", "mart_pricing_promos", "mart_ratings_reviews", "mart_action_plans"];

function AssignCubeModal({ existing, onClose, onAssign }: { existing: string[]; onClose: () => void; onAssign: (n: string) => void }) {
  const available = CUBE_OPTIONS.filter((n) => !existing.includes(n));
  const [name, setName] = useState(available[0] ?? "");
  return (
    <Modal title="Assign cube" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Cube</label>
          <select value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
            {available.length === 0 && <option value="">No cubes available</option>}
            {available.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
          <button onClick={() => name && onAssign(name)} disabled={!name} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">Assign cube</button>
        </div>
      </div>
    </Modal>
  );
}
