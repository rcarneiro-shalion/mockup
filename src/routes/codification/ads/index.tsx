import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/ads/")({
  head: () => ({ meta: [{ title: "All ads — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["ads"]} editBase={"/codification/ads"} />,
});
