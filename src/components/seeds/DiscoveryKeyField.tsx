import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/seeds/ListPrimitives";
import { cn } from "@/lib/utils";
import type { Seed } from "@/lib/seeds";

const norm = (s: string | undefined) => (s ?? "").trim().toLowerCase();

/**
 * Discovery key input with live, search-style feedback over every other seed:
 *  - exact match → the key is taken; shown in red with a link to the owning seed
 *    (the parent form blocks save on this — keys must be unique);
 *  - partial matches → an informational list of existing keys that contain the
 *    query, each linking to its seed, so collisions are easy to spot;
 *  - otherwise → confirms the key is free.
 * `seeds` is the full collection; the current seed is excluded by `currentId`.
 */
export function DiscoveryKeyField({
  value,
  onChange,
  seeds,
  currentId,
}: {
  value: string;
  onChange: (v: string) => void;
  seeds: Seed[];
  currentId?: string;
}) {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);
  const q = norm(value);

  const { exact, partial } = useMemo(() => {
    if (!q) return { exact: undefined as Seed | undefined, partial: [] as Seed[] };
    const others = seeds.filter((s) => s.id !== currentId && norm(s.discoveryKey));
    const exact = others.find((s) => norm(s.discoveryKey) === q);
    const partial = others.filter((s) => norm(s.discoveryKey) !== q && norm(s.discoveryKey).includes(q));
    return { exact, partial };
  }, [seeds, currentId, q]);

  const goToSeed = (id: string) => navigate({ to: "/seeds-api/seeds/$seedId", params: { seedId: id } });

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search or enter a unique key"
          className={cn("pl-8", exact && "border-destructive focus-visible:ring-destructive")}
        />
      </div>

      {exact ? (
        <p className="flex items-start gap-1.5 text-xs text-destructive">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Already used by{" "}
            <button type="button" onClick={() => goToSeed(exact.id)} className="font-medium underline underline-offset-2">
              {exact.d || exact.value || exact.id}
            </button>
            . Discovery keys must be unique.
          </span>
        </p>
      ) : value.trim() ? (
        <p className="flex items-center gap-1.5 text-xs text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Available — no other seed uses this key.
        </p>
      ) : null}

      {/* Search results: existing seeds whose key contains the query. */}
      {focused && partial.length > 0 && (
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <p className="border-b border-border bg-secondary/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Existing keys matching “{value.trim()}”
          </p>
          <ul className="max-h-44 overflow-auto py-1">
            {partial.slice(0, 6).map((s) => (
              <li key={s.id}>
                {/* onMouseDown (not onClick) so it fires before the input's blur. */}
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); goToSeed(s.id); }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-secondary/60"
                >
                  <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground/80">{s.discoveryKey}</span>
                  {s.type && <Pill tone="slate">{s.type}</Pill>}
                  <span className="min-w-0 max-w-[40%] truncate text-xs text-muted-foreground">{s.d}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
