import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/value-propositions/new")({
  head: () => ({ meta: [{ title: "Add Value propositions — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["value-propositions"]} editBase={"/codification/value-propositions"} isNew />,
});
