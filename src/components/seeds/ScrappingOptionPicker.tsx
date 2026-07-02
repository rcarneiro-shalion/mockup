import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { ScrappingOptionValues } from "@/components/seeds/ScrappingOptionDialog";
import { getAppVersion } from "@/lib/appVersion";

// The joints/disjoints, summarised the same way as the scrapping options listing.
function optionsSummary(o: ScrappingOptionValues): string {
  const parts: string[] = [];
  if (o.multivariants) parts.push("Multivariants");
  if (o.pagination) parts.push(`max_page ${o.maxPage || "—"}`);
  if (o.limitedDiscovery) parts.push(`max_rank ${o.maxRank || "—"}`);
  if (o.modalities && (o.modalityValues ?? []).length) parts.push((o.modalityValues ?? []).join("/"));
  if (o.sorting) parts.push(`?sort=${o.sort}`);
  return parts.join(", ");
}

// V1 phase surfaces Timeframes (Settings › Timeframes); v2/v3 surface TaskGroups.
const taskGroup = (o: ScrappingOptionValues) =>
  (getAppVersion() === 1 ? (o.timeframes ?? []) : (o.taskGroups ?? [])).join(", ");

/** The compact meta string: "extraction type, taskgroup/timeframe, scrapping options". */
const meta = (o: ScrappingOptionValues) =>
  [o.extractionType, taskGroup(o), optionsSummary(o)].filter(Boolean).join(", ");

/** Multi-line summary shown as a hover tooltip. */
const tooltip = (o: ScrappingOptionValues) =>
  [
    `Name: ${o.name}`,
    `Extraction type: ${o.extractionType || "—"}`,
    `${getAppVersion() === 1 ? "Timeframe" : "TaskGroup"}: ${taskGroup(o) || "—"}`,
    `Scraping options: ${optionsSummary(o) || "—"}`,
  ].join("\n");

/** Single-line "name (meta)" descriptor — bold name + muted parenthetical. */
function Descriptor({ o }: { o: ScrappingOptionValues }) {
  const m = meta(o);
  return (
    <>
      <span className="font-medium text-foreground">{o.name}</span>
      {m && <span className="text-muted-foreground"> ({m})</span>}
    </>
  );
}

/**
 * Searchable scrapping-option picker for the subscription form. Search matches
 * name, extraction type, taskgroup and the scrapping options summary; both the
 * trigger and the list show "name (extraction type, taskgroup, options)" with a
 * "…" ellipsis and a tooltip carrying the full breakdown.
 */
export function ScrappingOptionPicker({
  value,
  onChange,
  options,
  placeholder = "Select a scraping option",
}: {
  value: string;
  onChange: (v: string) => void;
  options: ScrappingOptionValues[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          className="flex h-9 w-full items-center justify-between gap-1 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <span
            title={selected ? tooltip(selected) : undefined}
            className={cn("min-w-0 flex-1 truncate text-left", !selected && "text-muted-foreground")}
          >
            {selected ? <Descriptor o={selected} /> : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search by name, extraction type, taskgroup…" />
          <CommandList>
            <CommandEmpty>No scraping options found.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.name}
                  // cmdk filters on this string → searchable across all fields.
                  value={`${o.name} ${o.extractionType} ${taskGroup(o)} ${optionsSummary(o)}`}
                  onSelect={() => {
                    onChange(o.name);
                    setOpen(false);
                  }}
                  className="items-start gap-2"
                >
                  <Check className={cn("mt-0.5 h-4 w-4 shrink-0", value === o.name ? "opacity-100" : "opacity-0")} />
                  <span className="min-w-0 flex-1 truncate" title={tooltip(o)}>
                    <Descriptor o={o} />
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Multi-select scrapping-option picker — a subscription may run several options.
 * The popover stays open while toggling; selected options show as removable chips
 * below the trigger. Search matches name / extraction type / taskgroup / options.
 */
export function ScrappingOptionMultiPicker({
  value,
  onChange,
  options,
  placeholder = "Select scraping options",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: ScrappingOptionValues[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.filter((o) => value.includes(o.name));
  const toggle = (name: string) => {
    const next = new Set(value);
    next.has(name) ? next.delete(name) : next.add(name);
    onChange([...next]);
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            className="flex h-9 w-full items-center justify-between gap-1 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <span className={cn("min-w-0 flex-1 truncate text-left", !value.length && "text-muted-foreground")}>
              {value.length ? `${value.length} scraping option${value.length === 1 ? "" : "s"} selected` : placeholder}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search by name, extraction type, taskgroup…" />
            <CommandList>
              <CommandEmpty>No scraping options found.</CommandEmpty>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    key={o.name}
                    value={`${o.name} ${o.extractionType} ${taskGroup(o)} ${optionsSummary(o)}`}
                    onSelect={() => toggle(o.name)}
                    className="items-start gap-2"
                  >
                    <Check className={cn("mt-0.5 h-4 w-4 shrink-0", value.includes(o.name) ? "opacity-100" : "opacity-0")} />
                    <span className="min-w-0 flex-1 truncate" title={tooltip(o)}>
                      <Descriptor o={o} />
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((o) => (
            <span
              key={o.name}
              title={tooltip(o)}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-xs text-foreground/90"
            >
              <span className="max-w-[260px] truncate">{o.name}</span>
              <button
                type="button"
                onClick={() => toggle(o.name)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${o.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
