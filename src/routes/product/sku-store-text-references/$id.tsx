import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-store-text-references/$id")({
  head: () => ({ meta: [{ title: "Edit Sku store text references — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["sku-store-text-references"]} editBase={"/product/sku-store-text-references"} rowId={id} />;
}
