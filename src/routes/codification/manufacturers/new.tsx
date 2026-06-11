import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/manufacturers/new")({
  head: () => ({ meta: [{ title: "Add Manufacturers — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["manufacturers"]} editBase={"/codification/manufacturers"} isNew />,
});
