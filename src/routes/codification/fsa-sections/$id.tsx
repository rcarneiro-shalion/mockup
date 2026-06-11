import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/fsa-sections/$id")({
  head: () => ({ meta: [{ title: "Edit FSA sections — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["fsa-sections"]} editBase={"/codification/fsa-sections"} rowId={id} />;
}
