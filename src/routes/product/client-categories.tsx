import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/client-categories")({
  head: () => ({ meta: [{ title: "Client categories — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["client-categories"]} />,
});
