import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/sku-rpcs/")({
  head: () => ({ meta: [{ title: "Sku rpcs — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["sku-rpcs"]} editBase={"/product/sku-rpcs"} />,
});
