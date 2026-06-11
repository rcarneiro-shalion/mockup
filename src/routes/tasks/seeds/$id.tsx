import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/tasks/seeds/$id")({
  head: () => ({ meta: [{ title: "Edit Seeds — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["tasks-seeds"]} editBase={"/tasks/seeds"} rowId={id} />;
}
