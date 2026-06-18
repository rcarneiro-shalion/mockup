import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { getCategories } from "@/lib/settings";

/**
 * Searchable single-select over the Category entity (Settings › Categories). The
 * value is the category NAME (keeps `seed.cat` a plain string). Searches by name,
 * description, ES description and sector. An existing value that no longer matches
 * a category is still shown so saved seeds aren't silently blanked.
 */
export function CategorySelect({
  value,
  onChange,
  placeholder = "Select a category",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const categories = useMemo(() => getCategories(), []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <span className={cn("flex min-w-0 items-center gap-2 truncate", !value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[--radix-popover-trigger-width] min-w-[340px] p-0">
        <Command>
          <CommandInput placeholder="Search by category, description, sector…" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((c) => (
                <CommandItem
                  key={c.id}
                  value={`${c.name} ${c.description} ${c.esDescription} ${c.sector} ${c.id}`}
                  onSelect={() => {
                    onChange(c.name);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Check className={cn("h-4 w-4 shrink-0", value === c.name ? "opacity-100" : "opacity-0")} />
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                  {c.description && (
                    <span className="min-w-0 max-w-[45%] shrink-0 truncate text-xs text-muted-foreground">{c.description}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
