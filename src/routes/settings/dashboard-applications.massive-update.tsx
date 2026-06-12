import { createFileRoute } from "@tanstack/react-router";
import { MassiveUpdatePage } from "@/components/settings/MassiveUpdatePage";

export const Route = createFileRoute("/settings/dashboard-applications/massive-update")({
  head: () => ({ meta: [{ title: "Massive update — Shalion" }] }),
  component: MassiveUpdatePage,
});
