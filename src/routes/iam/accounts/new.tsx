import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { IAM_SPECS } from "@/lib/iamEntities";

export const Route = createFileRoute("/iam/accounts/new")({
  head: () => ({ meta: [{ title: "Add Accounts — Shalion" }] }),
  component: () => <EntityEditPage spec={IAM_SPECS["iam-accounts"]} editBase={"/iam/accounts"} isNew />,
});
