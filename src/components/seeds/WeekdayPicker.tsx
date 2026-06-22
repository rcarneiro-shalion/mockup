import { cn } from "@/lib/utils";

// Sun..Sat in canonical order; `letter` is the compact S M T W T F S label.
export const WEEKDAYS = [
  { key: "Sun", letter: "S" },
  { key: "Mon", letter: "M" },
  { key: "Tue", letter: "T" },
  { key: "Wed", letter: "W" },
  { key: "Thu", letter: "T" },
  { key: "Fri", letter: "F" },
  { key: "Sat", letter: "S" },
];

/**
 * A row of S M T W T F S toggle pills. The parent owns the selection semantics
 * (single-select or multi-select) by passing the current `selected` keys and an
 * `onToggle(day)` handler. Used by the Custom recurrence editor (multi) and the
 * Weekly "Starts on" day picker (single).
 */
export function WeekdayPicker({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (day: string) => void;
}) {
  return (
    <div className="flex gap-1">
      {WEEKDAYS.map((w, i) => {
        const on = selected.includes(w.key);
        return (
          <button
            key={i}
            type="button"
            onClick={() => onToggle(w.key)}
            title={w.key}
            aria-pressed={on}
            className={cn(
              "h-7 w-7 rounded-full text-xs font-medium transition-colors",
              on ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/70",
            )}
          >
            {w.letter}
          </button>
        );
      })}
    </div>
  );
}
