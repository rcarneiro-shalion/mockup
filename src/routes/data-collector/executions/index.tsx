import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/executions/")({
  head: () => ({ meta: [{ title: "Executions — Shalion" }] }),
  component: () => <EntityListPage spec={DC_SPECS["dc-executions"]} editBase={"/data-collector/executions"} />,
});
