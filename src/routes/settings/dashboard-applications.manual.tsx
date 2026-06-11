import { createFileRoute } from "@tanstack/react-router";
import { DashboardManual } from "@/components/settings/DashboardManual";

export const Route = createFileRoute("/settings/dashboard-applications/manual")({
  head: () => ({ meta: [{ title: "Dashboard manual — Shalion" }] }),
  component: DashboardManual,
});
