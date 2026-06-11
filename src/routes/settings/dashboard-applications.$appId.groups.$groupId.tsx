import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout for the /settings/dashboard-applications/$appId/groups/$groupId
// segment — renders the group-edit index route or the nested
// sections/$sectionId edit route via the Outlet.
export const Route = createFileRoute(
  "/settings/dashboard-applications/$appId/groups/$groupId",
)({
  component: () => <Outlet />,
});
