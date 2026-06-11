import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/common/EntityListPage";
import { DC_SPECS } from "@/lib/dataCollectorEntities";

export const Route = createFileRoute("/data-collector/settings/proxies/accounts/")({
  head: () => ({ meta: [{ title: "Proxy accounts — Shalion" }] }),
  component: () => <EntityListPage spec={DC_SPECS["dc-proxy-accounts"]} editBase={"/data-collector/settings/proxies/accounts"} />,
});
