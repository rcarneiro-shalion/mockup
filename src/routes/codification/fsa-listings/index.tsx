import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/fsa-listings/")({
  head: () => ({ meta: [{ title: "FSA listings — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["fsa-listings"]} editBase={"/codification/fsa-listings"} />,
});
