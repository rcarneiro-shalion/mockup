import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/tasks/jobs")({
  head: () => ({ meta: [{ title: "Jobs — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["tasks-jobs"]} />,
});
