import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StoreForm } from "@/components/retailers/StoreForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { STORES_KEY, INITIAL_STORES, emptyStore, type Store } from "@/lib/retailers";

export const Route = createFileRoute("/stores/new")({
  head: () => ({ meta: [{ title: "Add store — Shalion" }] }),
  component: AddStorePage,
});

function AddStorePage() {
  const [, setRows] = usePersistentState<Store[]>(STORES_KEY, INITIAL_STORES);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/stores" });
  return <StoreForm mode="add" initial={emptyStore()} onCancel={goBack} onSave={(s) => { setRows((p) => [...p, s]); goBack(); }} />;
}
