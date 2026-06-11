import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-store-text-references/")({
  head: () => ({ meta: [{ title: "Sku store text references — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["sku-store-text-references"]} editBase={"/product/sku-store-text-references"} />,
});
