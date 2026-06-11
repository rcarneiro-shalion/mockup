import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/product/sku-retailer-text-references")({
  component: () => <PlaceholderPage title="Sku retailer text references" />,
});
