import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/settings/scopes/new")({
  head: () => ({ meta: [{ title: "Add Scopes — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["settings-scopes"]} editBase={"/settings/scopes"} isNew />,
});
