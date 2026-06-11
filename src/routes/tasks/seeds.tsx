import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/tasks/seeds")({
  head: () => ({ meta: [{ title: "Seeds — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["tasks-seeds"]} />,
});
