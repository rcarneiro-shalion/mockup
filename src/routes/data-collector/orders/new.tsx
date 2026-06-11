import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/orders/new")({
  head: () => ({ meta: [{ title: "Add Orders — Shalion" }] }),
  component: () => <EntityEditPage spec={DC_SPECS["dc-orders"]} editBase={"/data-collector/orders"} isNew />,
});
