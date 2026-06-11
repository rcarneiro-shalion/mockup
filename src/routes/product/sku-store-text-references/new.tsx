import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-store-text-references/new")({
  head: () => ({ meta: [{ title: "Add Sku store text references — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["sku-store-text-references"]} editBase={"/product/sku-store-text-references"} isNew />,
});
