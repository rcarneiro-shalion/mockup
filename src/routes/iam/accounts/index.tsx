import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { IAM_SPECS } from "@/lib/iamEntities";

export const Route = createFileRoute("/iam/accounts/")({
  head: () => ({ meta: [{ title: "Accounts — Shalion" }] }),
  component: () => <EntityListPage spec={IAM_SPECS["iam-accounts"]} editBase={"/iam/accounts"} />,
});
