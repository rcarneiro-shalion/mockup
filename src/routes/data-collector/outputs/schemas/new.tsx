import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/outputs/schemas/new")({
  head: () => ({ meta: [{ title: "Add Output schemas — Shalion" }] }),
  component: () => <EntityEditPage spec={DC_SPECS["dc-output-schemas"]} editBase={"/data-collector/outputs/schemas"} isNew />,
});
