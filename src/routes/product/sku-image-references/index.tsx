import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-image-references/")({
  head: () => ({ meta: [{ title: "Sku images — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["sku-image-references"]} editBase={"/product/sku-image-references"} />,
});
