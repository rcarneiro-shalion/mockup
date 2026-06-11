import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/settings/proxies/accounts/new")({
  head: () => ({ meta: [{ title: "Add Proxy accounts — Shalion" }] }),
  component: () => <EntityEditPage spec={DC_SPECS["dc-proxy-accounts"]} editBase={"/data-collector/settings/proxies/accounts"} isNew />,
});
