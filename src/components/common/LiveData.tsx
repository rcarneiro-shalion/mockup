import { useState } from "react";
import { Plug, PlugZap, RefreshCw, Loader2, X, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { fetchLive } from "@/lib/api/live.functions";
import type { ApproxRow } from "./EntityListPage";
import { cn } from "@/lib/utils";

/** Describes how a list page reads real data from a Shalion API. */
export type LiveSpec = {
  /** Allow-listed service key (see shalion.server.ts), e.g. "iam". */
  service: string;
  /** Environment from the Shalion APIs URL map (default develop). */
  env?: "develop" | "staging" | "prod";
  /** Relative API path, e.g. "/v1.0/admin/applications". */
  path: string;
  /** Maps the parsed JSON response to display rows. */
  map: (json: unknown) => ApproxRow[];
};

type Status = "idle" | "loading" | "ok" | "error";

/**
 * "Live data" control bar. Lets you paste a develop bearer token (kept only in
 * localStorage and sent solely to our own server proxy), then fetches real
 * records read-only and hands them up via onData. onData(null) = disconnected
 * (the page falls back to its seeded mock rows).
 */
export function LiveDataControls({
  live,
  onData,
}: {
  live: LiveSpec;
  onData: (rows: ApproxRow[] | null) => void;
}) {
  const [token, setToken] = usePersistentState<string>("shalion:devToken", "");
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState<string>("");
  const [count, setCount] = useState(0);

  const connected = status === "ok";

  const run = async (tok: string) => {
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetchLive({ data: { service: live.service, env: live.env, path: live.path, token: tok || undefined } });
      if (!res.ok) {
        setStatus("error");
        setMsg(res.error ?? `Request failed (${res.status}).`);
        onData(null);
        return;
      }
      const rows = live.map(res.data);
      setCount(rows.length);
      setStatus("ok");
      setMsg(`${live.service} · ${live.path}`);
      onData(rows);
    } catch (e) {
      setStatus("error");
      setMsg((e as Error).message);
      onData(null);
    }
  };

  const connect = () => {
    const tok = (draft || token).trim();
    if (tok && tok !== token) setToken(tok);
    setOpen(false);
    setDraft("");
    void run(tok);
  };

  const disconnect = () => {
    setStatus("idle");
    setMsg("");
    onData(null);
  };

  return (
    <div className="mx-6 mt-4">
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-sm",
          connected
            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
            : status === "error"
              ? "border-amber-300 bg-amber-50 text-amber-800"
              : "border-border bg-secondary/40 text-foreground/80",
        )}
      >
        {connected ? <PlugZap className="h-4 w-4 shrink-0 text-emerald-600" /> : <Plug className="h-4 w-4 shrink-0 text-muted-foreground" />}

        {connected ? (
          <>
            <span className="font-medium">Live</span>
            <span className="font-mono text-xs">{msg}</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium">
              {count} record{count === 1 ? "" : "s"}
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7 gap-1.5" onClick={() => run(token)}>
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </Button>
              <Button variant="ghost" size="sm" className="h-7 gap-1.5" onClick={disconnect}>
                <X className="h-3.5 w-3.5" /> Disconnect
              </Button>
            </span>
          </>
        ) : status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Fetching live data…</span>
          </>
        ) : (
          <>
            <span>
              {status === "error" ? msg : "Showing seeded mock data."}
            </span>
            <span className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5"
                onClick={() => (token ? run(token) : setOpen((o) => !o))}
              >
                <PlugZap className="h-3.5 w-3.5" />
                {token ? "Connect live data" : "Connect live data…"}
              </Button>
            </span>
          </>
        )}
      </div>

      {open && !connected && (
        <div className="mt-2 flex flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <KeyRound className="h-3.5 w-3.5" />
            Develop bearer token (kept in this browser only; sent to our server proxy, never committed)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && connect()}
              placeholder="eyJraWQiOi…"
              className="h-8 flex-1 rounded-md border border-border bg-background px-2.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button size="sm" className="h-8" onClick={connect} disabled={!draft.trim() && !token}>
              Connect
            </Button>
            <Button variant="ghost" size="sm" className="h-8" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Read-only GET against <span className="font-mono">{live.service}</span>
            <span className="font-mono">{live.path}</span> on the develop environment. A dev token is
            short-lived; if it 401s, grab a fresh one.
          </p>
        </div>
      )}
    </div>
  );
}
