import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-text-references/$id")({
  head: () => ({ meta: [{ title: "Edit Sku text references — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["sku-text-references"]} editBase={"/product/sku-text-references"} rowId={id} />;
}
