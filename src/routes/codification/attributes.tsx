import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/codification/attributes")({
  component: () => <PlaceholderPage title="Attributes" />,
});
