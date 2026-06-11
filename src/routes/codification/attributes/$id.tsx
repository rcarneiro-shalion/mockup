import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/attributes/$id")({
  head: () => ({ meta: [{ title: "Edit Attributes — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["attributes"]} editBase={"/codification/attributes"} rowId={id} />;
}
