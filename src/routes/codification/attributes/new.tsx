import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/attributes/new")({
  head: () => ({ meta: [{ title: "Add Attributes — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["attributes"]} editBase={"/codification/attributes"} isNew />,
});
