import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/settings/error-indicators/new")({
  head: () => ({ meta: [{ title: "Add Error indicators — Shalion" }] }),
  component: () => <EntityEditPage spec={DC_SPECS["dc-error-indicators"]} editBase={"/data-collector/settings/error-indicators"} isNew />,
});
