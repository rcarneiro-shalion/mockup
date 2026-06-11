import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/projects/tags/new")({
  head: () => ({ meta: [{ title: "Add Tags — Shalion" }] }),
  component: () => <EntityEditPage spec={DC_SPECS["dc-tags"]} editBase={"/data-collector/projects/tags"} isNew />,
});
