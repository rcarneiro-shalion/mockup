import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "@/components/data-collector/OrderForm";

export const Route = createFileRoute("/data-collector/orders/$id")({
  head: () => ({ meta: [{ title: "Edit order — Shalion" }] }),
  component: EditComp,
});

function EditComp() {
  const { id } = Route.useParams();
  return <OrderForm rowId={id} />;
}
