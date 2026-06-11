import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/promotions/$id")({
  head: () => ({ meta: [{ title: "Edit Promotions — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["promotions"]} editBase={"/codification/promotions"} rowId={id} />;
}
