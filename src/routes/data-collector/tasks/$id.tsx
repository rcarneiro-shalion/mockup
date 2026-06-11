import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/tasks/$id")({
  head: () => ({ meta: [{ title: "Edit Tasks — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={DC_SPECS["dc-tasks"]} editBase={"/data-collector/tasks"} rowId={id} />;
}
