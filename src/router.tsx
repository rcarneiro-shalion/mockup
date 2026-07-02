import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ensureStorageVersion } from "./lib/storageReset";
import { makeVersionRewrite, parseAppVersion } from "./lib/appVersion";

// Run the one-time, version-gated storage reset as a client-only module side-effect —
// this module is the bootstrap the framework imports to mount the app, so this executes
// once on hydration BEFORE any route component / getX() reads localStorage. It is a
// no-op on the server (window-guarded) and when the stored schema version already matches.
if (typeof window !== "undefined") ensureStorageVersion();

export const getRouter = () => {
  const queryClient = new QueryClient();

  // Belt-and-braces client redirect: the server middleware already 302s unversioned
  // document URLs to /v1, but if the client ever boots on one (e.g. dev edge cases),
  // hard-replace onto /v1 so the basepath below matches the address bar.
  if (typeof window !== "undefined" && parseAppVersion(window.location.pathname) === null) {
    const { pathname, search, hash } = window.location;
    window.location.replace(`/v1${pathname === "/" ? "" : pathname}${search}${hash}`);
  }

  const router = createRouter({
    routeTree,
    // The whole route tree mounts under the requested version (/v1 | /v2 | /v3) via a
    // URL rewrite — matching AND every generated Link href are prefixed automatically.
    // (Not `basepath`: Start clobbers it on the client with TSS_ROUTER_BASEPATH.)
    // Fresh per router: on the server each request gets its own version closure.
    rewrite: makeVersionRewrite(),
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
