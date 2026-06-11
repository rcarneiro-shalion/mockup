import { createFileRoute, useParams } from "@tanstack/react-router";
import { DataGroupPage } from "@/components/clients/DataGroupPage";
import { getClients } from "@/lib/clients";

export const Route = createFileRoute("/clients/$clientId/data-groups/new")({
  head: () => ({ meta: [{ title: "Add data group — Shalion" }] }),
  component: AddDataGroup,
});

function AddDataGroup() {
  const { clientId } = useParams({ from: "/clients/$clientId/data-groups/new" });
  const client = getClients().find((c) => c.id === clientId);
  return <DataGroupPage clientId={clientId} clientName={client?.name ?? "Client"} initialName="" mode="add" />;
}
