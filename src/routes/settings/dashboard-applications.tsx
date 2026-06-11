import { createFileRoute } from "@tanstack/react-router";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { LinkText } from "@/components/seeds/ListPrimitives";
import { DASHBOARD_APPS_KEY, INITIAL_DASHBOARD_APPS, type DashboardApp } from "@/lib/dashboardApps";

export const Route = createFileRoute("/settings/dashboard-applications")({
  head: () => ({ meta: [{ title: "Dashboard applications — Shalion" }] }),
  component: DashboardApplications,
});

function DashboardApplications() {
  const columns: SettingsColumn<DashboardApp>[] = [
    { key: "label", label: "Label", sortValue: (r) => r.label, cell: (r) => <LinkText>{r.label}</LinkText> },
    { key: "slug", label: "Slug", sortValue: (r) => r.slug, cell: (r) => <span className="text-foreground/80">{r.slug}</span> },
    { key: "createdAt", label: "Created at", sortValue: (r) => r.createdAt, cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span> },
    { key: "updatedAt", label: "Updated at", sortValue: (r) => r.updatedAt, cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span> },
  ];
  return (
    <SettingsList
      title="Dashboard applications"
      newLabel="New dashboard application"
      storageKey={DASHBOARD_APPS_KEY}
      initial={INITIAL_DASHBOARD_APPS}
      searchPlaceholder="Search dashboard applications by label"
      searchText={(r) => r.label}
      entityLabel="dashboard application"
      columns={columns}
    />
  );
}
