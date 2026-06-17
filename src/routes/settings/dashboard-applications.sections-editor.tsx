import { createFileRoute } from "@tanstack/react-router";
import { SectionsGridPage } from "@/components/settings/SectionsGridPage";

export const Route = createFileRoute("/settings/dashboard-applications/sections-editor")({
  head: () => ({ meta: [{ title: "Dashboard sections — bulk edit · Shalion" }] }),
  component: SectionsGridPage,
});
