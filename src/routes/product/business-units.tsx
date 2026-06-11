import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/product/business-units")({
  component: () => <PlaceholderPage title="Business units" />,
});
