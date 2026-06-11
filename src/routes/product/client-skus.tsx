import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout for the /product/client-skus segment — renders the listing (index)
// route or the nested $skuId edit/detail route via the Outlet.
export const Route = createFileRoute("/product/client-skus")({
  head: () => ({ meta: [{ title: "Client SKUs — Shalion" }] }),
  component: () => <Outlet />,
});
