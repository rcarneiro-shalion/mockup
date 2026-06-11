import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/projects/new")({
  head: () => ({ meta: [{ title: "Add Projects — Shalion" }] }),
  component: () => <EntityEditPage spec={DC_SPECS["dc-projects"]} editBase={"/data-collector/projects"} isNew />,
});
