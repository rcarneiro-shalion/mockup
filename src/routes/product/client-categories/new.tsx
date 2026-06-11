import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/product/client-categories/new")({
  head: () => ({ meta: [{ title: "Add Client categories — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["client-categories"]} editBase={"/product/client-categories"} isNew />,
});
