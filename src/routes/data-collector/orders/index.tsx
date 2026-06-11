import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/orders/")({
  head: () => ({ meta: [{ title: "Orders — Shalion" }] }),
  component: () => <EntityListPage spec={DC_SPECS["dc-orders"]} editBase={"/data-collector/orders"} />,
});
