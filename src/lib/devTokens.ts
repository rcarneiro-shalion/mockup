// Read the dev API tokens straight from localStorage at call time, so a "Connect
// live" click always uses the latest saved pair — even if they were saved (via the
// top-bar 🔑 dialog) after the current page already mounted. Keys match
// usePersistentState("shalion:devToken" / "shalion:devIdToken").
function read(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string) : "";
  } catch {
    return "";
  }
}

export function getDevTokens(): { token: string; idToken: string } {
  return { token: read("shalion:devToken"), idToken: read("shalion:devIdToken") };
}
