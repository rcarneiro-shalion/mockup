import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/product/sku-rpcs")({
  component: () => <PlaceholderPage title="Sku rpcs" />,
});
