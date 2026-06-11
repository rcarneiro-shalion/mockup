import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/outputs/data-types/new")({
  head: () => ({ meta: [{ title: "Add Data types — Shalion" }] }),
  component: () => <EntityEditPage spec={DC_SPECS["dc-data-types"]} editBase={"/data-collector/outputs/data-types"} isNew />,
});
