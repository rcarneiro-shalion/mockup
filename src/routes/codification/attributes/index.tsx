import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/attributes/")({
  head: () => ({ meta: [{ title: "Attributes — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["attributes"]} editBase={"/codification/attributes"} />,
});
