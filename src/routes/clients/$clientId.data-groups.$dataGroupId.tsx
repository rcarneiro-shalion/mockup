import { createFileRoute, useParams } from "@tanstack/react-router";
import { DataGroupPage } from "@/components/clients/DataGroupPage";
import { getClients } from "@/lib/clients";

export const Route = createFileRoute("/clients/$clientId/data-groups/$dataGroupId")({
  head: () => ({ meta: [{ title: "Data group — Shalion" }] }),
  component: DataGroupDetail,
});

function DataGroupDetail() {
  const { clientId, dataGroupId } = useParams({ from: "/clients/$clientId/data-groups/$dataGroupId" });
  const client = getClients().find((c) => c.id === clientId);
  const dg = client?.dataGroups?.find((g) => g.id === dataGroupId);
  return (
    <DataGroupPage
      clientId={clientId}
      clientName={client?.name ?? "Client"}
      initialName={dg?.name ?? "Data group"}
      dataGroupId={dataGroupId}
      initialDashboardType={dg?.dashboardType === "AGENCY" ? "Agency" : "Brand"}
    />
  );
}
