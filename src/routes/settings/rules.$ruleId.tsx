import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RuleForm } from "@/components/settings/RuleForm";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { RULES_KEY, INITIAL_RULES, type SettingRule } from "@/lib/settings";

export const Route = createFileRoute("/settings/rules/$ruleId")({
  head: () => ({ meta: [{ title: "Edit rule — Shalion" }] }),
  component: EditRulePage,
});

function EditRulePage() {
  const { ruleId } = Route.useParams();
  const [rules] = usePersistentState<SettingRule[]>(RULES_KEY, INITIAL_RULES);
  const navigate = useNavigate();

  const rule = rules.find((r) => r.id === ruleId);

  if (!rule) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">Rule not found.</p>
          <Button variant="outline" onClick={() => navigate({ to: "/settings/rules" })}>
            Back to Rules
          </Button>
        </div>
      </AppShell>
    );
  }

  return <RuleForm mode="edit" initial={rule} />;
}
