import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-text-references/new")({
  head: () => ({ meta: [{ title: "Add Sku text references — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["sku-text-references"]} editBase={"/product/sku-text-references"} isNew />,
});
