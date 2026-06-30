import { useState } from "react";
import { ArrowLeft, MoreHorizontal, Calendar as CalendarIcon, X, Plus, ChevronDown, HelpCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { ClientSkuMsrp } from "@/components/product/ClientSkuMsrp";
import { ClientSkuRegions } from "@/components/product/ClientSkuRegions";
import { COUNTRY_NAMES } from "@/lib/retailers";
import { getClientNames } from "@/lib/clients";
import type { ClientSku } from "@/lib/clientSkus";

const uniq = (arr: (string | undefined)[]) => [...new Set(arr.filter((v): v is string => !!v))];
const countryName = (code?: string) => (code && COUNTRY_NAMES[code]) || code || "";

export function ClientSkuEditPage({
  sku,
  isNew,
  onBack,
}: {
  sku?: Partial<ClientSku>;
  isNew?: boolean;
  onBack?: () => void;
} = {}) {
  const fallbackCodes = isNew ? [] : [{ type: "ean", value: "7501055305346" }];
  const [title, setTitle] = useState(sku?.title ?? (isNew ? "" : "REFRESCO COCA-COLA LIGHT 1L"));
  const [country, setCountry] = useState(countryName(sku?.country) || "Mexico");
  const [skuId] = useState(sku?.id ?? "71ad4a1c-9a86-3b60-a772-435d9f48e468");
  const [codes, setCodes] = useState<{ type: string; value: string }[]>(
    sku?.codes?.length ? sku.codes : fallbackCodes,
  );
  const [skuCode, setSkuCode] = useState(codes[0]?.value ?? "");
  const [brand, setBrand] = useState(sku?.brand || (isNew ? "" : "Coca-Cola Light"));
  const [client, setClient] = useState(sku?.client || (isNew ? "" : "Coca Cola"));
  const [category, setCategory] = useState(
    sku?.category || (isNew ? "" : "Beverages > Soft Drinks > Soda"),
  );
  const [activeFrom, setActiveFrom] = useState("");
  const [activeTo, setActiveTo] = useState("");
  const [units, setUnits] = useState(sku?.units != null ? String(sku.units) : "1");
  const [hasVolume, setHasVolume] = useState(sku ? !!sku.volume : true);
  const [volumeValue, setVolumeValue] = useState(sku?.volume ? String(sku.volume.value) : "1000");
  const [volumeUnits, setVolumeUnits] = useState(sku?.volume?.units ?? "ml");

  const countryOptions = uniq([country, ...Object.values(COUNTRY_NAMES)]);
  const brandOptions = uniq([brand, "Coca-Cola Light", "Coca-Cola", "Fanta"]);
  const clientOptions = uniq([client, ...getClientNames()]);
  const categoryOptions = uniq([
    category,
    "Beverages > Soft Drinks > Soda",
    "Beverages > Water",
  ]);

  return (
    <AppShell>
      <Toaster position="top-right" richColors />
      <div className="h-full overflow-auto">
        <div className="mx-auto max-w-3xl px-6 py-6">
          {/* Breadcrumb / title */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <button
                onClick={onBack}
                className="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Client skus
              </button>
              <h1 className="text-base font-semibold tracking-tight">
                {isNew ? "Add client sku" : title || "Client sku"}
              </h1>
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Main details card */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="space-y-4">
              <FieldGroup label="Title" required>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </FieldGroup>

              <FieldGroup label="Country" required>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Sku id">
                  <Input value={skuId} readOnly className="font-mono text-xs" />
                </FieldGroup>
                <FieldGroup label="Sku code" required>
                  <Input value={skuCode} onChange={(e) => setSkuCode(e.target.value)} />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Brand" required>
                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger><SelectValue placeholder="Select a brand" /></SelectTrigger>
                    <SelectContent>
                      {brandOptions.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>
                <FieldGroup label="Client" required>
                  <Select value={client} onValueChange={setClient}>
                    <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
                    <SelectContent>
                      {clientOptions.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>
              </div>

              <FieldGroup label="Category">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>

              {/* Codes */}
              <fieldset className="rounded-lg border border-border p-4">
                <legend className="px-1 text-xs font-medium text-muted-foreground">Codes</legend>
                <div className="space-y-2">
                  {codes.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={c.type}
                        onChange={(e) => setCodes((prev) => prev.map((x, j) => (j === i ? { ...x, type: e.target.value } : x)))}
                        className="w-32"
                      />
                      <Input
                        value={c.value}
                        onChange={(e) => setCodes((prev) => prev.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                        className="flex-1"
                      />
                      <button
                        onClick={() => setCodes((prev) => prev.filter((_, j) => j !== i))}
                        className="rounded p-1.5 text-muted-foreground hover:bg-secondary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setCodes((prev) => [...prev, { type: "", value: "" }])}
                    className="flex items-center gap-1.5 text-sm text-[var(--sidebar-active-fg)] hover:underline"
                  >
                    <Plus className="h-4 w-4" /> Add code
                  </button>
                </div>
              </fieldset>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Active from">
                  <DateInput value={activeFrom} onChange={setActiveFrom} />
                </FieldGroup>
                <FieldGroup label="Active to">
                  <DateInput value={activeTo} onChange={setActiveTo} />
                </FieldGroup>
              </div>

              <FieldGroup
                label={<span className="flex items-center gap-1">Units <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" /></span>}
                required
              >
                <Input value={units} onChange={(e) => setUnits(e.target.value)} type="number" />
              </FieldGroup>

              <fieldset className="rounded-lg border border-border p-4">
                <legend className="px-1">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                    <Checkbox checked={hasVolume} onCheckedChange={(v) => setHasVolume(Boolean(v))} />
                    Volume
                  </label>
                </legend>
                {hasVolume && (
                  <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="Value" required>
                      <Input value={volumeValue} onChange={(e) => setVolumeValue(e.target.value)} type="number" />
                    </FieldGroup>
                    <FieldGroup label="Units" required>
                      <Input value={volumeUnits} onChange={(e) => setVolumeUnits(e.target.value)} />
                    </FieldGroup>
                  </div>
                )}
              </fieldset>
            </div>
          </section>

          {/* Collapsible sections */}
          <CollapsibleSection title="Attribute options" />
          <ClientSkuRegions key={sku?.id} sku={sku} />

          {/* MSRP */}
          <div className="mt-3">
            <ClientSkuMsrp key={sku?.id} sku={sku} />
          </div>

          <CollapsibleSection title="Image references" />
          <CollapsibleSection title="Text references" />
          <CollapsibleSection title="Direct competitors" />

          <div className="h-12" />
        </div>
      </div>
    </AppShell>
  );
}

function FieldGroup({ label, required, children }: { label: React.ReactNode; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} />
      <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function CollapsibleSection({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 rounded-xl border border-border bg-card shadow-sm">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 px-5 py-4 text-left text-base font-medium">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
        {title}
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground">Section content (prototype).</div>}
    </div>
  );
}
