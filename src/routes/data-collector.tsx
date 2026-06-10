import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/data-collector")({
  component: () => <PlaceholderPage title="Data Collector" />,
});
