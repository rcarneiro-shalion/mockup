import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const Route = createFileRoute("/tasks/seeds")({
  component: () => (
    <PlaceholderPage
      title="Seeds"
      notice="The Tasks section is being replaced by the new Seeds API. The migration is rolling out over the coming weeks — new configuration should be created in Seeds API."
    />
  ),
});
