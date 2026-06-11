import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-retailer-text-references/")({
  head: () => ({ meta: [{ title: "Sku retailer text references — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["sku-retailer-text-references"]} editBase={"/product/sku-retailer-text-references"} />,
});
