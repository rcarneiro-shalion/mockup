import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-store-image-references/$id")({
  head: () => ({ meta: [{ title: "Edit Sku store image references — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["sku-store-image-references"]} editBase={"/product/sku-store-image-references"} rowId={id} />;
}
