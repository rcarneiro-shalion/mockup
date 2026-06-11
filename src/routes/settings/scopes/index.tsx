import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/settings/scopes/")({
  head: () => ({ meta: [{ title: "Scopes — Shalion" }] }),
  component: () => <EntityListPage spec={SPECS["settings-scopes"]} editBase={"/settings/scopes"} />,
});
