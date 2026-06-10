import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RegionSystemForm } from "@/components/retailers/RegionSystemForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { REGION_SYSTEMS_KEY, INITIAL_REGION_SYSTEMS, emptyRegionSystem, type RegionSystem } from "@/lib/retailers";

export const Route = createFileRoute("/region-systems/new")({
  head: () => ({ meta: [{ title: "Add region system — Shalion" }] }),
  component: AddRegionSystemPage,
});

function AddRegionSystemPage() {
  const [, setRows] = usePersistentState<RegionSystem[]>(REGION_SYSTEMS_KEY, INITIAL_REGION_SYSTEMS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/region-systems" });
  return <RegionSystemForm mode="add" initial={emptyRegionSystem()} onCancel={goBack} onSave={(r) => { setRows((p) => [...p, r]); goBack(); }} />;
}
