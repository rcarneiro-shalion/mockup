import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout for the /settings/rules segment — renders the list (index) route or
// the nested new / $ruleId edit routes via the Outlet.
export const Route = createFileRoute("/settings/rules")({
  component: () => <Outlet />,
});
