import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-image-references/new")({
  head: () => ({ meta: [{ title: "Add Sku images — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["sku-image-references"]} editBase={"/product/sku-image-references"} isNew />,
});
