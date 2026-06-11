import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/product/sku-store-text-references")({
  component: () => <PlaceholderPage title="Sku store text references" />,
});
