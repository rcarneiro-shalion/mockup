import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { RegionSystemForm } from "@/components/retailers/RegionSystemForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { REGION_SYSTEMS_KEY, INITIAL_REGION_SYSTEMS, type RegionSystem } from "@/lib/retailers";
import { nowStamp } from "@/lib/clients";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/region-systems/$regionId")({
  head: () => ({ meta: [{ title: "Edit region system — Shalion" }] }),
  component: EditRegionSystemPage,
});

function EditRegionSystemPage() {
  const { regionId } = useParams({ from: "/region-systems/$regionId" });
  const [rows, setRows] = usePersistentState<RegionSystem[]>(REGION_SYSTEMS_KEY, INITIAL_REGION_SYSTEMS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/region-systems" });
  const r = rows.find((x) => x.id === regionId);

  if (!r) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">Region system not found.</p>
          <Button variant="outline" onClick={goBack}>Back to Region systems</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <RegionSystemForm
      mode="edit"
      initial={r}
      onCancel={goBack}
      onSave={(updated) => { setRows((p) => p.map((x) => (x.id === regionId ? { ...updated, updatedAt: nowStamp() } : x))); goBack(); }}
      onDelete={() => { setRows((p) => p.filter((x) => x.id !== regionId)); goBack(); }}
    />
  );
}
