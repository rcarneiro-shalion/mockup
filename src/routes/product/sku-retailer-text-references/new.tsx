import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-retailer-text-references/new")({
  head: () => ({ meta: [{ title: "Add Sku retailer text references — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["sku-retailer-text-references"]} editBase={"/product/sku-retailer-text-references"} isNew />,
});
