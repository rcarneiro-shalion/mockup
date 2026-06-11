import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/settings/proxies/providers/")({
  head: () => ({ meta: [{ title: "Proxy providers — Shalion" }] }),
  component: () => <EntityListPage spec={DC_SPECS["dc-proxy-providers"]} editBase={"/data-collector/settings/proxies/providers"} />,
});
