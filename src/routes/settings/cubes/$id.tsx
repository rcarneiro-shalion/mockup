import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/settings/cubes/$id")({
  head: () => ({ meta: [{ title: "Edit Cubes — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["settings-cubes"]} editBase={"/settings/cubes"} rowId={id} />;
}
