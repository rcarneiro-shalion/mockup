import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/codification/manufacturers")({
  component: () => <PlaceholderPage title="Manufacturers" />,
});
