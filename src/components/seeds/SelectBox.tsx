import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export type SelectOption = string | { value: string; label: string };

const norm = (o: SelectOption) => (typeof o === "string" ? { value: o, label: o } : o);

/**
 * A single-select dropdown that automatically becomes SEARCHABLE once it has more
 * than `threshold` options (default 10), and stays a plain dropdown below that.
 * Used across the Seeds API forms so any saved/dynamic list (projects,
 * subscriptions, scrapping options, …) stays usable as it grows past ~10 entries.
 * Drop-in compatible with the previous local `SelectBox` (string[] options).
 */
export function SelectBox({
  value,
  onChange,
  options,
  disabled,
  placeholder,
  className,
  threshold = 10,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  threshold?: number;
}) {
  const opts = options.map(norm);
  const ph = placeholder ?? "Select a value";

  if (opts.length > threshold) return <SearchableSelect {...{ value, onChange, opts, disabled, placeholder: ph, className }} />;

  return (
    <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={ph} />
      </SelectTrigger>
      <SelectContent>
        {opts.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SearchableSelect({
  value,
  onChange,
  opts,
  disabled,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  opts: { value: string; label: string }[];
  disabled?: boolean;
  placeholder: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = opts.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            className,
          )}
        >
          <span className={cn(!selected && "text-muted-foreground")}>{selected ? selected.label : placeholder}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {opts.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.label}
                  onSelect={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4 shrink-0", value === o.value ? "opacity-100" : "opacity-0")} />
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
