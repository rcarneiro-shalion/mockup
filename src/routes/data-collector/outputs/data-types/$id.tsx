import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/outputs/data-types/$id")({
  head: () => ({ meta: [{ title: "Edit Data types — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={DC_SPECS["dc-data-types"]} editBase={"/data-collector/outputs/data-types"} rowId={id} />;
}
