import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/projects/tags/")({
  head: () => ({ meta: [{ title: "Tags — Shalion" }] }),
  component: () => <EntityListPage spec={DC_SPECS["dc-tags"]} editBase={"/data-collector/projects/tags"} />,
});
