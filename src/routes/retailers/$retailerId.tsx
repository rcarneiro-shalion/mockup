import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { RetailerForm } from "@/components/retailers/RetailerForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { RETAILERS_KEY, INITIAL_RETAILERS, deriveStoreRetailers, type Retailer } from "@/lib/retailers";
import { nowStamp } from "@/lib/clients";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/retailers/$retailerId")({
  head: () => ({ meta: [{ title: "Edit retailer — Shalion" }] }),
  component: EditRetailerPage,
});

function EditRetailerPage() {
  const { retailerId } = useParams({ from: "/retailers/$retailerId" });
  const [rows, setRows] = usePersistentState<Retailer[]>(RETAILERS_KEY, INITIAL_RETAILERS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/retailers" });
  // Include store-derived retailers so a retailer that only exists via a store still resolves.
  const r = rows.find((x) => x.id === retailerId) ?? deriveStoreRetailers(rows).find((x) => x.id === retailerId);

  if (!r) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">Retailer not found.</p>
          <Button variant="outline" onClick={goBack}>Back to Retailers</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <RetailerForm
      mode="edit"
      initial={r}
      onCancel={goBack}
      onSave={(updated) => {
        setRows((p) =>
          p.some((x) => x.id === retailerId)
            ? p.map((x) => (x.id === retailerId ? { ...updated, updatedAt: nowStamp() } : x))
            : [...p, { ...updated, updatedAt: nowStamp() }], // first save of a store-derived retailer
        );
        goBack();
      }}
      onDelete={() => { setRows((p) => p.filter((x) => x.id !== retailerId)); goBack(); }}
    />
  );
}
