import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/retailers")({
  component: () => <PlaceholderPage title="Retailers" addLabel="Add retailer" />,
});
