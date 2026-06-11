import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/data-variables/")({
  head: () => ({ meta: [{ title: "Data variables — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["data-variables"]} editBase={"/codification/data-variables"} />,
});
