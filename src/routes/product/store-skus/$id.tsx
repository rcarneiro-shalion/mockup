import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/store-skus/$id")({
  head: () => ({ meta: [{ title: "Edit Store skus — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["store-skus"]} editBase={"/product/store-skus"} rowId={id} />;
}
