import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-image-references/$id")({
  head: () => ({ meta: [{ title: "Edit Sku images — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["sku-image-references"]} editBase={"/product/sku-image-references"} rowId={id} />;
}
