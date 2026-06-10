import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClientForm } from "@/components/clients/ClientForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { CLIENTS_KEY, INITIAL_CLIENTS, emptyClient, type Client } from "@/lib/clients";

export const Route = createFileRoute("/clients/new")({
  head: () => ({ meta: [{ title: "Add client — Shalion" }] }),
  component: AddClientPage,
});

function AddClientPage() {
  const [, setClients] = usePersistentState<Client[]>(CLIENTS_KEY, INITIAL_CLIENTS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/clients" });

  return (
    <ClientForm
      mode="add"
      initial={emptyClient()}
      onCancel={goBack}
      onSave={(client) => {
        setClients((prev) => [...prev, client]);
        goBack();
      }}
    />
  );
}
