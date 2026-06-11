import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Th, Td, Pagination, LinkText } from "@/components/seeds/ListPrimitives";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import {
  BackLink,
  FieldLabel,
  NotFound,
  TranslationChips,
} from "@/components/settings/DashboardAppPrimitives";
import { usePersistentState } from "@/hooks/usePersistentState";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  DASHBOARD_APPS_KEY,
  INITIAL_DASHBOARD_APPS,
  nowStamp,
  type DashboardApp,
  type DashGroup,
} from "@/lib/dashboardApps";

export const Route = createFileRoute("/settings/dashboard-applications/$appId/")({
  head: () => ({ meta: [{ title: "Dashboard application — Shalion" }] }),
  component: AppEditPage,
});

function AppEditPage() {
  const { appId } = Route.useParams();
  const [apps, setApps] = usePersistentState<DashboardApp[]>(
    DASHBOARD_APPS_KEY,
    INITIAL_DASHBOARD_APPS,
  );
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/settings/dashboard-applications" });

  const app = apps.find((a) => a.id === appId);

  if (!app) return <NotFound onBack={goBack} />;

  const groups = app.groups ?? [];

  const patchApp = (patch: Partial<DashboardApp>) =>
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, ...patch, updatedAt: nowStamp() } : a)),
    );

  const setGroups = (groups: DashGroup[]) => patchApp({ groups });

  return (
    <AppShell>
      <div className="h-full overflow-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          <BackLink label="Dashboard applications" onClick={goBack} />
          <h1 className="mb-5 text-2xl font-bold tracking-tight text-foreground">{app.label}</h1>

          {/* App fields */}
          <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <FieldLabel flag required>
                  Label
                </FieldLabel>
                <Input value={app.label} onChange={(e) => patchApp({ label: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>Slug</FieldLabel>
                <Input value={app.slug} onChange={(e) => patchApp({ slug: e.target.value })} />
              </div>
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={!!app.isMaestroEnabled}
                onChange={(e) => patchApp({ isMaestroEnabled: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-border"
              />
              <span>
                <span className="block text-sm font-medium text-foreground">
                  Is Maestro enabled
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Check to enable Maestro in this dashboard application.
                </span>
              </span>
            </label>

            <TranslationChips />
          </div>

          {/* Dashboard groups */}
          <div className="mt-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Dashboard groups</h2>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => toast.info("New dashboard group — coming soon")}
              >
                <Plus className="h-3.5 w-3.5" /> New dashboard group
              </Button>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60">
                  <tr>
                    <Th>Label</Th>
                    <Th>Icon</Th>
                    <Th>Created at</Th>
                    <Th>Updated at</Th>
                    <Th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {groups.length === 0 ? (
                    <tr>
                      <Td className="text-muted-foreground">
                        <span className="block py-2">No dashboard groups yet.</span>
                      </Td>
                      <Td />
                      <Td />
                      <Td />
                      <Td />
                    </tr>
                  ) : (
                    groups.map((g) => (
                      <tr key={g.id} className="border-t border-border hover:bg-secondary/40">
                        <Td>
                          <LinkText
                            onClick={() =>
                              navigate({
                                to: "/settings/dashboard-applications/$appId/groups/$groupId",
                                params: { appId: app.id, groupId: g.id },
                              })
                            }
                          >
                            {g.label}
                          </LinkText>
                        </Td>
                        <Td className="text-foreground/80">{g.icon}</Td>
                        <Td className="text-muted-foreground">{g.createdAt}</Td>
                        <Td className="text-muted-foreground">{g.updatedAt}</Td>
                        <Td>
                          <RowActionsMenu
                            id={g.id}
                            entityLabel="dashboard group"
                            onDelete={() => setGroups(groups.filter((x) => x.id !== g.id))}
                          />
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination total={groups.length} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
