import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/bulk")({
  component: () => <PlaceholderPage title="Bulk" />,
});
