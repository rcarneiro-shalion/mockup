import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/manufacturers/")({
  head: () => ({ meta: [{ title: "Manufacturers — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["manufacturers"]} editBase={"/codification/manufacturers"} />,
});
