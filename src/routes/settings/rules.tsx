import { createFileRoute } from "@tanstack/react-router";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { LinkText } from "@/components/seeds/ListPrimitives";
import { RULES_KEY, INITIAL_RULES, type SettingRule } from "@/lib/settings";

export const Route = createFileRoute("/settings/rules")({
  head: () => ({ meta: [{ title: "Rules — Shalion" }] }),
  component: RulesPage,
});

function RulesPage() {
  const columns: SettingsColumn<SettingRule>[] = [
    { key: "name", label: "Name", sortValue: (r) => r.name, cell: (r) => <LinkText>{r.name}</LinkText> },
    { key: "prompt", label: "Prompt", cell: (r) => <span className="block max-w-[320px] truncate text-foreground/80" title={r.prompt}>{r.prompt}</span> },
    { key: "client", label: "Client", sortValue: (r) => r.client, cell: (r) => (r.client ? <LinkText>{r.client}</LinkText> : <span className="text-muted-foreground">—</span>) },
    { key: "datagroup", label: "Datagroup", cell: (r) => (r.datagroup ? <LinkText>{r.datagroup}</LinkText> : <span className="text-muted-foreground">—</span>) },
    { key: "createdAt", label: "Created at", sortValue: (r) => r.createdAt, cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span> },
    { key: "updatedAt", label: "Updated at", sortValue: (r) => r.updatedAt, cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span> },
  ];
  return (
    <SettingsList
      title="Rules"
      newLabel="New rule"
      storageKey={RULES_KEY}
      initial={INITIAL_RULES}
      searchPlaceholder="Search by rule name"
      searchText={(r) => r.name}
      entityLabel="rule"
      columns={columns}
    />
  );
}
