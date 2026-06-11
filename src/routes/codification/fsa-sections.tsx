import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/codification/fsa-sections")({
  component: () => <PlaceholderPage title="FSA section" />,
});
