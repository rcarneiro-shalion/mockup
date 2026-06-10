import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Briefcase,
  Store,
  Sprout,
  ListTodo,
  Megaphone,
  Package,
  ShoppingBag,
  Settings,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to?: string;
  children?: { label: string; to: string }[];
  defaultOpen?: boolean;
};

const nav: NavItem[] = [
  { label: "Clients", icon: Briefcase, to: "/clients" },
  { label: "Retailers", icon: Store, to: "/retailers" },
  {
    label: "Seeds API",
    icon: Sprout,
    defaultOpen: true,
    children: [
      { label: "Store packages", to: "/seeds-api/store-packages" },
      { label: "Seeds", to: "/seeds-api/seeds" },
      { label: "Jobs", to: "/seeds-api/jobs" },
      { label: "Tags", to: "/seeds-api/tags" },
      { label: "Timeframes", to: "/seeds-api/timeframes" },
      { label: "Seed subscriptions", to: "/seeds-api/seed-subscriptions" },
    ],
  },
  { label: "Tasks", icon: ListTodo, children: [] },
  { label: "Codification", icon: Megaphone, children: [] },
  { label: "Product", icon: Package, children: [] },
  { label: "Bulk", icon: ShoppingBag, to: "/bulk" },
  { label: "Settings", icon: Settings, children: [] },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(nav.map((n) => [n.label, !!n.defaultOpen])),
  );

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
      <nav className="flex flex-col gap-0.5 px-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const hasChildren = !!item.children;
          const isOpen = open[item.label];
          const groupActive =
            item.children?.some((c) => pathname.startsWith(c.to)) ||
            (item.to && pathname === item.to);

          if (hasChildren) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => setOpen((o) => ({ ...o, [item.label]: !o[item.label] }))}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                    groupActive
                      ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-fg)]"
                      : "text-foreground/80 hover:bg-[var(--sidebar-hover)]",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    {item.label}
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
                            "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                            active
                              ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-fg)] font-medium"
                              : "text-foreground/70 hover:bg-[var(--sidebar-hover)]",
                          )}
                        >
                          {c.label}
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
    </aside>
  );
}
