import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/settings/cubes")({
  head: () => ({ meta: [{ title: "Cubes — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["settings-cubes"]} />,
});
