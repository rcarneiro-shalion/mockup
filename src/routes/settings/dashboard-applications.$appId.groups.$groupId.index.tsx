import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Th, Td, Pagination, LinkText, Pill } from "@/components/seeds/ListPrimitives";
import {
  BackLink,
  Breadcrumb,
  FieldLabel,
  NotFound,
  TranslationChips,
} from "@/components/settings/DashboardAppPrimitives";
import { usePersistentState } from "@/hooks/usePersistentState";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import {
  DASHBOARD_APPS_KEY,
  INITIAL_DASHBOARD_APPS,
  nowStamp,
  type DashboardApp,
  type DashGroup,
  type DashSection,
} from "@/lib/dashboardApps";

export const Route = createFileRoute(
  "/settings/dashboard-applications/$appId/groups/$groupId/",
)({
  head: () => ({ meta: [{ title: "Dashboard group — Shalion" }] }),
  component: GroupEditPage,
});

function GroupEditPage() {
  const { appId, groupId } = Route.useParams();
  const [apps, setApps] = usePersistentState<DashboardApp[]>(
    DASHBOARD_APPS_KEY,
    INITIAL_DASHBOARD_APPS,
  );
  const navigate = useNavigate();
  const goApp = () =>
    navigate({ to: "/settings/dashboard-applications/$appId", params: { appId } });
  const goList = () => navigate({ to: "/settings/dashboard-applications" });

  const app = apps.find((a) => a.id === appId);
  const group = app?.groups.find((g) => g.id === groupId);

  if (!app || !group) return <NotFound onBack={goList} />;

  // Map app → group, replace the group, write the whole apps array back.
  const patchGroup = (patch: Partial<DashGroup>) =>
    setApps((prev) =>
      prev.map((a) =>
        a.id !== appId
          ? a
          : {
              ...a,
              updatedAt: nowStamp(),
              groups: a.groups.map((g) =>
                g.id === groupId ? { ...g, ...patch, updatedAt: nowStamp() } : g,
              ),
            },
      ),
    );

  const setSections = (sections: DashSection[]) => patchGroup({ sections });

  return (
    <AppShell>
      <div className="h-full overflow-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          <Breadcrumb
            crumbs={[
              { label: "Dashboard applications", onClick: goList },
              { label: app.label, onClick: goApp },
              { label: "Dashboard groups", onClick: goApp },
              { label: group.label },
            ]}
          />
          <BackLink label="Dashboard application" onClick={goApp} />
          <h1 className="mb-5 text-2xl font-bold tracking-tight text-foreground">{group.label}</h1>

          {/* Group fields */}
          <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <FieldLabel flag required>
                  Label
                </FieldLabel>
                <Input
                  value={group.label}
                  onChange={(e) => patchGroup({ label: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>Icon</FieldLabel>
                <Input value={group.icon} onChange={(e) => patchGroup({ icon: e.target.value })} />
              </div>
            </div>
            <TranslationChips />
          </div>

          {/* Dashboard sections */}
          <div className="mt-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Dashboard sections</h2>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => toast.info("Add section — coming soon")}
              >
                <Plus className="h-3.5 w-3.5" /> Add section
              </Button>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60">
                  <tr>
                    <Th>Path</Th>
                    <Th>Type</Th>
                    <Th>Definition</Th>
                    <Th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {group.sections.length === 0 ? (
                    <tr>
                      <Td className="text-muted-foreground">
                        <span className="block py-2">There are no data</span>
                      </Td>
                      <Td />
                      <Td />
                      <Td />
                    </tr>
                  ) : (
                    group.sections.map((s) => (
                      <tr key={s.id} className="border-t border-border hover:bg-secondary/40">
                        <Td>
                          <LinkText
                            onClick={() =>
                              navigate({
                                to: "/settings/dashboard-applications/$appId/groups/$groupId/sections/$sectionId",
                                params: { appId: app.id, groupId: group.id, sectionId: s.id },
                              })
                            }
                          >
                            {s.path}
                          </LinkText>
                        </Td>
                        <Td>
                          <Pill tone={s.type === "BUILT_IN" ? "blue" : "violet"}>{s.type}</Pill>
                        </Td>
                        <Td>
                          <span
                            className="block max-w-[280px] truncate font-mono text-xs text-emerald-700"
                            title={JSON.stringify(s.definition)}
                          >
                            {JSON.stringify(s.definition)}
                          </span>
                        </Td>
                        <Td>
                          <button
                            onClick={() => setSections(group.sections.filter((x) => x.id !== s.id))}
                            className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                            aria-label={`Delete ${s.path}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination total={group.sections.length} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
