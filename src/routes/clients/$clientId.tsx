import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout for the /clients/$clientId segment — renders the index (edit) route or
// nested routes (e.g. data-groups/$dataGroupId) via the Outlet.
export const Route = createFileRoute("/clients/$clientId")({
  component: () => <Outlet />,
});
