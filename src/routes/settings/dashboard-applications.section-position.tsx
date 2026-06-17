import { createFileRoute } from "@tanstack/react-router";
import { SectionPositionPage } from "@/components/settings/SectionPositionPage";

export const Route = createFileRoute("/settings/dashboard-applications/section-position")({
  head: () => ({ meta: [{ title: "Section position · Shalion" }] }),
  component: SectionPositionPage,
});
