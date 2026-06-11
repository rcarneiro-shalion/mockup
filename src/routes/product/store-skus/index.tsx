import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/store-skus/")({
  head: () => ({ meta: [{ title: "Store skus — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["store-skus"]} editBase={"/product/store-skus"} />,
});
