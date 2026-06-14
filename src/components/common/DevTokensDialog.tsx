import { useState } from "react";
import { KeyRound, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePersistentState } from "@/hooks/usePersistentState";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Decode a JWT payload (client-only) to surface the user + expiry, so you can see
// at a glance whether the saved token is still valid.
function decodeJwt(t: string): { email?: string; exp?: number } | null {
  if (typeof atob === "undefined" || !t) return null;
  try {
    const part = t.split(".")[1];
    if (!part) return null;
    const json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
    return { email: json.email ?? json.username, exp: json.exp };
  } catch {
    return null;
  }
}

/**
 * Top-bar affordance to store the Shalion dev API tokens (bearer access token +
 * x-id-token) once in this browser's localStorage, under the keys the live-data
 * features reuse: `shalion:devToken` / `shalion:devIdToken`. Tokens are sent only
 * to our own server proxy and are never committed.
 */
export function DevTokensTrigger() {
  const [token, setToken] = usePersistentState<string>("shalion:devToken", "");
  const [idToken, setIdToken] = usePersistentState<string>("shalion:devIdToken", "");
  const [open, setOpen] = useState(false);
  const [draftA, setDraftA] = useState("");
  const [draftI, setDraftI] = useState("");

  const hasTokens = !!(token && idToken);

  const openDialog = () => {
    setDraftA(token);
    setDraftI(idToken);
    setOpen(true);
  };
  const save = () => {
    setToken(draftA.trim());
    setIdToken(draftI.trim());
    toast.success("Dev tokens saved to this browser — live connect will reuse them.");
    setOpen(false);
  };
  const clear = () => {
    setToken("");
    setIdToken("");
    setDraftA("");
    setDraftI("");
    toast.info("Dev tokens cleared from this browser.");
  };

  const info = decodeJwt(draftA || token);
  const expired = info?.exp ? info.exp * 1000 < Date.now() : false;

  return (
    <>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={openDialog}
              aria-label="Dev API tokens"
              className={cn(
                "relative grid h-8 w-8 place-items-center rounded-full border transition-colors hover:bg-secondary",
                hasTokens
                  ? "border-emerald-300 text-emerald-600"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <KeyRound className="h-4 w-4" />
              {hasTokens && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>{hasTokens ? "Dev API tokens saved" : "Set dev API tokens"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-5 w-5 text-[var(--sidebar-active-fg)]" />
              Dev API tokens
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Paste your develop/prod <strong>bearer access token</strong> and <strong>x-id-token</strong>.
            They are stored in <em>this browser only</em> (localStorage{" "}
            <span className="font-mono text-xs">shalion:devToken</span> /{" "}
            <span className="font-mono text-xs">shalion:devIdToken</span>) and sent only to the server
            proxy for read-only live data. They are never committed. Reused by the IAM and
            Massive-update “Connect live” actions.
          </p>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Authorization bearer token</label>
              <textarea
                value={draftA}
                onChange={(e) => setDraftA(e.target.value)}
                rows={3}
                placeholder="eyJraWQiOi…"
                className="w-full resize-y rounded-md border border-border bg-background px-2.5 py-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">x-id-token</label>
              <textarea
                value={draftI}
                onChange={(e) => setDraftI(e.target.value)}
                rows={3}
                placeholder="eyJraWQiOi…"
                className="w-full resize-y rounded-md border border-border bg-background px-2.5 py-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {info?.email && (
            <p className="text-xs text-muted-foreground">
              Token user: <span className="font-medium text-foreground">{info.email}</span>
              {info.exp && (
                <>
                  {" · "}
                  {expired ? (
                    <span className="font-medium text-red-600">expired {new Date(info.exp * 1000).toLocaleString()}</span>
                  ) : (
                    <>expires {new Date(info.exp * 1000).toLocaleString()}</>
                  )}
                </>
              )}
            </p>
          )}

          <div className="mt-1 flex items-center justify-between">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={clear} disabled={!token && !idToken}>
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={save} disabled={!draftA.trim() || !draftI.trim()}>
                Save tokens
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
