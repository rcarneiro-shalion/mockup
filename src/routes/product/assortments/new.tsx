import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/assortments/new")({
  head: () => ({ meta: [{ title: "Add Assortments — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["assortments"]} editBase={"/product/assortments"} isNew />,
});
