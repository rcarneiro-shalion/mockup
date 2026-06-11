import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/projects/")({
  head: () => ({ meta: [{ title: "Projects — Shalion" }] }),
  component: () => <EntityListPage spec={DC_SPECS["dc-projects"]} editBase={"/data-collector/projects"} />,
});
