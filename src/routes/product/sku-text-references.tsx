import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-text-references")({
  head: () => ({ meta: [{ title: "Sku text references — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["sku-text-references"]} />,
});
