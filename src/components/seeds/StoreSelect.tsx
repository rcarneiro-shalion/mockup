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
import { getStores, countryLabel } from "@/lib/retailers";

/**
 * Searchable single-select over the real Store entity (retailer › store). The
 * value is the store NAME (keeps `seed.store` a plain string). Searches by store
 * name, retailer, country and domain. An existing value that no longer matches a
 * store is still shown so saved seeds aren't silently blanked.
 */
export function StoreSelect({
  value,
  onChange,
  placeholder = "Select a store",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const stores = useMemo(() => getStores().filter((s) => s.status !== "Inactive"), []);
  const selected = stores.find((s) => s.name === value);

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
            {value ? (
              <>
                <span className="truncate">{value}</span>
                {selected && <span className="shrink-0 text-xs text-muted-foreground">· {selected.retailer}</span>}
              </>
            ) : (
              placeholder
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[--radix-popover-trigger-width] min-w-[340px] p-0">
        <Command>
          <CommandInput placeholder="Search by store, retailer, country…" />
          <CommandList>
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup>
              {stores.map((s) => (
                <CommandItem
                  key={s.id}
                  value={`${s.name} ${s.retailer} ${s.country} ${s.domain} ${s.id}`}
                  onSelect={() => {
                    onChange(s.name);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Check className={cn("h-4 w-4 shrink-0", value === s.name ? "opacity-100" : "opacity-0")} />
                  <span className="min-w-0 flex-1 truncate">{s.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{s.retailer}</span>
                  <span className="shrink-0 text-xs">{countryLabel(s.country)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
