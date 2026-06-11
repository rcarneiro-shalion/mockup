import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-store-image-references/new")({
  head: () => ({ meta: [{ title: "Add Sku store image references — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["sku-store-image-references"]} editBase={"/product/sku-store-image-references"} isNew />,
});
