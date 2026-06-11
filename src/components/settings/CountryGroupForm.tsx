import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Plus, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Th, Td, Pagination } from "@/components/seeds/ListPrimitives";
import { flag, countryLabel, COUNTRY_OPTIONS } from "@/lib/retailers";
import type { CountryGroup } from "@/lib/settings";

export function CountryGroupForm({
  group,
  setGroups,
  onCancel,
}: {
  group: CountryGroup;
  setGroups: React.Dispatch<React.SetStateAction<CountryGroup[]>>;
  onCancel: () => void;
}) {
  const [assignOpen, setAssignOpen] = useState(false);
  const navigate = useNavigate();

  const stamp = new Date().toDateString();
  const countries = group.countries ?? [];

  // Edits write back to the persisted record by id immediately.
  const patch = (changes: Partial<CountryGroup>) =>
    setGroups((prev) => prev.map((g) => (g.id === group.id ? { ...g, ...changes, updatedAt: stamp } : g)));

  const assigned = new Set(countries.map((c) => c.code));
  const available = COUNTRY_OPTIONS.filter((code) => !assigned.has(code));

  const addCountry = (code: string) => {
    patch({ countries: [...countries, { id: crypto.randomUUID(), code, createdAt: stamp, updatedAt: stamp }] });
    setAssignOpen(false);
  };

  const removeCountry = (id: string) => {
    patch({ countries: countries.filter((c) => c.id !== id) });
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="px-6 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Country groups
          </button>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{group.name || "Country group"}</h1>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-5xl space-y-5">
            {/* Name */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex max-w-md flex-col gap-1.5">
                <Label className="text-sm font-medium text-foreground/80">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input value={group.name} onChange={(e) => patch({ name: e.target.value })} />
              </div>
            </div>

            {/* Countries */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-foreground">Countries</span>
                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setAssignOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />
                  Assign country
                </Button>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60">
                    <tr>
                      <Th>Country code</Th>
                      <Th>Created at</Th>
                      <Th>Updated at</Th>
                      <Th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {countries.length === 0 ? (
                      <tr>
                        <Td className="text-muted-foreground"><span className="block py-2">No countries assigned yet.</span></Td>
                        <Td /><Td /><Td />
                      </tr>
                    ) : (
                      countries.map((c) => (
                        <tr key={c.id} className="border-t border-border hover:bg-secondary/40">
                          <Td className="text-foreground">
                            <span className="inline-flex items-center gap-2"><span>{flag(c.code)}</span>{c.code}</span>
                          </Td>
                          <Td className="text-muted-foreground">{c.createdAt}</Td>
                          <Td className="text-muted-foreground">{c.updatedAt}</Td>
                          <Td>
                            <button
                              onClick={() => removeCountry(c.id)}
                              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                              aria-label={`Remove ${c.code}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination total={countries.length} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            onClick={() => {
              toast.success("Country group saved successfully");
              navigate({ to: "/settings/country-groups" });
            }}
          >
            Save country group
          </Button>
        </div>
      </div>

      {assignOpen && (
        <AssignCountryModal options={available} onClose={() => setAssignOpen(false)} onAssign={addCountry} />
      )}
    </AppShell>
  );
}

/** Searchable single-select modal of country codes. */
function AssignCountryModal({
  options,
  onClose,
  onAssign,
}: {
  options: string[];
  onClose: () => void;
  onAssign: (code: string) => void;
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("");

  const optionLabel = (code: string) => `${flag(code)} ${countryLabel(code).replace(/^\S+\s/, "")} (${code})`;
  const filtered = options.filter((code) => optionLabel(code).toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Assign country</h2>
          <button
            onClick={onClose}
            className="-mr-2 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <Label className="block text-sm font-medium text-foreground">
            Country <span className="text-destructive">*</span>
          </Label>
          <Input
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(""); }}
            placeholder="Search country"
          />
          <div className="max-h-64 overflow-auto rounded-md border border-border">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">No results.</div>
            ) : (
              filtered.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSel(code)}
                  className={
                    "flex w-full items-center gap-2 border-b border-border px-3 py-2 text-left text-sm text-foreground last:border-0 hover:bg-accent" +
                    (sel === code ? " bg-accent" : "")
                  }
                >
                  {optionLabel(code)}
                </button>
              ))
            )}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button disabled={!sel} onClick={() => sel && onAssign(sel)}>Assign country</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
