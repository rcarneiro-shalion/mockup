import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { CountryGroupForm } from "@/components/settings/CountryGroupForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { COUNTRY_GROUPS_KEY, INITIAL_COUNTRY_GROUPS, type CountryGroup } from "@/lib/settings";

export const Route = createFileRoute("/settings/country-groups/$groupId")({
  head: () => ({ meta: [{ title: "Edit country group — Shalion" }] }),
  component: EditCountryGroupPage,
});

function EditCountryGroupPage() {
  const { groupId } = Route.useParams();
  const [groups, setGroups] = usePersistentState<CountryGroup[]>(COUNTRY_GROUPS_KEY, INITIAL_COUNTRY_GROUPS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/settings/country-groups" });

  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">Country group not found.</p>
          <Button variant="outline" onClick={goBack}>Back to Country groups</Button>
        </div>
      </AppShell>
    );
  }

  return <CountryGroupForm group={group} setGroups={setGroups} onCancel={goBack} />;
}
