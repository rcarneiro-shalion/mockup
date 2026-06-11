import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/promotions")({
  head: () => ({ meta: [{ title: "Promotions — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["promotions"]} />,
});
