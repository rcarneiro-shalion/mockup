import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/bulk/")({
  head: () => ({ meta: [{ title: "Bulk — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["bulk"]} editBase={"/bulk"} />,
});
