import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { LinkText } from "@/components/seeds/ListPrimitives";
import { usePersistentState } from "@/hooks/usePersistentState";
import { COUNTRY_GROUPS_KEY, INITIAL_COUNTRY_GROUPS, type CountryGroup } from "@/lib/settings";

export const Route = createFileRoute("/settings/country-groups/")({
  head: () => ({ meta: [{ title: "Country groups — Shalion" }] }),
  component: CountryGroupsPage,
});

function CountryGroupsPage() {
  const [rows, setRows] = usePersistentState<CountryGroup[]>(COUNTRY_GROUPS_KEY, INITIAL_COUNTRY_GROUPS);
  const navigate = useNavigate();

  const columns: SettingsColumn<CountryGroup>[] = [
    {
      key: "name",
      label: "Name",
      sortValue: (r) => r.name,
      cell: (r) => (
        <LinkText onClick={() => navigate({ to: "/settings/country-groups/$groupId", params: { groupId: r.id } })}>
          {r.name}
        </LinkText>
      ),
    },
    { key: "createdAt", label: "Created at", sortValue: (r) => r.createdAt, cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span> },
    { key: "updatedAt", label: "Updated at", sortValue: (r) => r.updatedAt, cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span> },
  ];

  return (
    <SettingsList
      title="Country groups"
      newLabel="New country group"
      onNew={() => toast.info("New country group — coming soon")}
      searchPlaceholder="Search country groups by name"
      searchText={(r) => r.name}
      entityLabel="country group"
      columns={columns}
      rows={rows}
      onDelete={(id) => setRows((prev) => prev.filter((r) => r.id !== id))}
    />
  );
}
