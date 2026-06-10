import { ChevronDown, type LucideIcon } from "lucide-react";

export function FilterChip({
  label,
  icon: Icon,
}: {
  label: string;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-secondary"
    >
      {Icon ? <Icon className="h-3.5 w-3.5 text-muted-foreground" /> : null}
      {label}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}
