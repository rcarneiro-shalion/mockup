import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ensureStorageVersion } from "./lib/storageReset";

// Run the one-time, version-gated storage reset as a client-only module side-effect —
// this module is the bootstrap the framework imports to mount the app, so this executes
// once on hydration BEFORE any route component / getX() reads localStorage. It is a
// no-op on the server (window-guarded) and when the stored schema version already matches.
if (typeof window !== "undefined") ensureStorageVersion();

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
