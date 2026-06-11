import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-store-image-references/")({
  head: () => ({ meta: [{ title: "Sku store image references — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["sku-store-image-references"]} editBase={"/product/sku-store-image-references"} />,
});
