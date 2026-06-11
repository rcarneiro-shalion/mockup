import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { IAM_SPECS } from "@/lib/iamEntities";

export const Route = createFileRoute("/iam/roles/")({
  head: () => ({ meta: [{ title: "Roles / Persona — Shalion" }] }),
  component: () => <EntityListPage spec={IAM_SPECS["iam-roles"]} editBase={"/iam/roles"} />,
});
