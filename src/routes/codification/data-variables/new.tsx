import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/data-variables/new")({
  head: () => ({ meta: [{ title: "Add Data variables — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["data-variables"]} editBase={"/codification/data-variables"} isNew />,
});
