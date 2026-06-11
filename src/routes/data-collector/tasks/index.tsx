import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/tasks/")({
  head: () => ({ meta: [{ title: "Tasks — Shalion" }] }),
  component: () => <EntityListPage spec={DC_SPECS["dc-tasks"]} editBase={"/data-collector/tasks"} />,
});
