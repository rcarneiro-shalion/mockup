import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Filters with more option values than this show a search box. */
const SEARCHABLE_THRESHOLD = 10;

export function FilterChip({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  getLabel,
  searchable,
}: {
  label: string;
  icon?: LucideIcon;
  /** When provided (with onChange), the chip becomes a functional multi-select filter. */
  options?: string[];
  /** Selected values (multi-select). */
  value?: string[];
  onChange?: (value: string[]) => void;
  /** Optional pretty label for an option value (e.g. country code → flag + name). */
  getLabel?: (value: string) => string;
  /** Force the search box even with ≤10 options. */
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const interactive = !!options && !!onChange;
  const selected = value ?? [];
  const active = interactive && selected.length > 0;
  const display = (v: string) => (getLabel ? getLabel(v) : v);
  const useSearch = !!searchable || (options?.length ?? 0) > SEARCHABLE_THRESHOLD;

  const toggle = (o: string) =>
    onChange!(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o]);

  const chipText = active
    ? `${label}: ${selected.length === 1 ? display(selected[0]) : selected.length}`
    : label;

  const trigger = (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary/5 text-foreground"
          : "border-border bg-background text-foreground/80 hover:bg-secondary",
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5 text-muted-foreground" /> : null}
      {chipText}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );

  if (!interactive) return trigger;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-0">
        <Command>
          {useSearch && <CommandInput placeholder="Search" />}
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options!.map((o) => {
                const checked = selected.includes(o);
                return (
                  <CommandItem key={o} value={display(o)} onSelect={() => toggle(o)}>
                    <Check className={cn("mr-2 h-4 w-4 shrink-0", checked ? "opacity-100" : "opacity-0")} />
                    <span className="truncate">{display(o)}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {selected.length > 0 && (
            <div className="border-t border-border p-1">
              <button
                type="button"
                onClick={() => { onChange!([]); setOpen(false); }}
                className="w-full rounded px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-secondary"
              >
                Clear ({selected.length})
              </button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
