import { ChevronDown, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function FilterChip({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon?: LucideIcon;
  /** When provided (with onChange), the chip becomes a functional filter dropdown. */
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const interactive = !!options && !!onChange;
  const active = interactive && !!value;

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
      {active ? `${label}: ${value}` : label}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );

  if (!interactive) return trigger;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 w-56 overflow-auto">
        <DropdownMenuRadioGroup value={value ?? ""} onValueChange={(v) => onChange!(v)}>
          <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
          {options!.map((o) => (
            <DropdownMenuRadioItem key={o} value={o}>{o}</DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
