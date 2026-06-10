import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/clients")({
  component: () => <PlaceholderPage title="Clients" addLabel="Add client" />,
});
