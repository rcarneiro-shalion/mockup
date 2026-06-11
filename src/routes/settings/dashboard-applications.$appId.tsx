import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout for the /settings/dashboard-applications/$appId segment — renders the
// app-edit index route or the nested groups/$groupId edit routes via the Outlet.
export const Route = createFileRoute("/settings/dashboard-applications/$appId")({
  component: () => <Outlet />,
});
