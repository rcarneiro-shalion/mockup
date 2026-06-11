import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { IAM_SPECS } from "@/lib/iamEntities";

export const Route = createFileRoute("/iam/applications/")({
  head: () => ({ meta: [{ title: "Applications — Shalion" }] }),
  component: () => <EntityListPage spec={IAM_SPECS["iam-applications"]} editBase={"/iam/applications"} />,
});
