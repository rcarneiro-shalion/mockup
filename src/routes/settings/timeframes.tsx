import { createFileRoute } from "@tanstack/react-router";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { LinkText } from "@/components/seeds/ListPrimitives";
import { usePersistentState } from "@/hooks/usePersistentState";
import { SETTINGS_TIMEFRAMES_KEY, INITIAL_SETTINGS_TIMEFRAMES, type SettingTimeframe } from "@/lib/settings";

export const Route = createFileRoute("/settings/timeframes")({
  head: () => ({ meta: [{ title: "Timeframes — Shalion" }] }),
  component: TimeframesPage,
});

function TimeframesPage() {
  const [rows, setRows] = usePersistentState<SettingTimeframe[]>(SETTINGS_TIMEFRAMES_KEY, INITIAL_SETTINGS_TIMEFRAMES);
  const columns: SettingsColumn<SettingTimeframe>[] = [
    { key: "name", label: "Name", sortValue: (r) => r.name, cell: (r) => <LinkText>{r.name}</LinkText> },
    { key: "product", label: "Product", sortValue: (r) => r.product, cell: (r) => <span className="text-foreground/80">{r.product}</span> },
    { key: "group", label: "Timeframe group", sortValue: (r) => r.group, cell: (r) => <span className="text-foreground/80">{r.group}</span> },
    { key: "schedule", label: "Schedule", cell: (r) => <span className="text-muted-foreground">{r.schedule}</span> },
    { key: "duration", label: "Duration", cell: (r) => <span className="text-muted-foreground">{r.duration}</span> },
    { key: "frequency", label: "Frequency", cell: (r) => <span className="text-muted-foreground">{r.frequency}</span> },
  ];
  return (
    <SettingsList
      title="Timeframes"
      newLabel="New timeframe"
      searchPlaceholder="Search timeframes by name"
      searchText={(r) => r.name}
      entityLabel="timeframe"
      columns={columns}
      rows={rows}
      onDelete={(id) => setRows((p) => p.filter((x) => x.id !== id))}
    />
  );
}
