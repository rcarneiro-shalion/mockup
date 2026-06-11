import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/executions/new")({
  head: () => ({ meta: [{ title: "Add Executions — Shalion" }] }),
  component: () => <EntityEditPage spec={DC_SPECS["dc-executions"]} editBase={"/data-collector/executions"} isNew />,
});
