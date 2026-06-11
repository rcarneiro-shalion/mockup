import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/settings/scopes/$id")({
  head: () => ({ meta: [{ title: "Edit Scopes — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["settings-scopes"]} editBase={"/settings/scopes"} rowId={id} />;
}
