import { useMemo, useState } from "react";
import { ChevronUp, Plus, HelpCircle, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { getBusinessUnitNames, getClientCategoryNames } from "@/lib/productEntities";
import { toast } from "sonner";
import type { ClientSku } from "@/lib/clientSkus";
import {
  regionCatalogFor,
  storesForCountry,
  msrpRound2,
  fmtMsrp,
  STORE_FACTORS,
  REGION_STORE_FACTORS,
  getSkuRegions,
} from "@/lib/clientSkus";

type Scope = "global" | "region" | "store" | "regionStore";

type Row = {
  id: string;
  store?: string;
  regionSystem?: string;
  region?: string;
  currency: string;
  msrp: number;
  businessUnit?: string;
  clientCategory?: string;
  hero: boolean;
  activeFrom?: string;
  activeTo?: string;
  createdAt: string;
  updatedAt: string;
};

const DEFAULT_SKU: Partial<ClientSku> = {
  id: "demo",
  msrp: { value: 28, currency: "MXN" },
  country: "MX",
  hero: false,
};

/** Build the four-level MSRP dataset for a SKU: Global = real msrp, the rest simulated.
 *  Region rows reuse simulateSkuRegions() so the MSRP › Region tab and the
 *  "Client sku regions" grid always show the same values. */
function buildData(sku: Partial<ClientSku>): Record<Scope, Row[]> {
  const base = sku.msrp?.value ?? 0;
  const country = sku.country ?? "XX";
  const hero = !!sku.hero;
  const common = {
    currency: sku.msrp?.currency ?? "USD",
    businessUnit: sku.businessUnit,
    clientCategory: sku.clientCategory,
    activeFrom: sku.activeFrom,
    activeTo: sku.activeTo,
    createdAt: sku.createdAt ?? "2025-05-21, 08:52:32",
    updatedAt: sku.updatedAt ?? "2026-06-29, 19:25:30",
  };
  const { system, regions } = regionCatalogFor(country);
  const stores = storesForCountry(country);

  return {
    // The real, migrated global value — a single authoritative row.
    global: [{ id: "g-0", msrp: msrpRound2(base), hero, ...common }],
    region: getSkuRegions(sku),
    store: stores.map((store, i) => ({
      id: `s-${i}`,
      store,
      msrp: msrpRound2(base * (STORE_FACTORS[i % STORE_FACTORS.length] ?? 1)),
      hero,
      ...common,
    })),
    regionStore: stores.slice(0, regions.length).map((store, i) => ({
      id: `rs-${i}`,
      store,
      regionSystem: system,
      region: regions[i],
      msrp: msrpRound2(base * (REGION_STORE_FACTORS[i % REGION_STORE_FACTORS.length] ?? 1)),
      hero,
      ...common,
    })),
  };
}

const tabs: { key: Scope; label: string; assignLabel: string }[] = [
  { key: "global", label: "Global", assignLabel: "Assign msrp" },
  { key: "region", label: "Region", assignLabel: "Assign msrp region" },
  { key: "store", label: "Store", assignLabel: "Assign msrp store" },
  { key: "regionStore", label: "Region & Store", assignLabel: "Assign store & region" },
];

/** Embeddable MSRP module — tabs (Global / Region / Store / Region & Store) + assign dialog.
 *  Global shows the SKU's real migrated MSRP; the other tiers are a per-SKU simulation. */
export function ClientSkuMsrp({ sku }: { sku?: Partial<ClientSku> } = {}) {
  const effSku = sku?.msrp ? sku : DEFAULT_SKU;
  const [active, setActive] = useState<Scope>("global");
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState(() => buildData(effSku));
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [dlgSeq, setDlgSeq] = useState(0);

  const currentTab = tabs.find((t) => t.key === active)!;
  const rows = data[active];
  const catalog = regionCatalogFor(effSku.country ?? "XX");
  const stores = storesForCountry(effSku.country ?? "XX");
  const skuCurrency = effSku.msrp?.currency ?? "USD";

  const openAssign = () => { setEditRow(null); setDlgSeq((s) => s + 1); setOpen(true); };
  const openEdit = (row: Row) => { setEditRow(row); setDlgSeq((s) => s + 1); setOpen(true); };

  const handleSubmit = (row: Row) => {
    setData((prev) => ({
      ...prev,
      [active]: editRow
        ? prev[active].map((r) => (r.id === row.id ? row : r))
        : [row, ...prev[active]],
    }));
    setOpen(false);
    toast.success(editRow ? "MSRP updated" : `${currentTab.assignLabel} created`);
  };
  const handleDelete = (id: string) => {
    setData((prev) => ({ ...prev, [active]: prev[active].filter((r) => r.id !== id) }));
    toast.success("MSRP unassigned");
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center gap-3 text-lg font-semibold text-foreground"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
              <ChevronUp className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </span>
            MSRP
          </button>
          <Button variant="outline" onClick={openAssign} className="rounded-full gap-1.5">
            <Plus className="h-4 w-4" />
            {currentTab.assignLabel}
          </Button>
        </div>

        {!collapsed && (
          <>
            {/* Tabs */}
            <div className="flex gap-8 border-b border-border px-6">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`relative py-3 text-base transition-colors ${
                    active === t.key ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                  {active === t.key && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    {(active === "region" || active === "regionStore") && <Th>Region system</Th>}
                    {(active === "region" || active === "regionStore") && <Th>Region</Th>}
                    {(active === "store" || active === "regionStore") && <Th>Store</Th>}
                    <Th>Currency</Th>
                    <Th>Msrp</Th>
                    <Th>Business unit</Th>
                    <Th>Client category</Th>
                    <Th>Hero</Th>
                    <Th>Active from</Th>
                    <Th>Active to</Th>
                    <Th>Created at</Th>
                    <Th>Updated at</Th>
                    <Th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={13} className="px-4 py-8 text-center text-muted-foreground">
                        No MSRP defined at this level.
                      </td>
                    </tr>
                  )}
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                      {(active === "region" || active === "regionStore") && <Td className="text-[var(--sidebar-active-fg)]">{row.regionSystem}</Td>}
                      {(active === "region" || active === "regionStore") && (
                        <Td className="text-[var(--sidebar-active-fg)]">{row.region}</Td>
                      )}
                      {(active === "store" || active === "regionStore") && (
                        <Td className="text-[var(--sidebar-active-fg)]">{row.store}</Td>
                      )}
                      <Td>{row.currency}</Td>
                      <Td className="font-medium">{fmtMsrp(row.msrp)}</Td>
                      <Td>{row.businessUnit || ""}</Td>
                      <Td>{row.clientCategory || ""}</Td>
                      <Td>
                        {row.hero ? (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                            ✓ Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-red-300 bg-red-50 px-2 py-0.5 text-xs text-red-600">
                            ✕ No
                          </span>
                        )}
                      </Td>
                      <Td className="text-muted-foreground">{row.activeFrom || "-"}</Td>
                      <Td className="text-muted-foreground">{row.activeTo || "-"}</Td>
                      <Td className="text-muted-foreground">{row.createdAt}</Td>
                      <Td className="text-muted-foreground">{row.updatedAt}</Td>
                      <Td>
                        <RowActionsMenu
                          id={row.id}
                          onEdit={() => openEdit(row)}
                          onDelete={() => handleDelete(row.id)}
                          entityLabel="MSRP entry"
                          deleteLabel="Unassign"
                        />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-6 px-6 py-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                Rows per page:
                <Select defaultValue="100">
                  <SelectTrigger className="h-7 w-[70px] border-none shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span>1–{rows.length} of {rows.length}</span>
              <div className="flex items-center gap-1">
                <button className="rounded p-1 hover:bg-secondary disabled:opacity-30" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">1</span>
                <button className="rounded p-1 hover:bg-secondary disabled:opacity-30" disabled>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AssignDialog
        key={dlgSeq}
        open={open}
        onOpenChange={setOpen}
        scope={active}
        scopeLabel={currentTab.label}
        assignLabel={currentTab.assignLabel}
        initial={editRow}
        onSubmit={handleSubmit}
        skuCurrency={skuCurrency}
        regionSystem={catalog.system}
        regions={catalog.regions}
        stores={stores}
      />
    </>
  );
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={`whitespace-nowrap px-4 py-3 text-xs font-normal ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-4 py-3 ${className}`}>{children}</td>;
}

function AssignDialog({
  open, onOpenChange, scope, scopeLabel, assignLabel, initial, onSubmit, skuCurrency, regionSystem, regions, stores,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  scope: Scope;
  scopeLabel: string;
  assignLabel: string;
  initial: Row | null;
  onSubmit: (row: Row) => void;
  skuCurrency: string;
  regionSystem: string;
  regions: string[];
  stores: string[];
}) {
  const isEdit = !!initial;
  const title = isEdit ? `Edit ${scopeLabel} MSRP` : assignLabel;
  const [msrp, setMsrp] = useState(initial ? String(initial.msrp) : "");
  const [currency, setCurrency] = useState(initial?.currency ?? skuCurrency);
  const [businessUnit, setBusinessUnit] = useState(initial?.businessUnit ?? "");
  const [clientCategory, setClientCategory] = useState(initial?.clientCategory ?? "");
  const [activeFrom, setActiveFrom] = useState(initial?.activeFrom ?? "");
  const [activeTo, setActiveTo] = useState(initial?.activeTo ?? "");
  const [hero, setHero] = useState(initial?.hero ?? false);
  const [store, setStore] = useState(initial?.store ?? "");
  const [region, setRegion] = useState(initial?.region ?? "");

  const currencyOptions = [...new Set([skuCurrency, "USD", "EUR", "MXN", "GBP"])];
  const buOptions = useMemo(() => getBusinessUnitNames(), []);
  const catOptions = useMemo(() => getClientCategoryNames(), []);

  const requiresStore = scope === "store" || scope === "regionStore";
  const requiresRegion = scope === "region" || scope === "regionStore";

  const canSubmit =
    msrp.trim() !== "" &&
    (!requiresStore || store !== "") &&
    (!requiresRegion || region !== "");

  const reset = () => {
    setMsrp(""); setCurrency(skuCurrency); setBusinessUnit(""); setClientCategory("");
    setActiveFrom(""); setActiveTo(""); setHero(false);
    setStore(""); setRegion("");
  };

  const submit = () => {
    const now = new Date().toISOString().replace("T", ", ").slice(0, 19);
    onSubmit({
      id: initial?.id ?? `${scope}-${Date.now()}`,
      currency,
      msrp: Number(msrp),
      businessUnit: businessUnit || undefined,
      clientCategory: clientCategory || undefined,
      hero,
      activeFrom: activeFrom || undefined,
      activeTo: activeTo || undefined,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
      store: requiresStore ? store : undefined,
      region: requiresRegion ? region : undefined,
      regionSystem: requiresRegion ? regionSystem : undefined,
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {requiresRegion && (
            <>
              <Field label="Region system" required>
                <Input value={regionSystem} readOnly className="bg-secondary/40" />
              </Field>
              <Field label="Region" required>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger><SelectValue placeholder=" " /></SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </>
          )}
          {requiresStore && (
            <Field label="Store" required>
              <Select value={store} onValueChange={setStore}>
                <SelectTrigger><SelectValue placeholder=" " /></SelectTrigger>
                <SelectContent>
                  {stores.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          )}

          <Field label={<span className="flex items-center gap-1">Msrp <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" /></span>}>
            <div className="flex gap-2">
              <Input value={msrp} onChange={(e) => setMsrp(e.target.value)} placeholder="0.00" type="number" className="flex-1" />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </Field>

          <Field label="Business unit">
            <SearchableSelect
              value={businessUnit}
              onChange={setBusinessUnit}
              options={buOptions}
              placeholder="Select a business unit"
              searchPlaceholder="Search business units…"
              emptyText="No business unit found."
            />
          </Field>

          <Field label="Client category">
            <SearchableSelect
              value={clientCategory}
              onChange={setClientCategory}
              options={catOptions}
              placeholder="Select a client category"
              searchPlaceholder="Search client categories…"
              emptyText="No client category found."
            />
          </Field>

          <Field label="Active from">
            <div className="relative">
              <Input type="date" value={activeFrom} onChange={(e) => setActiveFrom(e.target.value)} />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </Field>

          <Field label="Active to">
            <div className="relative">
              <Input type="date" value={activeTo} onChange={(e) => setActiveTo(e.target.value)} />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </Field>

          <div className="flex items-center gap-2">
            <Checkbox id="hero" checked={hero} onCheckedChange={(v) => setHero(Boolean(v))} />
            <Label htmlFor="hero" className="cursor-pointer">Hero</Label>
          </div>
        </div>
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!canSubmit} onClick={submit}>{isEdit ? "Save" : assignLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, required, children }: { label: React.ReactNode; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
