import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClientForm } from "@/components/clients/ClientForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { CLIENTS_KEY, INITIAL_CLIENTS, nowStamp, type Client } from "@/lib/clients";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/clients/$clientId/")({
  head: () => ({ meta: [{ title: "Edit client — Shalion" }] }),
  component: EditClientPage,
});

function EditClientPage() {
  const { clientId } = Route.useParams();
  const [clients, setClients] = usePersistentState<Client[]>(CLIENTS_KEY, INITIAL_CLIENTS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/clients" });

  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">Client not found.</p>
          <Button variant="outline" onClick={goBack}>Back to Clients</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <ClientForm
      mode="edit"
      initial={client}
      onCancel={goBack}
      onSave={(updated) => {
        setClients((prev) =>
          prev.map((c) => (c.id === clientId ? { ...updated, updatedAt: nowStamp() } : c)),
        );
        goBack();
      }}
      onDelete={() => {
        setClients((prev) => prev.filter((c) => c.id !== clientId));
        goBack();
      }}
    />
  );
}
