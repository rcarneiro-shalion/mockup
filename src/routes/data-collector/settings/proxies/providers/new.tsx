import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/settings/proxies/providers/new")({
  head: () => ({ meta: [{ title: "Add Proxy providers — Shalion" }] }),
  component: () => <EntityEditPage spec={DC_SPECS["dc-proxy-providers"]} editBase={"/data-collector/settings/proxies/providers"} isNew />,
});
