import { useLocation, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { APP_VERSIONS, getAppVersion, stripVersionPrefix, versionLabel, type VersionRewrite } from "@/lib/appVersion";

/** The version switcher strip — the mockup is served as three parallel versions
 *  (Seeds API v.1 / v.2 / v.3) mounted under /v1 | /v2 | /v3, each with its own
 *  persisted state. Tabs are plain <a> links: switching version is a FULL page load
 *  on purpose, so the new version boots cleanly on its own URL prefix + storage
 *  namespace while staying on the same page. */
export function VersionTabs() {
  const { pathname, searchStr, hash } = useLocation();
  const router = useRouter();
  // Read the version from THIS router's rewrite closure — request-scoped on the
  // server, so concurrent SSR renders can't show each other's active tab.
  const current = (router.options.rewrite as VersionRewrite | undefined)?.getVersion?.() ?? getAppVersion();
  // The router-internal pathname is already version-stripped; strip defensively anyway.
  const subPath = stripVersionPrefix(pathname);
  // Keep search params + hash across the switch (?type=…, ?edit=… modal state) — the
  // sibling version must land on the SAME page state, matching the server redirect.
  const suffix = `${searchStr ?? ""}${hash ? `#${hash}` : ""}`;

  return (
    <div className="flex items-end gap-1 border-b border-border bg-secondary/50 px-3 pt-1.5">
      {APP_VERSIONS.map((v) => {
        const active = v === current;
        return (
          <a
            key={v}
            href={`/v${v}${subPath === "/" ? "" : subPath}${suffix}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px rounded-t-lg border border-b-0 px-4 py-1.5 text-xs transition-colors",
              active
                ? "border-border bg-card font-semibold text-[var(--sidebar-active-fg)] shadow-sm"
                : "border-transparent font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {versionLabel(v)}
          </a>
        );
      })}
    </div>
  );
}
