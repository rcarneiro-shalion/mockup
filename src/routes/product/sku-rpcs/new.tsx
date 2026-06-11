import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-rpcs/new")({
  head: () => ({ meta: [{ title: "Add Sku rpcs — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["sku-rpcs"]} editBase={"/product/sku-rpcs"} isNew />,
});
