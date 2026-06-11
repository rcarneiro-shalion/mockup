import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-retailer-image-references/$id")({
  head: () => ({ meta: [{ title: "Edit Sku retailer image references — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["sku-retailer-image-references"]} editBase={"/product/sku-retailer-image-references"} rowId={id} />;
}
