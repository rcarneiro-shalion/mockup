import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/ads/new")({
  head: () => ({ meta: [{ title: "Add All ads — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["ads"]} editBase={"/codification/ads"} isNew />,
});
