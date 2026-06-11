import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/settings/error-indicators/")({
  head: () => ({ meta: [{ title: "Error indicators — Shalion" }] }),
  component: () => <EntityListPage spec={DC_SPECS["dc-error-indicators"]} editBase={"/data-collector/settings/error-indicators"} />,
});
