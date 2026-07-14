import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { SelectBox } from "@/components/seeds/SelectBox";
import { WeekdayPicker, WEEKDAYS } from "@/components/seeds/WeekdayPicker";
import { cn } from "@/lib/utils";
import type { CustomSchedule } from "@/lib/scrapingPlans";

const range = (n: number, from = 1) => Array.from({ length: n }, (_, i) => String(i + from));

export const DEFAULT_CUSTOM_SCHEDULE: CustomSchedule = {
  unit: "Daily",
  dailyMode: "everyNDays",
  everyNDays: "1",
  timesPerDay: "1",
  timesPerWeek: "1",
  everyNWeeks: "1",
  weekdays: ["Mon"],
  ends: "Never",
};

/**
 * Rich recurrence editor for a ScrapingPlan's Custom frequency. A Daily base runs
 * either "every N days" or "N× per day"; a Weekly base runs N× per week, every
 * N weeks, on chosen weekdays. Either base can end Never / On a date / After N runs.
 */
export function CustomScheduleEditor({
  value,
  onChange,
}: {
  value: CustomSchedule;
  onChange: (v: CustomSchedule) => void;
}) {
  const v = { ...DEFAULT_CUSTOM_SCHEDULE, ...value };
  const set = (patch: Partial<CustomSchedule>) => onChange({ ...v, ...patch });
  const toggleDay = (d: string) => {
    const cur = new Set(v.weekdays ?? []);
    cur.has(d) ? cur.delete(d) : cur.add(d);
    set({ weekdays: WEEKDAYS.filter((w) => cur.has(w.key)).map((w) => w.key) });
  };

  return (
    <div className="mt-2 space-y-3 rounded-md border border-border bg-secondary/30 p-3 text-sm">
      <Row label="Repeat">
        <SelectBox
          value={v.unit}
          onChange={(x) => set({ unit: x as CustomSchedule["unit"] })}
          options={["Daily", "Weekly"]}
          className="w-32"
        />
      </Row>

      {v.unit === "Daily" ? (
        <div className="space-y-2">
          <RadioRow checked={v.dailyMode !== "timesPerDay"} onSelect={() => set({ dailyMode: "everyNDays" })}>
            <span className="text-muted-foreground">Every</span>
            <Input
              type="number"
              min={1}
              value={v.everyNDays ?? ""}
              onChange={(e) => set({ dailyMode: "everyNDays", everyNDays: e.target.value })}
              disabled={v.dailyMode === "timesPerDay"}
              className="w-20"
            />
            <span className="text-muted-foreground">day(s)</span>
          </RadioRow>
          <RadioRow checked={v.dailyMode === "timesPerDay"} onSelect={() => set({ dailyMode: "timesPerDay" })}>
            <SelectBox
              value={v.timesPerDay ?? "1"}
              onChange={(x) => set({ dailyMode: "timesPerDay", timesPerDay: x })}
              options={range(24)}
              threshold={30}
              disabled={v.dailyMode !== "timesPerDay"}
              className="w-20"
            />
            <span className="text-muted-foreground">× per day</span>
          </RadioRow>
        </div>
      ) : (
        <div className="space-y-2">
          <Row label="Per week">
            <SelectBox value={v.timesPerWeek ?? "1"} onChange={(x) => set({ timesPerWeek: x })} options={range(7)} className="w-20" />
            <span className="text-muted-foreground">× per week</span>
          </Row>
          <Row label="Repeat every">
            <SelectBox value={v.everyNWeeks ?? "1"} onChange={(x) => set({ everyNWeeks: x })} options={range(4)} className="w-20" />
            <span className="text-muted-foreground">week(s)</span>
          </Row>
          <Row label="Repeat on">
            <WeekdayPicker selected={v.weekdays ?? []} onToggle={toggleDay} />
          </Row>
        </div>
      )}

      <Row label="Ends">
        <SelectBox
          value={v.ends ?? "Never"}
          onChange={(x) => set({ ends: x as CustomSchedule["ends"] })}
          options={["Never", "On", "After"]}
          className="w-28"
        />
        {v.ends === "On" && (
          <Input type="date" value={v.endsOn ?? ""} onChange={(e) => set({ endsOn: e.target.value })} className="w-40" />
        )}
        {v.ends === "After" && (
          <span className="flex items-center gap-2">
            <Input type="number" min={1} value={v.endsAfter ?? ""} onChange={(e) => set({ endsAfter: e.target.value })} placeholder="N" className="w-20" />
            <span className="text-muted-foreground">occurrence(s)</span>
          </span>
        )}
      </Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-28 shrink-0 text-xs font-medium text-foreground/70">{label}</span>
      {children}
    </div>
  );
}

function RadioRow({ checked, onSelect, children }: { checked: boolean; onSelect: () => void; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-28 shrink-0" />
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={checked}
        className={cn("grid h-4 w-4 shrink-0 place-items-center rounded-full border", checked ? "border-primary" : "border-border")}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-primary" />}
      </button>
      {children}
    </div>
  );
}
