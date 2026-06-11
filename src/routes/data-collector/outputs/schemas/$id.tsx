import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/outputs/schemas/$id")({
  head: () => ({ meta: [{ title: "Edit Output schemas — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={DC_SPECS["dc-output-schemas"]} editBase={"/data-collector/outputs/schemas"} rowId={id} />;
}
