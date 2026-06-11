import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/settings/proxies/providers/$id")({
  head: () => ({ meta: [{ title: "Edit Proxy providers — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <EntityEditPage spec={DC_SPECS["dc-proxy-providers"]} editBase={"/data-collector/settings/proxies/providers"} rowId={id} />;
}
