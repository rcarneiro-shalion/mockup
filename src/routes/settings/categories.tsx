import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout for the /settings/categories segment — renders the list (index) route
// or the nested add/edit routes (new, $categoryId) via the Outlet.
export const Route = createFileRoute("/settings/categories")({
  component: () => <Outlet />,
});
