import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-retailer-image-references/new")({
  head: () => ({ meta: [{ title: "Add Sku retailer image references — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["sku-retailer-image-references"]} editBase={"/product/sku-retailer-image-references"} isNew />,
});
