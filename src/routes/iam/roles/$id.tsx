import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { IAM_SPECS } from "@/lib/iamEntities";

export const Route = createFileRoute("/iam/roles/$id")({
  head: () => ({ meta: [{ title: "Edit Roles / Persona — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={IAM_SPECS["iam-roles"]} editBase={"/iam/roles"} rowId={id} />;
}
