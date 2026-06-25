import { Database, FlaskConical, Loader2, Plug, RefreshCw, Rocket, Unplug } from "lucide-react";

import { DevTokensTrigger } from "@/components/common/DevTokensDialog";
import { cn } from "@/lib/utils";
import type { LiveConnection, LiveEnv } from "@/lib/useLiveConnection";

/**
 * The shared "live env" control row (Massive update pattern): a Dev/Prod toggle + a
 * token-gated Connect, then Refresh / "Live (env) · disconnect" once connected. Driven
 * entirely by a {@link useLiveConnection} instance. On a host that can't reach the live API
 * (the deployed/Vercel build) it renders a static "Preview data" pill — the section shows its
 * pre-fetched snapshot instead.
 */
export function LiveConnectBar<T>({
  conn,
  serviceLabel,
  onData,
}: {
  conn: LiveConnection<T>;
  serviceLabel?: string;
  /** Called with the freshly-loaded payload after Connect / Refresh (for a specific toast). */
  onData?: (data: T | null) => void;
}) {
  if (!conn.liveCapable) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground"
        title="The hosted demo shows pre-fetched snapshot data — the live API isn’t reachable from here."
      >
        <Database className="h-3.5 w-3.5" /> Preview data
      </span>
    );
  }

  // Switching env while connected reconnects to the new env (like Massive update's onEnvChange).
  const selectEnv = async (e: LiveEnv) => {
    if (e === conn.env && (!conn.connected || e === conn.loadedEnv)) return;
    conn.setEnv(e);
    if (conn.connected) onData?.(await conn.connect(e));
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5">
      <div className="inline-flex rounded-md border border-border p-0.5" role="group" aria-label="Data environment">
        {(
          [
            ["develop", "Dev", FlaskConical, "Develop — a separate environment; needs a develop token + corporate VPN (a prod token won’t work)."],
            ["prod", "Prod", Rocket, "Production — public, no VPN; your prod token works (the env that actually loads)."],
          ] as const
        ).map(([e, label, Icon, tip]) => (
          <button
            key={e}
            type="button"
            title={tip}
            onClick={() => selectEnv(e)}
            className={cn(
              "inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-colors",
              conn.env === e
                ? e === "prod"
                  ? "bg-rose-600 text-white"
                  : "bg-secondary text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {conn.connected ? (
        <>
          <button
            type="button"
            onClick={() => conn.disconnect()}
            title="Disconnect — return to snapshot data"
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
          >
            <Plug className="h-3.5 w-3.5 text-emerald-600" /> Live ({conn.loadedEnv}) · disconnect
          </button>
          <button
            type="button"
            onClick={async () => onData?.(await conn.refresh())}
            disabled={conn.connecting}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {conn.connecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Refresh
          </button>
        </>
      ) : (
        <>
          {!conn.hasToken && (
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-700">
              Token required <DevTokensTrigger />
            </span>
          )}
          <button
            type="button"
            onClick={async () => onData?.(await conn.connect())}
            disabled={conn.connecting || !conn.hasToken}
            title={`Connect to ${conn.env} (real ${serviceLabel ?? "API"})`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-white transition-colors disabled:opacity-50",
              conn.env === "prod" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700",
            )}
          >
            {conn.connecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unplug className="h-3.5 w-3.5" />} Connect
          </button>
        </>
      )}
      {conn.connecting && conn.progress && <span className="text-xs text-muted-foreground">{conn.progress}</span>}
    </div>
  );
}
