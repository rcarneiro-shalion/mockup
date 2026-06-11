import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BrandForm } from "@/components/codification/BrandForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { BRANDS_KEY, INITIAL_BRANDS, emptyBrand, type Brand } from "@/lib/brands";

export const Route = createFileRoute("/codification/brands/new")({
  head: () => ({ meta: [{ title: "Add brand — Shalion" }] }),
  component: AddBrandPage,
});

function AddBrandPage() {
  const [, setRows] = usePersistentState<Brand[]>(BRANDS_KEY, INITIAL_BRANDS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/codification/brands" });
  return (
    <BrandForm
      mode="add"
      initial={emptyBrand()}
      onCancel={goBack}
      onSave={(b) => {
        setRows((p) => [b, ...p]);
        goBack();
      }}
    />
  );
}
