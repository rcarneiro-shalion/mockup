import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/templates/new")({
  head: () => ({ meta: [{ title: "Add Templates — Shalion" }] }),
  component: () => <EntityEditPage spec={DC_SPECS["dc-templates"]} editBase={"/data-collector/templates"} isNew />,
});
