import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/tasks/jobs/new")({
  head: () => ({ meta: [{ title: "Add Jobs — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["tasks-jobs"]} editBase={"/tasks/jobs"} isNew />,
});
