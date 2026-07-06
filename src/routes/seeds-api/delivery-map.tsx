import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SeedsDeliveryMap } from "@/components/seeds/SeedsDeliveryMap";

export const Route = createFileRoute("/seeds-api/delivery-map")({
  head: () => ({ meta: [{ title: "Delivery map — Shalion" }] }),
  component: DeliveryMapPage,
});

function DeliveryMapPage() {
  return (
    <AppShell>
      <SeedsDeliveryMap />
    </AppShell>
  );
}
