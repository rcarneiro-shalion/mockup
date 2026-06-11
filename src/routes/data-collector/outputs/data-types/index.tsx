import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/outputs/data-types/")({
  head: () => ({ meta: [{ title: "Data types — Shalion" }] }),
  component: () => <EntityListPage spec={DC_SPECS["dc-data-types"]} editBase={"/data-collector/outputs/data-types"} />,
});
