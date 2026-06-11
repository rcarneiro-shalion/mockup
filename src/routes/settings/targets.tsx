import { createFileRoute } from "@tanstack/react-router";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { LinkText } from "@/components/seeds/ListPrimitives";
import { TARGETS_KEY, INITIAL_TARGETS, type SettingTarget } from "@/lib/settings";

export const Route = createFileRoute("/settings/targets")({
  head: () => ({ meta: [{ title: "Targets — Shalion" }] }),
  component: TargetsPage,
});

function TargetsPage() {
  const columns: SettingsColumn<SettingTarget>[] = [
    { key: "name", label: "Name", sortValue: (r) => r.name, cell: (r) => <LinkText>{r.name}</LinkText> },
    { key: "defaultValue", label: "Default value", sortValue: (r) => r.defaultValue, cell: (r) => <span className="text-foreground/80">{r.defaultValue}</span> },
    { key: "createdAt", label: "Created at", sortValue: (r) => r.createdAt, cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span> },
    { key: "updatedAt", label: "Updated at", sortValue: (r) => r.updatedAt, cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span> },
  ];
  return (
    <SettingsList
      title="Targets"
      newLabel="New target"
      storageKey={TARGETS_KEY}
      initial={INITIAL_TARGETS}
      searchPlaceholder="Search by targets name"
      searchText={(r) => r.name}
      entityLabel="target"
      columns={columns}
    />
  );
}
