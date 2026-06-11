import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/settings/error-indicators/$id")({
  head: () => ({ meta: [{ title: "Edit Error indicators — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={DC_SPECS["dc-error-indicators"]} editBase={"/data-collector/settings/error-indicators"} rowId={id} />;
}
