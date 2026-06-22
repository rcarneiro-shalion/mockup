import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

/**
 * Bordered "chips + Add" multi-select — the TaskGroup pattern from the Scrapping
 * option form, extracted so other multi-value fields (e.g. the Subscription
 * Rotation field) look and behave identically. Selected values render as removable
 * chips inside a bordered box; a dashed "Add …" dropdown offers the remaining options.
 */
export function ChipMultiSelect({
  value,
  onChange,
  options,
  addLabel = "Add",
  emptyLabel = "None selected",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  options: string[];
  addLabel?: string;
  emptyLabel?: string;
}) {
  const add = (t: string) => {
    if (!value.includes(t)) onChange([...value, t]);
  };
  const remove = (t: string) => onChange(value.filter((x) => x !== t));
  const available = options.filter((t) => !value.includes(t));

  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5">
      {value.length === 0 && (
        <span className="px-1 text-sm text-muted-foreground">{emptyLabel}</span>
      )}
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-foreground"
        >
          {t}
          <button
            type="button"
            onClick={() => remove(t)}
            className="text-muted-foreground hover:text-destructive"
            aria-label={`Remove ${t}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {available.length > 0 && (
        <Select value="" onValueChange={add}>
          <SelectTrigger className="h-6 w-auto gap-1 border-dashed px-2 text-xs text-muted-foreground">
            <Plus className="h-3 w-3" />
            <span>{addLabel}</span>
          </SelectTrigger>
          <SelectContent>
            {available.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
