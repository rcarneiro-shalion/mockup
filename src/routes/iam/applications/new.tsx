import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { IAM_SPECS } from "@/lib/iamEntities";

export const Route = createFileRoute("/iam/applications/new")({
  head: () => ({ meta: [{ title: "Add Applications — Shalion" }] }),
  component: () => <EntityEditPage spec={IAM_SPECS["iam-applications"]} editBase={"/iam/applications"} isNew />,
});
