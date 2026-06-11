import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/value-propositions/$id")({
  head: () => ({ meta: [{ title: "Edit Value propositions — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["value-propositions"]} editBase={"/codification/value-propositions"} rowId={id} />;
}
