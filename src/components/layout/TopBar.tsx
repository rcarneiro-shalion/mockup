import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { BusinessRulesTrigger } from "@/components/common/BusinessRulesModal";
import { DevTokensTrigger } from "@/components/common/DevTokensDialog";
import { stripVersionPrefix } from "@/lib/appVersion";

const sections = [
  { label: "Ecometry", to: "/" },
  { label: "Data Collector", to: "/data-collector" },
  { label: "IAM", to: "/iam" },
];

export function TopBar() {
  // Compare on the version-agnostic path ("/v2/iam" → "/iam") — see lib/appVersion.
  const pathname = stripVersionPrefix(useLocation().pathname);
  const activeSection =
    pathname.startsWith("/data-collector")
      ? "/data-collector"
      : pathname.startsWith("/iam")
      ? "/iam"
      : "/";

  return (
    <header className="relative flex h-14 items-center justify-between border-b border-[var(--topbar-border)] bg-background px-5">
      {/* Persistent "Mockup" legend — a banner hanging from the top edge, visible on every section. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
        <span
          title="This is a mockup / prototype of the Ecometry console — not the production system."
          className="pointer-events-auto rounded-b-2xl bg-[#f8e4e2] px-16 pb-2 pt-1.5 text-slate-600"
          style={{ lineHeight: "5px", fontWeight: 200, fontSize: "small" }}
        >
          Mockup
        </span>
      </div>
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g clipPath="url(#shalion-logo-clip)">
              <path d="M0 11.435a11.02 11.02 0 0 0 7.807-3.252C9.806 6.18 11.045 3.413 11.05.357a11.77 11.77 0 0 0-7.614 3.445A11.825 11.825 0 0 0 0 11.435Z" fill="#B47CFF" />
              <path d="M23.584 11.435a11.825 11.825 0 0 0-3.437-7.633A11.766 11.766 0 0 0 12.534.357a11.08 11.08 0 0 0 3.243 7.826 11.026 11.026 0 0 0 7.807 3.252Z" fill="#A1E335" />
              <path d="M12.534 24a11.766 11.766 0 0 0 7.613-3.446 11.822 11.822 0 0 0 3.437-7.631 11.028 11.028 0 0 0-7.807 3.25A11.08 11.08 0 0 0 12.534 24Z" fill="#FEC100" />
              <path d="M0 12.922C.367 18.871 5.116 23.632 11.051 24a11.079 11.079 0 0 0-3.244-7.826A11.021 11.021 0 0 0 0 12.923Z" fill="#FF87D3" />
            </g>
            <defs>
              <clipPath id="shalion-logo-clip">
                <path fill="#fff" d="M0 0h24v24H0z" />
              </clipPath>
            </defs>
          </svg>
          <span className="text-lg font-semibold tracking-tight text-foreground">shalion</span>
        </Link>
        <nav className="flex items-center gap-1">
          {sections.map((s) => {
            const active = activeSection === s.to;
            return (
              <Link
                key={s.to}
                to={s.to}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <DevTokensTrigger />
        <BusinessRulesTrigger />
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-slate-300 to-slate-500 text-sm font-medium text-white">
          R
        </div>
      </div>
    </header>
  );
}
