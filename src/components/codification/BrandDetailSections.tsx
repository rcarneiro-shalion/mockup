import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Th, Td } from "@/components/seeds/ListPrimitives";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Plus,
  Trash2,
  X,
  Regex,
  Star,
  CopyPlus,
  CopyMinus,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import {
  uid,
  type RegexEntry,
  type CategorySel,
  type ManufacturerRow,
} from "@/lib/brandSampleSections";
import { MANUFACTURERS, type BrandEdition } from "@/lib/brands";
import { TryRegexModal } from "@/components/codification/TryRegexModal";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getCategories } from "@/lib/settings";
import { COUNTRY_OPTIONS, COUNTRY_NAMES } from "@/lib/retailers";

// ---------------------------------------------------------------------------
// Richer Brand-detail sections, mirroring the real console-frontend brand
// editor: Brand classification (regex tag-cloud), Category selection,
// Edition selection, Manufacturer selection. Data is illustrative prototype
// state (see brandSampleSections), so it isn't persisted on the Brand.
// ---------------------------------------------------------------------------

const CHIP_INCLUSIVE = "border-border bg-secondary text-foreground/75";
const CHIP_EXCLUSIVE =
  "border-amber-300/70 bg-amber-100 text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300";

/** A wrapping cloud of regex chips + a trailing "Add regex" popover. */
function RegexChips({
  value,
  onChange,
}: {
  value: RegexEntry[];
  onChange: (v: RegexEntry[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [expr, setExpr] = useState("");
  const [isNeg, setIsNeg] = useState(false);

  const add = () => {
    if (!expr.trim()) return;
    onChange([...value, { id: uid(), expr: expr.trim(), isNegative: isNeg }]);
    setExpr("");
    setIsNeg(false);
    setOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1">
      {value.map((r) => (
        <span
          key={r.id}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs",
            r.isNegative ? CHIP_EXCLUSIVE : CHIP_INCLUSIVE,
          )}
        >
          <span className="max-w-[22rem] truncate">{r.expr}</span>
          <button
            type="button"
            onClick={() => onChange(value.filter((x) => x.id !== r.id))}
            className="opacity-50 hover:opacity-100"
            aria-label="Remove regex"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Plus className="h-3 w-3" /> Add regex
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[32rem]">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-foreground">New regex</div>
            <div className="flex items-center gap-2">
              <Input
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                placeholder="Regex"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && add()}
                className="h-9 flex-1 font-mono text-xs"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-9 w-32 shrink-0 items-center justify-between rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {isNeg ? "Exclusive" : "Inclusive"}
                    <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuItem className="items-start gap-2" onSelect={() => setIsNeg(false)}>
                    <CopyPlus className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <span className="block text-sm font-medium">Inclusive</span>
                      <span className="block text-xs text-muted-foreground">
                        Regex matches will be included
                      </span>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="items-start gap-2" onSelect={() => setIsNeg(true)}>
                    <CopyMinus className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <span className="block text-sm font-medium">Exclusive</span>
                      <span className="block text-xs text-muted-foreground">
                        Regex matches will be excluded
                      </span>
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <Button size="sm" onClick={add} disabled={!expr.trim()}>
                Add regex
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** Collapsible section card matching the console's brand-editor sections. */
function SectionCard({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="mt-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Toggle section"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", !open && "-rotate-90")} />
          </button>
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {open && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {open && actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function AssignButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={onClick}>
      <Plus className="h-4 w-4" /> {label}
    </Button>
  );
}

function TrashButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
      aria-label={label}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}

function DefaultBadge() {
  return (
    <span className="rounded-full bg-[var(--sidebar-active-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--sidebar-active-fg)]">
      Default
    </span>
  );
}

/** Small modal for the "Assign …" flows. */
function AssignDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  canSubmit,
  onSubmit,
  children,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  submitLabel: string;
  canSubmit: boolean;
  onSubmit: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!canSubmit}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-foreground/80">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

const emptyRow = (cols: number, text: string) => (
  <tr>
    <Td className="text-muted-foreground">
      <span className="block py-2">{text}</span>
    </Td>
    {Array.from({ length: cols - 1 }).map((_, i) => (
      <Td key={i} />
    ))}
  </tr>
);

// --- Brand classification -------------------------------------------------

export function BrandClassificationSection({ initial }: { initial: RegexEntry[] }) {
  const [regexps, setRegexps] = useState(initial);
  const [tryOpen, setTryOpen] = useState(false);
  return (
    <SectionCard
      title="Brand classification"
      subtitle="Configure regex patterns to categorize results under this brand."
      actions={
        <>
          {regexps.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-destructive hover:text-destructive"
              onClick={() => setRegexps([])}
            >
              <Trash2 className="h-4 w-4" /> Delete all
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setTryOpen(true)}>
            <Regex className="h-4 w-4" /> Try regex
          </Button>
        </>
      }
    >
      <RegexChips value={regexps} onChange={setRegexps} />
      <TryRegexModal open={tryOpen} onOpenChange={setTryOpen} />
    </SectionCard>
  );
}

// --- Category selection ---------------------------------------------------

export function CategorySelectionSection({
  value,
  onChange,
}: {
  value: CategorySel[];
  onChange: (v: CategorySel[]) => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <SectionCard
      title="Category selection"
      subtitle="Specific categories that can have this brand. Regex will only apply to results of this brand."
      actions={<AssignButton label="Assign category" onClick={() => setAddOpen(true)} />}
    >
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr>
              <Th className="w-64">Category</Th>
              <Th>Regexp</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {value.length === 0
              ? emptyRow(3, "No categories assigned.")
              : value.map((c) => (
                  <tr key={c.id} className="border-t border-border align-top">
                    <Td className="text-[var(--sidebar-active-fg)]">{c.name}</Td>
                    <Td>
                      <RegexChips
                        value={c.regexps}
                        onChange={(v) =>
                          onChange(value.map((x) => (x.id === c.id ? { ...x, regexps: v } : x)))
                        }
                      />
                    </Td>
                    <Td>
                      <TrashButton
                        label={`Remove ${c.name}`}
                        onClick={() => onChange(value.filter((x) => x.id !== c.id))}
                      />
                    </Td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <AssignDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Assign category"
        submitLabel="Assign category"
        canSubmit={!!name.trim()}
        onSubmit={() => {
          onChange([...value, { id: uid(), name: name.trim(), regexps: [] }]);
          setName("");
          setAddOpen(false);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-foreground/80">
            Category <span className="text-destructive">*</span>
          </Label>
          <Command className="rounded-md border border-border">
            <CommandInput placeholder="Search by category, description, sector…" />
            <CommandList className="max-h-56">
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {getCategories().map((c) => (
                  <CommandItem
                    key={c.id}
                    value={`${c.name} ${c.description} ${c.sector} ${c.id}`}
                    onSelect={() => setName(c.name)}
                    className="flex items-start gap-2"
                  >
                    <Check
                      className={cn("mt-0.5 h-4 w-4 shrink-0", name === c.name ? "opacity-100" : "opacity-0")}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{c.name}</span>
                      {c.description && (
                        <span className="block truncate text-xs text-muted-foreground">{c.description}</span>
                      )}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </AssignDialog>
    </SectionCard>
  );
}

// --- Edition selection (multi-brand only; wired to the form) --------------

export function EditionSelectionSection({
  editions,
  defaultEdition,
  editionRegexps,
  categoryOptions,
  onAddEdition,
  onRemoveEdition,
  onMakeDefault,
}: {
  editions: BrandEdition[];
  defaultEdition?: string;
  editionRegexps: Record<string, RegexEntry[]>;
  categoryOptions: string[];
  onAddEdition: (name: string, category: string) => void;
  onRemoveEdition: (id: string) => void;
  onMakeDefault: (name: string) => void;
}) {
  const [regexMap, setRegexMap] = useState(editionRegexps);
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  return (
    <SectionCard
      title="Edition selection"
      subtitle="Specific edition categories that can have this brand and category."
      actions={<AssignButton label="Assign edition" onClick={() => setAddOpen(true)} />}
    >
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr>
              <Th className="w-56">Edition</Th>
              <Th className="w-48">Category</Th>
              <Th>Regexp</Th>
              <Th className="w-16" />
            </tr>
          </thead>
          <tbody>
            {editions.length === 0
              ? emptyRow(4, "No editions yet.")
              : editions.map((e) => (
                  <tr key={e.id} className="border-t border-border align-top">
                    <Td>
                      <span className="inline-flex items-center gap-2 text-foreground/90">
                        {e.name}
                        {defaultEdition === e.name && <DefaultBadge />}
                      </span>
                    </Td>
                    <Td className="text-[var(--sidebar-active-fg)]">{e.category}</Td>
                    <Td>
                      <RegexChips
                        value={regexMap[e.name] ?? []}
                        onChange={(v) => setRegexMap((m) => ({ ...m, [e.name]: v }))}
                      />
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        {defaultEdition !== e.name && (
                          <button
                            type="button"
                            onClick={() => onMakeDefault(e.name)}
                            className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                            aria-label={`Make ${e.name} the default edition`}
                            title="Make default"
                          >
                            <Star className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <TrashButton label={`Remove ${e.name}`} onClick={() => onRemoveEdition(e.id)} />
                      </div>
                    </Td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <AssignDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Assign edition"
        submitLabel="Assign edition"
        canSubmit={!!name.trim() && !!category.trim()}
        onSubmit={() => {
          onAddEdition(name.trim(), category.trim());
          setName("");
          setCategory("");
          setAddOpen(false);
        }}
      >
        <Field label="Name" value={name} onChange={setName} placeholder="e.g. Coca-Cola Zero" />
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-foreground/80">
            Category <span className="text-destructive">*</span>
          </Label>
          <Command className="rounded-md border border-border">
            <CommandInput placeholder="Search category…" />
            <CommandList className="max-h-48">
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categoryOptions.map((c) => (
                  <CommandItem
                    key={c}
                    value={c}
                    onSelect={() => setCategory(c)}
                    className="flex items-center gap-2"
                  >
                    <Check className={cn("h-4 w-4 shrink-0", category === c ? "opacity-100" : "opacity-0")} />
                    <span className="min-w-0 flex-1 truncate">{c}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <span className="text-xs text-muted-foreground">
            Limited to the brand's Default category and its Category selection.
          </span>
        </div>
      </AssignDialog>
    </SectionCard>
  );
}

// --- Manufacturer selection -----------------------------------------------

const flagFor = (code: string): string => {
  const cc = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return "🏳️";
  return String.fromCodePoint(...[...cc].map((ch) => 127397 + ch.charCodeAt(0)));
};

export function ManufacturerSelectionSection({ initial }: { initial: ManufacturerRow[] }) {
  const [rows, setRows] = useState(initial);
  const [addOpen, setAddOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  return (
    <SectionCard
      title="Manufacturer selection"
      subtitle="Specific manufacturers that can have this brand."
      actions={<AssignButton label="Assign manufacturer" onClick={() => setAddOpen(true)} />}
    >
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr>
              <Th>Manufacturer</Th>
              <Th className="w-40">Country</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0
              ? emptyRow(3, "No manufacturers assigned.")
              : rows.map((m) => (
                  <tr key={m.id} className="border-t border-border hover:bg-secondary/40">
                    <Td className="text-[var(--sidebar-active-fg)]">{m.manufacturer}</Td>
                    <Td>
                      <span className="inline-flex items-center gap-2 text-foreground/80">
                        <span className="text-base leading-none">{m.flag}</span> {m.country}
                      </span>
                    </Td>
                    <Td>
                      <TrashButton
                        label={`Remove ${m.manufacturer}`}
                        onClick={() => setRows((rs) => rs.filter((x) => x.id !== m.id))}
                      />
                    </Td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <AssignDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Assign manufacturer"
        submitLabel="Assign manufacturer"
        canSubmit={!!country.trim() && !!manufacturer.trim()}
        onSubmit={() => {
          setRows((rs) => [...rs, { id: uid(), country, flag: flagFor(country), manufacturer }]);
          setCountry("");
          setManufacturer("");
          setAddOpen(false);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-foreground/80">
            Country <span className="text-destructive">*</span>
          </Label>
          <Command className="rounded-md border border-border">
            <CommandInput placeholder="Search country…" />
            <CommandList className="max-h-40">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {COUNTRY_OPTIONS.map((code) => (
                  <CommandItem
                    key={code}
                    value={`${COUNTRY_NAMES[code] ?? code} ${code}`}
                    onSelect={() => setCountry(code)}
                    className="flex items-center gap-2"
                  >
                    <Check className={cn("h-4 w-4 shrink-0", country === code ? "opacity-100" : "opacity-0")} />
                    <span className="text-base leading-none">{flagFor(code)}</span>
                    <span className="min-w-0 flex-1 truncate">
                      {COUNTRY_NAMES[code] ?? code} <span className="text-muted-foreground">({code})</span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-foreground/80">
            Manufacturer <span className="text-destructive">*</span>
          </Label>
          <Command className="rounded-md border border-border">
            <CommandInput placeholder="Search manufacturer…" />
            <CommandList className="max-h-40">
              <CommandEmpty>No manufacturer found.</CommandEmpty>
              <CommandGroup>
                {MANUFACTURERS.map((m) => (
                  <CommandItem
                    key={m}
                    value={m}
                    onSelect={() => setManufacturer(m)}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn("h-4 w-4 shrink-0", manufacturer === m ? "opacity-100" : "opacity-0")}
                    />
                    <span className="min-w-0 flex-1 truncate">{m}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </AssignDialog>
    </SectionCard>
  );
}
