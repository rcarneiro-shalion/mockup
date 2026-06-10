import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RetailerForm } from "@/components/retailers/RetailerForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { RETAILERS_KEY, INITIAL_RETAILERS, emptyRetailer, type Retailer } from "@/lib/retailers";

export const Route = createFileRoute("/retailers/new")({
  head: () => ({ meta: [{ title: "Add retailer — Shalion" }] }),
  component: AddRetailerPage,
});

function AddRetailerPage() {
  const [, setRows] = usePersistentState<Retailer[]>(RETAILERS_KEY, INITIAL_RETAILERS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/retailers" });
  return (
    <RetailerForm mode="add" initial={emptyRetailer()} onCancel={goBack} onSave={(r) => { setRows((p) => [...p, r]); goBack(); }} />
  );
}
