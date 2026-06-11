import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/bulk/new")({
  head: () => ({ meta: [{ title: "Add Bulk — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["bulk"]} editBase={"/bulk"} isNew />,
});
