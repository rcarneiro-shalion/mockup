import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/assortments")({
  head: () => ({ meta: [{ title: "Assortments — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["assortments"]} />,
});
