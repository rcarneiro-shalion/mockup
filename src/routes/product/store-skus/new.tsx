import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/store-skus/new")({
  head: () => ({ meta: [{ title: "Add Store skus — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["store-skus"]} editBase={"/product/store-skus"} isNew />,
});
