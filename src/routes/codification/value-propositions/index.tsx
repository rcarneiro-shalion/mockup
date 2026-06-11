import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/value-propositions/")({
  head: () => ({ meta: [{ title: "Value propositions — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["value-propositions"]} editBase={"/codification/value-propositions"} />,
});
