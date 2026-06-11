import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/tasks/jobs/$id")({
  head: () => ({ meta: [{ title: "Edit Jobs — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["tasks-jobs"]} editBase={"/tasks/jobs"} rowId={id} />;
}
