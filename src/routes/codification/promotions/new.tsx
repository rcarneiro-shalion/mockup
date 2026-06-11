import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/promotions/new")({
  head: () => ({ meta: [{ title: "Add Promotions — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["promotions"]} editBase={"/codification/promotions"} isNew />,
});
