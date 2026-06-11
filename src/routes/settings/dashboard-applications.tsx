import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout for the /settings/dashboard-applications segment — renders the list
// (index) route or the nested app/group/section edit routes via the Outlet.
export const Route = createFileRoute("/settings/dashboard-applications")({
  component: () => <Outlet />,
});
