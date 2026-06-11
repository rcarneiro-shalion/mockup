import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/tasks/projects/$id")({
  head: () => ({ meta: [{ title: "Edit Projects — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["tasks-projects"]} editBase={"/tasks/projects"} rowId={id} />;
}
