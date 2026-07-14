import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Home,
  Briefcase,
  Store,
  Sprout,
  ListTodo,
  Megaphone,
  Package,
  ShoppingBag,
  Settings,
  FolderKanban,
  LayoutTemplate,
  Braces,
  ClipboardList,
  PlayCircle,
  ListChecks,
  LayoutGrid,
  Users,
  Building2,
  Contact,
  ChevronDown,
  ChevronLeft,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAppVersion, stripVersionPrefix } from "@/lib/appVersion";
import { useLatestUnseenRelease } from "@/lib/releaseNotes";

type NavChild = { label: string; to: string; legacy?: boolean };

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to?: string;
  children?: NavChild[];
  defaultOpen?: boolean;
  /** Small badge next to the group label (e.g. "Deprecating"). */
  badge?: string;
};

const ecometryNav: NavItem[] = [
  { label: "Home", icon: Home, to: "/" },
  { label: "Clients", icon: Briefcase, to: "/clients" },
  {
    label: "Retailers",
    icon: Store,
    defaultOpen: true,
    children: [
      { label: "Retailers", to: "/retailers" },
      { label: "Stores", to: "/stores" },
      { label: "Location Catalog", to: "/location-catalogs" },
    ],
  },
  {
    label: "Seeds API",
    icon: Sprout,
    defaultOpen: true,
    children: [
      { label: "Projects", to: "/seeds-api/projects" },
      { label: "Scraping Plans", to: "/seeds-api/scraping-plans" },
      { label: "Seeds", to: "/seeds-api/seeds" },
      { label: "Scraping options", to: "/seeds-api/scrapping-options" },
      { label: "Tags", to: "/seeds-api/tags" },
      { label: "Value Stream Map", to: "/seeds-api/planner" },
      { label: "Scenario simulator", to: "/seeds-api/scenario-generator" },
    ],
  },
  {
    label: "Tasks",
    icon: ListTodo,
    badge: "Deprecating",
    children: [
      { label: "Projects", to: "/tasks/projects" },
      { label: "Jobs", to: "/tasks/jobs" },
      { label: "Seeds", to: "/tasks/seeds" },
    ],
  },
  {
    label: "Codification",
    icon: Megaphone,
    children: [
      { label: "Brands", to: "/codification/brands" },
      { label: "Manufacturers", to: "/codification/manufacturers" },
      { label: "Promotions", to: "/codification/promotions" },
      { label: "Listings", to: "/codification/listings" },
      { label: "Fsa listings", to: "/codification/fsa-listings" },
      { label: "Ads", to: "/codification/ads" },
      { label: "FSA section", to: "/codification/fsa-sections" },
      { label: "Value propositions", to: "/codification/value-propositions" },
      { label: "Attributes", to: "/codification/attributes" },
      { label: "Data variables", to: "/codification/data-variables" },
    ],
  },
  {
    label: "Product",
    icon: Package,
    children: [
      { label: "Business units", to: "/product/business-units" },
      { label: "Client categories", to: "/product/client-categories" },
      { label: "Client SKUs", to: "/product/client-skus" },
      { label: "Store skus", to: "/product/store-skus" },
      { label: "Sku rpcs", to: "/product/sku-rpcs" },
      { label: "Assortments", to: "/product/assortments" },
      { label: "Sku image references", to: "/product/sku-image-references" },
      { label: "Sku retailer image references", to: "/product/sku-retailer-image-references" },
      { label: "Sku store image references", to: "/product/sku-store-image-references" },
      { label: "Sku text references", to: "/product/sku-text-references" },
      { label: "Sku retailer text references", to: "/product/sku-retailer-text-references" },
      { label: "Sku store text references", to: "/product/sku-store-text-references" },
    ],
  },
  { label: "Bulk", icon: ShoppingBag, to: "/bulk" },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Dashboard applications", to: "/settings/dashboard-applications" },
      { label: "Targets", to: "/settings/targets" },
      { label: "Timeframes (legacy)", to: "/settings/timeframes" },
      { label: "Categories", to: "/settings/categories" },
      { label: "Country groups", to: "/settings/country-groups" },
      { label: "Cubes", to: "/settings/cubes" },
      { label: "Scopes", to: "/settings/scopes" },
      { label: "Rules", to: "/settings/rules" },
      { label: "Scraping Plan type", to: "/settings/scraping-plan-types" },
      { label: "TaskGroup", to: "/settings/task-groups" },
    ],
  },
];

// Data Collector ("DC") menu — mirrors console-frontend's data-collector area
// (Projects/Tags, Templates, Outputs, Orders, Executions, Tasks, Settings).
const dataCollectorNav: NavItem[] = [
  {
    label: "Projects",
    icon: FolderKanban,
    defaultOpen: true,
    children: [
      { label: "Projects", to: "/data-collector/projects" },
      { label: "Tags", to: "/data-collector/projects/tags" },
    ],
  },
  { label: "Templates", icon: LayoutTemplate, to: "/data-collector/templates" },
  {
    label: "Outputs",
    icon: Braces,
    children: [
      { label: "Schemas", to: "/data-collector/outputs/schemas" },
      { label: "Data types", to: "/data-collector/outputs/data-types" },
    ],
  },
  { label: "Orders", icon: ClipboardList, to: "/data-collector/orders" },
  { label: "Executions", icon: PlayCircle, to: "/data-collector/executions" },
  { label: "Tasks", icon: ListChecks, to: "/data-collector/tasks" },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Proxy accounts", to: "/data-collector/settings/proxies/accounts" },
      { label: "Proxy providers", to: "/data-collector/settings/proxies/providers" },
      { label: "Error indicators", to: "/data-collector/settings/error-indicators" },
    ],
  },
];

// IAM (identity & access) — mirrors console-frontend's /iam area.
const iamNav: NavItem[] = [
  { label: "Applications", icon: LayoutGrid, to: "/iam/applications" },
  { label: "Users", icon: Users, to: "/iam/users" },
  { label: "Accounts", icon: Building2, to: "/iam/accounts" },
  { label: "Roles / Persona", icon: Contact, to: "/iam/roles" },
];

/** Pick the left-menu for the active top-bar section from the current path. */
function navForPath(pathname: string): NavItem[] {
  if (pathname.startsWith("/data-collector")) return dataCollectorNav;
  if (pathname.startsWith("/iam")) return iamNav;
  return ecometryNav;
}

export function Sidebar() {
  // Compare on the version-agnostic path ("/v2/iam" → "/iam") — see lib/appVersion.
  const pathname = stripVersionPrefix(useLocation().pathname);
  // The V1/V2 phase reinstates the legacy concepts under their original names:
  // Timeframes (no "(legacy)" tag) and "Region systems" (before the Location Catalog rename).
  const nav =
    getAppVersion() <= 2
      ? navForPath(pathname).map((item) => ({
          ...item,
          children: item.children?.map((c) =>
            c.label === "Timeframes (legacy)"
              ? { ...c, label: "Timeframes" }
              : c.label === "Location Catalog"
                ? { ...c, label: "Region systems" }
                : c,
          ),
        }))
      : navForPath(pathname);
  const [collapsed, setCollapsed] = useState(false);

  // Accordion behaviour: only one group is expanded at a time, so a long group
  // (Seeds API, Settings…) can't push the others off the bottom of the menu.
  // The group that contains the active route, if any:
  const activeGroupLabel =
    nav.find((i) => i.children?.some((c) => pathname.startsWith(c.to)))?.label ?? null;
  // Open ONLY the group that owns the active route; no group auto-opens on routes that
  // belong to none (Home, Clients) — those open only when their header is clicked.
  const [openGroup, setOpenGroup] = useState<string | null>(activeGroupLabel);
  // Follow navigation: landing on a group's route opens that group (collapsing the rest);
  // landing on a non-group route (Home, Clients) closes any open group. A manual header
  // click still opens a group and persists until the route's active group changes.
  useEffect(() => {
    setOpenGroup(activeGroupLabel);
  }, [activeGroupLabel]);

  // A permanent "Release notes" item is pinned to the bottom of the sidebar; show a dot
  // when there is a published release this visitor has not opened yet.
  const unseenRelease = useLatestUnseenRelease();

  if (collapsed) {
    return (
      <aside className="flex w-14 flex-col border-r border-[var(--topbar-border)] bg-[var(--sidebar-bg)] py-3">
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mb-2 grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
          aria-label="Expand sidebar"
        >
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </button>
        <nav className="flex flex-col items-center gap-1 px-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary"
                title={item.label}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col items-center px-1 pt-2">
          <div
            className="relative grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary"
            title="Release notes"
          >
            <Gift className="h-4.5 w-4.5" />
            {unseenRelease && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            )}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="relative flex w-60 shrink-0 flex-col border-r border-[var(--topbar-border)] bg-[var(--sidebar-bg)] py-3">
      <button
        onClick={() => setCollapsed(true)}
        className="absolute -right-3 top-4 z-10 grid h-6 w-6 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:bg-secondary"
        aria-label="Collapse sidebar"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const hasChildren = !!item.children;
          const groupActive = !!(
            item.children?.some((c) => pathname.startsWith(c.to)) ||
            (item.to && pathname === item.to)
          );
          const isOpen = openGroup === item.label;

          if (hasChildren) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => setOpenGroup((cur) => (cur === item.label ? null : item.label))}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                    groupActive
                      ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-fg)]"
                      : "text-foreground/80 hover:bg-[var(--sidebar-hover)]",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {item.badge && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      isOpen ? "rotate-180" : "",
                    )}
                  />
                </button>
                {isOpen && item.children && item.children.length > 0 && (
                  <div className="mt-0.5 flex flex-col gap-0.5 pl-7">
                    {item.children.map((c) => {
                      const active = pathname === c.to || pathname.startsWith(c.to + "/");
                      return (
                        <Link
                          key={c.to}
                          to={c.to}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                            active
                              ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-fg)] font-medium"
                              : c.legacy
                                ? "text-foreground/40 hover:bg-[var(--sidebar-hover)]"
                                : "text-foreground/70 hover:bg-[var(--sidebar-hover)]",
                          )}
                        >
                          <span className={cn(c.legacy && "line-through decoration-foreground/30")}>
                            {c.label}
                          </span>
                          {c.legacy && (
                            <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                              Legacy
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.to!}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                groupActive
                  ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-fg)]"
                  : "text-foreground/80 hover:bg-[var(--sidebar-hover)]",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-[var(--topbar-border)] px-2 pt-2">
        <Link
          to="/release-notes"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
            pathname === "/release-notes"
              ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-fg)]"
              : "text-foreground/80 hover:bg-[var(--sidebar-hover)]",
          )}
        >
          <Gift className="h-4 w-4" />
          Release notes
          {unseenRelease && (
            <span className="ml-auto h-2 w-2 rounded-full bg-rose-500" aria-label="New release" />
          )}
        </Link>
      </div>
    </aside>
  );
}
