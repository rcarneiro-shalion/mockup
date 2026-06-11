import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/settings/cubes/new")({
  head: () => ({ meta: [{ title: "Add Cubes — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["settings-cubes"]} editBase={"/settings/cubes"} isNew />,
});
