import { useState } from "react";
import { ChevronUp, Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { toast } from "sonner";
import type { ClientSku, SkuRegionRow } from "@/lib/clientSkus";
import { regionCatalogFor, getSkuRegions } from "@/lib/clientSkus";

const DEFAULT_SKU: Partial<ClientSku> = { id: "demo", msrp: { value: 28, currency: "MXN" }, country: "MX", hero: false };

/** Per-SKU "Client sku regions" grid — the regional override entity. MSRP (currency +
 *  value) has migrated to the MSRP › Region level, and business unit / client category /
 *  hero were dropped from this view, so the grid now carries just the region + active
 *  window. Rows are the real imported client_sku_region data (shared with the MSRP ›
 *  Region tab, which still shows the full payload). */
export function ClientSkuRegions({ sku }: { sku?: Partial<ClientSku> } = {}) {
  const effSku = sku?.msrp ? sku : DEFAULT_SKU;
  const [collapsed, setCollapsed] = useState(false);
  const [rows, setRows] = useState<SkuRegionRow[]>(() => getSkuRegions(effSku));
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState<SkuRegionRow | null>(null);
  const [dlgSeq, setDlgSeq] = useState(0);

  const catalog = regionCatalogFor(effSku.country ?? "XX");
  const skuCurrency = effSku.msrp?.currency ?? "USD";

  const openAssign = () => { setEditRow(null); setDlgSeq((s) => s + 1); setOpen(true); };
  const openEdit = (row: SkuRegionRow) => { setEditRow(row); setDlgSeq((s) => s + 1); setOpen(true); };

  const handleSubmit = (row: SkuRegionRow) => {
    setRows((prev) => (editRow ? prev.map((r) => (r.id === row.id ? row : r)) : [row, ...prev]));
    setOpen(false);
    toast.success(editRow ? "Region updated" : "Region assigned");
  };
  const handleDelete = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Region unassigned");
  };

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-3 text-lg font-semibold text-foreground"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
            <ChevronUp className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </span>
          Client sku regions
        </button>
        <Button variant="outline" onClick={openAssign} className="rounded-full gap-1.5">
          <Plus className="h-4 w-4" />
          Assign region
        </Button>
      </div>

      {!collapsed && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <Th>Region system</Th>
                  <Th>Region</Th>
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
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No regions assigned to this SKU.
                    </td>
                  </tr>
                )}
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <Td className="text-[var(--sidebar-active-fg)]">{row.regionSystem}</Td>
                    <Td className="text-[var(--sidebar-active-fg)]">{row.region}</Td>
                    <Td className="text-muted-foreground">{row.activeFrom || "-"}</Td>
                    <Td className="text-muted-foreground">{row.activeTo || "-"}</Td>
                    <Td className="text-muted-foreground">{row.createdAt}</Td>
                    <Td className="text-muted-foreground">{row.updatedAt}</Td>
                    <Td>
                      <RowActionsMenu
                        id={row.id}
                        onEdit={() => openEdit(row)}
                        onDelete={() => handleDelete(row.id)}
                        entityLabel="region"
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

      <RegionDialog
        key={dlgSeq}
        open={open}
        onOpenChange={setOpen}
        initial={editRow}
        onSubmit={handleSubmit}
        regionSystem={catalog.system}
        regions={catalog.regions}
        skuCurrency={skuCurrency}
      />
    </div>
  );
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={`whitespace-nowrap px-4 py-3 text-xs font-normal ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-4 py-3 ${className}`}>{children}</td>;
}

function RegionDialog({
  open, onOpenChange, initial, onSubmit, regionSystem, regions, skuCurrency,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: SkuRegionRow | null;
  onSubmit: (row: SkuRegionRow) => void;
  regionSystem: string;
  regions: string[];
  skuCurrency: string;
}) {
  const isEdit = !!initial;
  const [region, setRegion] = useState(initial?.region ?? "");
  const [activeFrom, setActiveFrom] = useState(initial?.activeFrom ?? "");
  const [activeTo, setActiveTo] = useState(initial?.activeTo ?? "");
  const canSubmit = region !== "";

  const submit = () => {
    const now = new Date().toISOString().replace("T", ", ").slice(0, 19);
    onSubmit({
      id: initial?.id ?? `r-${Date.now()}`,
      regionSystem,
      region,
      // MSRP has migrated to the MSRP > Region level; client_sku_region keeps no price.
      currency: initial?.currency ?? skuCurrency,
      msrp: initial?.msrp ?? 0,
      // Business unit / client category / hero were removed from this view; keep any
      // existing value from the row rather than clearing the real imported data.
      businessUnit: initial?.businessUnit,
      clientCategory: initial?.clientCategory,
      hero: initial?.hero ?? false,
      activeFrom: activeFrom || undefined,
      activeTo: activeTo || undefined,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{isEdit ? "Edit region" : "Assign region"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>
        </div>
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!canSubmit} onClick={submit}>{isEdit ? "Save" : "Assign region"}</Button>
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
