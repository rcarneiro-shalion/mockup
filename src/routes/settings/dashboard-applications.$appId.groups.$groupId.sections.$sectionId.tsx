import { useState } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Th, Td, Pagination } from "@/components/seeds/ListPrimitives";
import {
  BackLink,
  Breadcrumb,
  FieldLabel,
  NotFound,
  TranslationChips,
} from "@/components/settings/DashboardAppPrimitives";
import { AddTabDialog } from "@/components/settings/AddTabDialog";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import {
  useDashboardApps,
  nowStamp,
  type DashboardApp,
  type DashSection,
  type DashDefinitionVar,
  type DashTab,
} from "@/lib/dashboardApps";

export const Route = createFileRoute(
  "/settings/dashboard-applications/$appId/groups/$groupId/sections/$sectionId",
)({
  head: () => ({ meta: [{ title: "Dashboard section — Shalion" }] }),
  component: SectionEditPage,
});

const SECTION_TYPES: { value: DashSection["type"]; label: string; hint: string }[] = [
  { value: "BUILT_IN", label: "Built in", hint: "A standard, app-provided section." },
  { value: "CUSTOM", label: "Custom", hint: "A bespoke section with its own definition." },
];

function SectionEditPage() {
  const { appId, groupId, sectionId } = useParams({
    from: "/settings/dashboard-applications/$appId/groups/$groupId/sections/$sectionId",
  });
  const [apps, setApps] = useDashboardApps();
  const navigate = useNavigate();
  const [tabOpen, setTabOpen] = useState(false);

  const goList = () => navigate({ to: "/settings/dashboard-applications" });
  const goApp = () =>
    navigate({ to: "/settings/dashboard-applications/$appId", params: { appId } });
  const goGroup = () =>
    navigate({
      to: "/settings/dashboard-applications/$appId/groups/$groupId",
      params: { appId, groupId },
    });

  const app = apps.find((a) => a.id === appId);
  const group = app?.groups.find((g) => g.id === groupId);
  const section = group?.sections.find((s) => s.id === sectionId);

  if (!app || !group || !section) return <NotFound onBack={goList} />;

  // Map app → group → section, replace the section, write the whole apps array back.
  const patchSection = (patch: Partial<DashSection>) =>
    setApps((prev) =>
      prev.map((a) =>
        a.id !== appId
          ? a
          : {
              ...a,
              updatedAt: nowStamp(),
              groups: a.groups.map((g) =>
                g.id !== groupId
                  ? g
                  : {
                      ...g,
                      updatedAt: nowStamp(),
                      sections: g.sections.map((s) =>
                        s.id === sectionId ? { ...s, ...patch, updatedAt: nowStamp() } : s,
                      ),
                    },
              ),
            },
      ),
    );

  const setDefinition = (definition: DashDefinitionVar[]) => patchSection({ definition });
  const addVariable = () => setDefinition([...section.definition, { key: "", value: "" }]);
  const patchVariable = (idx: number, patch: Partial<DashDefinitionVar>) =>
    setDefinition(section.definition.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  const removeVariable = (idx: number) =>
    setDefinition(section.definition.filter((_, i) => i !== idx));

  const addTab = (tab: DashTab) => patchSection({ tabs: [...section.tabs, tab] });

  return (
    <AppShell>
      <div className="h-full overflow-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          <Breadcrumb
            crumbs={[
              { label: "Dashboard applications", onClick: goList },
              { label: app.label, onClick: goApp },
              { label: group.label, onClick: goGroup },
              { label: section.path },
            ]}
          />
          <BackLink label="Dashboard application" onClick={goApp} />
          <h1 className="mb-5 text-2xl font-bold tracking-tight text-foreground">{section.path}</h1>

          {/* Section fields */}
          <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <FieldLabel required>Path</FieldLabel>
                <Input
                  value={section.path}
                  onChange={(e) => patchSection({ path: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel flag required>
                  Label
                </FieldLabel>
                <Input
                  value={section.label}
                  onChange={(e) => patchSection({ label: e.target.value })}
                />
              </div>
            </div>

            <TranslationChips />

            {/* Type radio-cards */}
            <div className="flex flex-col gap-2">
              <FieldLabel required>Type</FieldLabel>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SECTION_TYPES.map((t) => {
                  const active = section.type === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => patchSection({ type: t.value })}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                        active
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/60",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid h-4 w-4 place-items-center rounded-full border",
                          active ? "border-primary" : "border-muted-foreground/50",
                        )}
                      >
                        {active && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-foreground">{t.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{t.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Definition variables */}
            <div className="flex flex-col gap-2">
              <FieldLabel>Definition</FieldLabel>
              {section.definition.length === 0 && (
                <p className="text-sm text-muted-foreground">No variables defined.</p>
              )}
              <div className="space-y-2">
                {section.definition.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      placeholder="key"
                      value={v.key}
                      onChange={(e) => patchVariable(idx, { key: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      placeholder="value"
                      value={v.value}
                      onChange={(e) => patchVariable(idx, { value: e.target.value })}
                      className="flex-1"
                    />
                    <button
                      onClick={() => removeVariable(idx)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
                      aria-label="Remove variable"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addVariable}
                className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm text-[var(--sidebar-active-fg)] hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add variable
              </button>
            </div>
          </div>

          {/* Section tabs */}
          <div className="mt-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Section tabs</h2>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => setTabOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" /> Add tab
              </Button>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60">
                  <tr>
                    <Th>Label</Th>
                    <Th>Slug</Th>
                    <Th>Dashboard Id</Th>
                    <Th>Looker Id</Th>
                    <Th>Filter Set</Th>
                    <Th>Panels</Th>
                    <Th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {section.tabs.length === 0 ? (
                    <tr>
                      <Td className="text-muted-foreground">
                        <span className="block py-2">There are no data</span>
                      </Td>
                      <Td />
                      <Td />
                      <Td />
                      <Td />
                      <Td />
                      <Td />
                    </tr>
                  ) : (
                    section.tabs.map((t) => (
                      <tr key={t.id} className="border-t border-border hover:bg-secondary/40">
                        <Td className="text-foreground/90">{t.label}</Td>
                        <Td className="text-foreground/80">{t.slug}</Td>
                        <Td className="text-muted-foreground">{t.dashboardId}</Td>
                        <Td className="text-muted-foreground">{t.lookerId || "-"}</Td>
                        <Td className="text-muted-foreground">{t.filterSet}</Td>
                        <Td className="text-muted-foreground">{t.panels.length}</Td>
                        <Td>
                          <button
                            onClick={() =>
                              patchSection({ tabs: section.tabs.filter((x) => x.id !== t.id) })
                            }
                            className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                            aria-label={`Delete ${t.label}`}
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
            <Pagination total={section.tabs.length} />
          </div>
        </div>
      </div>

      <AddTabDialog open={tabOpen} onOpenChange={setTabOpen} onSave={addTab} />
    </AppShell>
  );
}
