import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-retailer-text-references/$id")({
  head: () => ({ meta: [{ title: "Edit Sku retailer text references — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["sku-retailer-text-references"]} editBase={"/product/sku-retailer-text-references"} rowId={id} />;
}
