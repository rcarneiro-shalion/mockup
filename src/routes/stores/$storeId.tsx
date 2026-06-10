import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { StoreForm } from "@/components/retailers/StoreForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { STORES_KEY, INITIAL_STORES, type Store } from "@/lib/retailers";
import { nowStamp } from "@/lib/clients";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/stores/$storeId")({
  head: () => ({ meta: [{ title: "Edit store — Shalion" }] }),
  component: EditStorePage,
});

function EditStorePage() {
  const { storeId } = useParams({ from: "/stores/$storeId" });
  const [rows, setRows] = usePersistentState<Store[]>(STORES_KEY, INITIAL_STORES);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/stores" });
  const s = rows.find((x) => x.id === storeId);

  if (!s) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">Store not found.</p>
          <Button variant="outline" onClick={goBack}>Back to Stores</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <StoreForm
      mode="edit"
      initial={s}
      onCancel={goBack}
      onSave={(updated) => { setRows((p) => p.map((x) => (x.id === storeId ? { ...updated, updatedAt: nowStamp() } : x))); goBack(); }}
      onDelete={() => { setRows((p) => p.filter((x) => x.id !== storeId)); goBack(); }}
    />
  );
}
