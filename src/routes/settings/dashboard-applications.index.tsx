import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { DashboardGuideModal } from "@/components/settings/DashboardGuideModal";
import { LinkText } from "@/components/seeds/ListPrimitives";
import { usePersistentState } from "@/hooks/usePersistentState";
import { toast } from "sonner";
import { DASHBOARD_APPS_KEY, INITIAL_DASHBOARD_APPS, type DashboardApp } from "@/lib/dashboardApps";

export const Route = createFileRoute("/settings/dashboard-applications/")({
  head: () => ({ meta: [{ title: "Dashboard applications — Shalion" }] }),
  component: DashboardApplicationsPage,
});

function DashboardApplicationsPage() {
  const [rows, setRows] = usePersistentState<DashboardApp[]>(
    DASHBOARD_APPS_KEY,
    INITIAL_DASHBOARD_APPS,
  );
  const navigate = useNavigate();

  const columns: SettingsColumn<DashboardApp>[] = [
    {
      key: "label",
      label: "Label",
      sortValue: (r) => r.label,
      cell: (r) => (
        <LinkText
          onClick={() =>
            navigate({ to: "/settings/dashboard-applications/$appId", params: { appId: r.id } })
          }
        >
          {r.label}
        </LinkText>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      sortValue: (r) => r.slug,
      cell: (r) => <span className="text-foreground/80">{r.slug}</span>,
    },
    {
      key: "createdAt",
      label: "Created at",
      sortValue: (r) => r.createdAt,
      cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span>,
    },
    {
      key: "updatedAt",
      label: "Updated at",
      sortValue: (r) => r.updatedAt,
      cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span>,
    },
  ];

  return (
    <SettingsList
      title="Dashboard applications"
      newLabel="New dashboard application"
      onNew={() => toast.info("New dashboard application — coming soon")}
      searchPlaceholder="Search dashboard applications by label"
      searchText={(r) => r.label}
      entityLabel="dashboard application"
      columns={columns}
      rows={rows}
      onDelete={(id) => setRows((prev) => prev.filter((r) => r.id !== id))}
      headerActions={<DashboardGuideModal />}
    />
  );
}
