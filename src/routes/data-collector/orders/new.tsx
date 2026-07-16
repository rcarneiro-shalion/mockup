import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "@/components/data-collector/OrderForm";

export const Route = createFileRoute("/data-collector/orders/new")({
  head: () => ({ meta: [{ title: "Add order — Shalion" }] }),
  component: () => <OrderForm isNew />,
});
