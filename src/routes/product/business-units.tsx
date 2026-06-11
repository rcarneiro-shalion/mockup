import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/business-units")({
  head: () => ({ meta: [{ title: "Business units — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["business-units"]} />,
});
