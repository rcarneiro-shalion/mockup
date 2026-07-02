import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { parseAppVersion, setSsrAppVersion } from "./lib/appVersion";

// The console is served as three parallel versions under /v1, /v2, /v3 (see
// lib/appVersion.ts). This middleware (a) relays the requested version to the SSR
// router factory, and (b) 302-redirects unversioned DOCUMENT requests ("/", old
// bookmarks like "/product/client-skus") to their /v1 equivalent. Server-fn calls
// (/_serverFn/...), dev-tooling paths and assets are matched loosely and left alone.
const versionMiddleware = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  const version = parseAppVersion(url.pathname);
  setSsrAppVersion(version);
  if (
    version === null &&
    request.method === "GET" &&
    !url.pathname.startsWith("/_") &&
    !url.pathname.startsWith("/@") &&
    !url.pathname.includes(".") &&
    (request.headers.get("accept") ?? "").includes("text/html")
  ) {
    return new Response(null, {
      status: 302,
      headers: { Location: `/v1${url.pathname === "/" ? "" : url.pathname}${url.search}` },
    });
  }
  return await next();
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, versionMiddleware],
}));
