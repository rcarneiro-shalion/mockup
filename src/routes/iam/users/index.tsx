import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { IAM_SPECS } from "@/lib/iamEntities";

export const Route = createFileRoute("/iam/users/")({
  head: () => ({ meta: [{ title: "Users — Shalion" }] }),
  component: () => <EntityListPage spec={IAM_SPECS["iam-users"]} editBase={"/iam/users"} />,
});
