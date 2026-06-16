import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
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
 * A single-select dropdown that:
 *  - auto-becomes SEARCHABLE once it has more than `threshold` options (default 10);
 *  - with `clearable`, lets the user clear the chosen value (✕ in the field → "").
 * Both of those render a popover combobox; a plain dropdown otherwise. Drop-in for
 * the old local SelectBox (string[] options); also accepts {value,label} options.
 */
export function SelectBox({
  value,
  onChange,
  options,
  disabled,
  placeholder,
  className,
  threshold = 10,
  clearable,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  threshold?: number;
  clearable?: boolean;
}) {
  const opts = options.map(norm);
  const ph = placeholder ?? "Select a value";
  const searchable = opts.length > threshold;

  if (!searchable && !clearable) {
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

  return <ComboSelect {...{ value, onChange, opts, disabled, placeholder: ph, className, searchable, clearable }} />;
}

function ComboSelect({
  value,
  onChange,
  opts,
  disabled,
  placeholder,
  className,
  searchable,
  clearable,
}: {
  value: string;
  onChange: (v: string) => void;
  opts: { value: string; label: string }[];
  disabled?: boolean;
  placeholder: string;
  className?: string;
  searchable: boolean;
  clearable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = opts.find((o) => o.value === value);
  const showClear = !!clearable && !!value && !disabled;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between gap-1 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            className,
          )}
        >
          <span className={cn("min-w-0 flex-1 truncate text-left", !selected && "text-muted-foreground")}>
            {selected ? selected.label : placeholder}
          </span>
          <span className="flex shrink-0 items-center gap-0.5">
            {showClear && (
              // Not a <button> (can't nest in the trigger button) — a clickable span
              // that clears without toggling the popover.
              <span
                role="button"
                aria-label="Clear selection"
                tabIndex={-1}
                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(""); }}
                className="grid h-4 w-4 place-items-center rounded text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          {searchable && <CommandInput placeholder="Search…" />}
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
