import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/outputs/schemas/")({
  head: () => ({ meta: [{ title: "Output schemas — Shalion" }] }),
  component: () => <EntityListPage spec={DC_SPECS["dc-output-schemas"]} editBase={"/data-collector/outputs/schemas"} />,
});
