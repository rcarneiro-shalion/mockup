import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { IAM_SPECS } from "@/lib/iamEntities";

export const Route = createFileRoute("/iam/applications/$id")({
  head: () => ({ meta: [{ title: "Edit Applications — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={IAM_SPECS["iam-applications"]} editBase={"/iam/applications"} rowId={id} />;
}
