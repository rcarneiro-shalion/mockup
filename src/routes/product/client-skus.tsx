import { createFileRoute } from "@tanstack/react-router";
import { ClientSkuEditPage } from "@/components/product/ClientSkuEditPage";

export const Route = createFileRoute("/product/client-skus")({
  head: () => ({ meta: [{ title: "Client SKUs — Shalion" }] }),
  component: ClientSkuEditPage,
});
