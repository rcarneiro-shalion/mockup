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
import { getBrands } from "@/lib/brands";

/**
 * Searchable single-select over the codification Brand entity. Used only for
 * BRANDED keyword seeds. The value is the brand NAME (keeps `seed.brand` a plain
 * string, consistent with `seed.store`). Searches by brand name, default
 * manufacturer and default category. An existing value that no longer matches a
 * brand is still shown so saved seeds aren't silently blanked.
 */
export function BrandSelect({
  value,
  onChange,
  placeholder = "Select a brand",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const brands = useMemo(() => getBrands(), []);

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
          <CommandInput placeholder="Search by brand, manufacturer, category…" />
          <CommandList>
            <CommandEmpty>No brand found.</CommandEmpty>
            <CommandGroup>
              {brands.map((b) => (
                <CommandItem
                  key={b.id}
                  value={`${b.name} ${b.defaultManufacturer} ${b.defaultCategory} ${b.id}`}
                  onSelect={() => {
                    onChange(b.name);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Check className={cn("h-4 w-4 shrink-0", value === b.name ? "opacity-100" : "opacity-0")} />
                  <span className="min-w-0 flex-1 truncate">{b.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{b.defaultManufacturer}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
