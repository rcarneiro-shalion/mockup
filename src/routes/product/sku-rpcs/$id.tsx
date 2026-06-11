import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-rpcs/$id")({
  head: () => ({ meta: [{ title: "Edit Sku rpcs — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["sku-rpcs"]} editBase={"/product/sku-rpcs"} rowId={id} />;
}
