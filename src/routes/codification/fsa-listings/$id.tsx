import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/fsa-listings/$id")({
  head: () => ({ meta: [{ title: "Edit FSA listings — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["fsa-listings"]} editBase={"/codification/fsa-listings"} rowId={id} />;
}
