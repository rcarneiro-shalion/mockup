import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/tasks/seeds/new")({
  head: () => ({ meta: [{ title: "Add Seeds — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["tasks-seeds"]} editBase={"/tasks/seeds"} isNew />,
});
