import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/tasks/projects/")({
  head: () => ({ meta: [{ title: "Projects — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["tasks-projects"]} editBase={"/tasks/projects"} />,
});
