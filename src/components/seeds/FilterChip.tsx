import { ChevronDown, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Filters with more option values than this switch to a searchable dropdown. */
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
  /** When provided (with onChange), the chip becomes a functional filter dropdown. */
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
  /** Optional pretty label for an option value (e.g. country code → flag + name). */
  getLabel?: (value: string) => string;
  /** Force the searchable popover even with ≤10 options. */
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const interactive = !!options && !!onChange;
  const active = interactive && !!value;
  const display = (v: string) => (getLabel ? getLabel(v) : v);

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
      {active ? `${label}: ${display(value!)}` : label}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );

  if (!interactive) return trigger;

  // Long lists (or forced) → searchable popover.
  if (searchable || options!.length > SEARCHABLE_THRESHOLD) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup>
                {options!.map((o) => (
                  <CommandItem key={o} value={display(o)} onSelect={() => { onChange!(o); setOpen(false); }}>
                    {display(o)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="border-t border-border p-1">
              <button
                type="button"
                onClick={() => { onChange!(""); setOpen(false); }}
                className="w-full rounded px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-secondary"
              >
                Clear
              </button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  // Short lists → simple radio dropdown.
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 w-56 overflow-auto">
        <DropdownMenuRadioGroup value={value ?? ""} onValueChange={(v) => onChange!(v)}>
          <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
          {options!.map((o) => (
            <DropdownMenuRadioItem key={o} value={o}>{display(o)}</DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
