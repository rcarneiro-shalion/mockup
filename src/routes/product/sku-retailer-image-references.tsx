import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-retailer-image-references")({
  head: () => ({ meta: [{ title: "Sku retailer image references — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["sku-retailer-image-references"]} />,
});
