import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { BrandForm } from "@/components/codification/BrandForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { BRANDS_KEY, INITIAL_BRANDS, type Brand } from "@/lib/brands";
import { nowStamp } from "@/lib/clients";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/codification/brands/$brandId")({
  head: () => ({ meta: [{ title: "Edit brand — Shalion" }] }),
  component: EditBrandPage,
});

function EditBrandPage() {
  const { brandId } = useParams({ from: "/codification/brands/$brandId" });
  const [rows, setRows] = usePersistentState<Brand[]>(BRANDS_KEY, INITIAL_BRANDS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/codification/brands" });
  const brand = rows.find((x) => x.id === brandId);

  if (!brand) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">Brand not found.</p>
          <Button variant="outline" onClick={goBack}>
            Back to Brands
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <BrandForm
      mode="edit"
      initial={brand}
      onCancel={goBack}
      onSave={(updated) => {
        setRows((p) => p.map((x) => (x.id === brandId ? { ...updated, updatedAt: nowStamp() } : x)));
        goBack();
      }}
      onDelete={() => {
        setRows((p) => p.filter((x) => x.id !== brandId));
        goBack();
      }}
    />
  );
}
