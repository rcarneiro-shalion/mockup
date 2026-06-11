import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/client-categories/$id")({
  head: () => ({ meta: [{ title: "Edit Client categories — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["client-categories"]} editBase={"/product/client-categories"} rowId={id} />;
}
