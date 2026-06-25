// "Stand-alone (Vercel) vs lived (local app)" detection. Live (real-API) mode is only
// offered when the app runs locally; the deployed/stand-alone host stays Mockup-only so the
// public demo URL never issues live writes. (Tokens + an explicit Live toggle gate it further.)
export function isLiveCapable(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h.endsWith(".local");
}
