import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/listings/new")({
  head: () => ({ meta: [{ title: "Add All listings — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["listings"]} editBase={"/codification/listings"} isNew />,
});
