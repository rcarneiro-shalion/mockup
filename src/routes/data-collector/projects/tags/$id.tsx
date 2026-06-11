import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/projects/tags/$id")({
  head: () => ({ meta: [{ title: "Edit Tags — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={DC_SPECS["dc-tags"]} editBase={"/data-collector/projects/tags"} rowId={id} />;
}
