import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/codification/value-propositions")({
  component: () => <PlaceholderPage title="Value propositions" />,
});
