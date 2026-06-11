import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/business-units/new")({
  head: () => ({ meta: [{ title: "Add Business units — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["business-units"]} editBase={"/product/business-units"} isNew />,
});
