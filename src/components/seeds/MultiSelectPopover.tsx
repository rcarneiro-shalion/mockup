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

/**
 * Generic searchable multi-select over a flat list of string options. The popover
 * stays open while toggling; selections show as removable chips below the trigger.
 * Used by the subscription form's "Destination options" (zero, one or many PDP
 * sibling subscriptions).
 */
export function MultiSelectPopover({
  value,
  onChange,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No matches found.",
  noun = "item",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  noun?: string;
}) {
  const [open, setOpen] = useState(false);
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
              {value.length ? `${value.length} ${noun}${value.length === 1 ? "" : "s"} selected` : placeholder}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((name) => (
                  <CommandItem key={name} value={name} onSelect={() => toggle(name)} className="items-start gap-2">
                    <Check className={cn("mt-0.5 h-4 w-4 shrink-0", value.includes(name) ? "opacity-100" : "opacity-0")} />
                    <span className="min-w-0 flex-1 truncate">{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-xs text-foreground/90"
            >
              <span className="max-w-[260px] truncate">{name}</span>
              <button
                type="button"
                onClick={() => toggle(name)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${name}`}
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
