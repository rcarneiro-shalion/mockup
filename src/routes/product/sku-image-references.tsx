import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/product/sku-image-references")({
  component: () => <PlaceholderPage title="Sku image references" />,
});
