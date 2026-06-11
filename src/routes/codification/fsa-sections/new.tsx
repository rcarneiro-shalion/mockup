import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/fsa-sections/new")({
  head: () => ({ meta: [{ title: "Add FSA sections — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["fsa-sections"]} editBase={"/codification/fsa-sections"} isNew />,
});
