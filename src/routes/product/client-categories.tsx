import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/product/client-categories")({
  component: () => <PlaceholderPage title="Client categories" />,
});
