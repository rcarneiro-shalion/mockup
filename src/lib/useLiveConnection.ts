import { useCallback, useState } from "react";
import { toast } from "sonner";

import { usePersistentState } from "@/hooks/usePersistentState";
import { isLiveCapable } from "@/lib/liveMode";
import { nowStamp } from "@/lib/clients";
import type { LiveEnv } from "@/lib/liveUsers";

export type { LiveEnv };

export type LiveConnection<T> = {
  /** Whether real-API connection is even possible here (localhost only — Vercel stays snapshot). */
  liveCapable: boolean;
  env: LiveEnv;
  setEnv: (e: LiveEnv) => void;
  token: string;
  idToken: string;
  hasToken: boolean;
  /** The loaded live payload, or null when disconnected. */
  data: T | null;
  connected: boolean;
  connecting: boolean;
  progress: string;
  /** The env the on-screen `data` actually came from (writes must target THIS, not `env`). */
  loadedEnv: LiveEnv;
  connectedAt: string | null;
  /** Connect (or reconnect to `e`). Returns the loaded payload, or null on failure. */
  connect: (e?: LiveEnv) => Promise<T | null>;
  refresh: () => Promise<T | null>;
  disconnect: () => void;
};

/**
 * Reusable "live environment" connection, modelled on the Massive update tool: a Dev/Prod
 * choice (persisted), a token gate, and connect / refresh / disconnect against a real Shalion
 * API through the server proxy. Pair it with {@link LiveConnectBar}.
 *
 * THE PATTERN (default for any "make-it-real" prototype section):
 *  - When DISCONNECTED, the section renders its **pre-fetched snapshot** so the hosted/Vercel
 *    build — where the live API isn't reachable — still shows realistic data.
 *  - On localhost (token + VPN for develop / public for prod) the user can **Connect** to read
 *    (and the section can write) against the real env, exactly like Massive update.
 *
 * Give it a `load` that pulls the section's data for an env; render snapshot-or-live by
 * `connected`. Defaults to PROD (public, no VPN, and the pasted tokens are prod tokens —
 * the env that actually loads; see live-api notes).
 */
export function useLiveConnection<T>(opts: {
  /** Unique key for persisting the env choice, e.g. `pref:clientUsers:<clientId>`. */
  storageKey: string;
  load: (ctx: { env: LiveEnv; token: string; idToken: string; onProgress: (m: string) => void }) => Promise<T>;
  defaultEnv?: LiveEnv;
}): LiveConnection<T> {
  const liveCapable = isLiveCapable();
  const [env, setEnv] = usePersistentState<LiveEnv>(`${opts.storageKey}:env`, opts.defaultEnv ?? "prod");
  // Dev tokens are shared app-wide (Massive update / Super Update use the same keys) and survive
  // a data reset (PRESERVE_PREFIXES "shalion:"), so a live session persists across reloads.
  const [token] = usePersistentState<string>("shalion:devToken", "");
  const [idToken] = usePersistentState<string>("shalion:devIdToken", "");
  const hasToken = !!(token && idToken);

  const [data, setData] = useState<T | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [progress, setProgress] = useState("");
  const [loadedEnv, setLoadedEnv] = useState<LiveEnv>(env);
  const [connectedAt, setConnectedAt] = useState<string | null>(null);

  const load = opts.load;
  const connect = useCallback(
    async (e?: LiveEnv): Promise<T | null> => {
      const target = e ?? env;
      if (!liveCapable) {
        toast.error("Live data is only available on the local app (localhost).");
        return null;
      }
      if (!hasToken) {
        toast.error("Paste your API tokens to connect.");
        return null;
      }
      setConnecting(true);
      setProgress("Connecting…");
      try {
        const d = await load({ env: target, token, idToken, onProgress: setProgress });
        setData(d);
        setConnected(true);
        setLoadedEnv(target);
        setConnectedAt(nowStamp());
        return d;
      } catch (err) {
        toast.error(`Couldn’t connect to ${target}: ${(err as Error).message}`);
        return null;
      } finally {
        setConnecting(false);
        setProgress("");
      }
    },
    [env, liveCapable, hasToken, token, idToken, load],
  );

  const refresh = useCallback(() => connect(loadedEnv), [connect, loadedEnv]);
  const disconnect = useCallback(() => {
    setConnected(false);
    setData(null);
    setConnectedAt(null);
  }, []);

  return { liveCapable, env, setEnv, token, idToken, hasToken, data, connected, connecting, progress, loadedEnv, connectedAt, connect, refresh, disconnect };
}
