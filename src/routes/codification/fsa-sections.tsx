import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/fsa-sections")({
  head: () => ({ meta: [{ title: "FSA sections — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["fsa-sections"]} />,
});
