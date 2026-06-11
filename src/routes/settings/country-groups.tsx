import { createFileRoute } from "@tanstack/react-router";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { LinkText } from "@/components/seeds/ListPrimitives";
import { COUNTRY_GROUPS_KEY, INITIAL_COUNTRY_GROUPS, type CountryGroup } from "@/lib/settings";

export const Route = createFileRoute("/settings/country-groups")({
  head: () => ({ meta: [{ title: "Country groups — Shalion" }] }),
  component: CountryGroupsPage,
});

function CountryGroupsPage() {
  const columns: SettingsColumn<CountryGroup>[] = [
    { key: "name", label: "Name", sortValue: (r) => r.name, cell: (r) => <LinkText>{r.name}</LinkText> },
    { key: "createdAt", label: "Created at", sortValue: (r) => r.createdAt, cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span> },
    { key: "updatedAt", label: "Updated at", sortValue: (r) => r.updatedAt, cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span> },
  ];
  return (
    <SettingsList
      title="Country groups"
      newLabel="New country group"
      storageKey={COUNTRY_GROUPS_KEY}
      initial={INITIAL_COUNTRY_GROUPS}
      searchPlaceholder="Search country groups by name"
      searchText={(r) => r.name}
      entityLabel="country group"
      columns={columns}
    />
  );
}
