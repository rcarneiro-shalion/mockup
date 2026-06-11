import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout for the /settings/country-groups segment — renders the index (list)
// route or the nested $groupId (edit) route via the Outlet.
export const Route = createFileRoute("/settings/country-groups")({
  component: () => <Outlet />,
});
