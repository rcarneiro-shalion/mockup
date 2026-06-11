import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/product/sku-store-image-references")({
  component: () => <PlaceholderPage title="Sku store image references" />,
});
