import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/product/store-skus")({
  component: () => <PlaceholderPage title="Store skus" />,
});
