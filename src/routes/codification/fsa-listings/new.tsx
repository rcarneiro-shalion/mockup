import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/fsa-listings/new")({
  head: () => ({ meta: [{ title: "Add FSA listings — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["fsa-listings"]} editBase={"/codification/fsa-listings"} isNew />,
});
