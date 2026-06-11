import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/codification/data-variables/$id")({
  head: () => ({ meta: [{ title: "Edit Data variables — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={SPECS["data-variables"]} editBase={"/codification/data-variables"} rowId={id} />;
}
