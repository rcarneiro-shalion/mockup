import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/templates/")({
  head: () => ({ meta: [{ title: "Templates — Shalion" }] }),
  component: () => <EntityListPage spec={DC_SPECS["dc-templates"]} editBase={"/data-collector/templates"} />,
});
