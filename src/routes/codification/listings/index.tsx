import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/listings/")({
  head: () => ({ meta: [{ title: "All listings — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["listings"]} editBase={"/codification/listings"} />,
});
