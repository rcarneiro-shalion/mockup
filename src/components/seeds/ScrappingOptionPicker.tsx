import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
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

const taskGroup = (o: ScrappingOptionValues) => (o.timeframes ?? []).join(", ");

/** The compact meta string: "extraction type, taskgroup, scrapping options". */
const meta = (o: ScrappingOptionValues) =>
  [o.extractionType, taskGroup(o), optionsSummary(o)].filter(Boolean).join(", ");

/** Multi-line summary shown as a hover tooltip. */
const tooltip = (o: ScrappingOptionValues) =>
  [
    `Name: ${o.name}`,
    `Extraction type: ${o.extractionType || "—"}`,
    `TaskGroup: ${taskGroup(o) || "—"}`,
    `Scrapping options: ${optionsSummary(o) || "—"}`,
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
  placeholder = "Select a scrapping option",
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
            <CommandEmpty>No scrapping options found.</CommandEmpty>
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
