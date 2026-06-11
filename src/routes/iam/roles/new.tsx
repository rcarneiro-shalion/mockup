import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { IAM_SPECS } from "@/lib/iamEntities";

export const Route = createFileRoute("/iam/roles/new")({
  head: () => ({ meta: [{ title: "Add Roles / Persona — Shalion" }] }),
  component: () => <EntityEditPage spec={IAM_SPECS["iam-roles"]} editBase={"/iam/roles"} isNew />,
});
