import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import {
  EditSubscriptionDialog,
  type SubscriptionRow,
} from "@/components/seeds/EditSubscriptionDialog";
import { AddSubscriptionDialog } from "@/components/seeds/AddSubscriptionDialog";
import { PageHeader } from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { Calendar, MoreVertical, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/seeds-api/seed-subscriptions")({
  head: () => ({
    meta: [{ title: "Seed subscriptions — Shalion" }],
  }),
  component: SeedSubscriptionsPage,
});

const INITIAL_ROWS: SubscriptionRow[] = [
  {
    id: "680a8cb2-a853-4700-9b3f-0df39a0bb524",
    client: "Coca Cola",
    storePackage: "PKG Amazon US",
    seed: "water",
    validFrom: "08-06-2026",
    validTo: "31-12-2027",
    status: "Active",
  },
  {
    id: "95c1ef33-bef9-406f-9619-5271f45c3b94",
    client: "Nestle",
    storePackage: "PKG Amazon US",
    seed: "coffee",
    validFrom: "01-01-2026",
    validTo: "31-12-2026",
    status: "Active",
  },
  {
    id: "c46674e5-67d1-475e-bea5-1d607ed65791",
    client: "Pepsico",
    storePackage: "PKG Amazon US",
    seed: "water",
    validFrom: "12-03-2026",
    validTo: "31-12-2027",
    status: "Active",
  },
  {
    id: "ccaccdb7-5f1f-467c-b29e-7cab59f783bf",
    client: "Pepsico",
    storePackage: "PKG Amazon US",
    seed: "water",
    validFrom: "20-05-2026",
    validTo: "31-12-2027",
    status: "Active",
  },
];

function SeedSubscriptionsPage() {
  const [rows, setRows] = usePersistentState<SubscriptionRow[]>(
    "seeds-api:seed-subscriptions",
    INITIAL_ROWS,
  );
  const [selected, setSelected] = useState<SubscriptionRow | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Seed subscriptions"
          action={{ label: "Add seed subscription", onClick: () => setAddOpen(true) }}
        />

        <div className="flex flex-wrap items-center gap-2 px-6 py-4">
          <FilterChip label="Ids" />
          <FilterChip label="Seeds" />
          <FilterChip label="Client" />
          <FilterChip label="Store package" />
          <FilterChip label="Status" />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </div>

        <div className="flex-1 overflow-auto px-6 pb-4">
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-foreground/70">
                <tr>
                  <Th>Ids</Th>
                  <Th>Seed</Th>
                  <Th>Client</Th>
                  <Th>Store package</Th>
                  <Th>Created at</Th>
                  <Th>Updated at</Th>
                  <Th>Created by</Th>
                  <Th>Tags</Th>
                  <Th>Active</Th>
                  <Th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-border transition-colors hover:bg-secondary/40"
                  >
                    <Td>
                      <button
                        onClick={() => setSelected(r)}
                        className="font-mono text-[13px] text-[var(--sidebar-active-fg)] hover:underline"
                      >
                        {r.id}
                      </button>
                    </Td>
                    <Td>
                      <span className="text-[var(--sidebar-active-fg)]">{r.seed}</span>
                    </Td>
                    <Td>
                      <span className="text-[var(--sidebar-active-fg)]">{r.client}</span>
                    </Td>
                    <Td>{r.storePackage}</Td>
                    <Td className="text-muted-foreground">2026-06-09, 10:09:05</Td>
                    <Td className="text-muted-foreground">2026-06-09, 10:09:05</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-100 text-[11px] font-medium text-rose-700">
                          R
                        </span>
                        <span className="text-foreground/80">rcarneiro@shalion.com</span>
                      </div>
                    </Td>
                    <Td>
                      <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-secondary">
                        <Plus className="h-3 w-3" /> Add tag
                      </button>
                    </Td>
                    <Td>
                      <Switch defaultChecked />
                    </Td>
                    <Td>
                      <button className="rounded p-1 text-muted-foreground hover:bg-secondary">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-border px-6 py-3 text-sm text-muted-foreground">
          <span>Rows per page: 100</span>
          <span>1–{rows.length} of {rows.length}</span>
          <div className="flex items-center gap-1">
            <button className="rounded p-1 hover:bg-secondary" aria-label="Previous">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="rounded p-1 hover:bg-secondary" aria-label="Next">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AddSubscriptionDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={(updated) => {
          setRows((prev) => [...prev, updated]);
        }}
      />

      <EditSubscriptionDialog
        row={selected}
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
        onSave={(updated) => {
          setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
          setSelected(null);
        }}
        onDelete={() => {
          setRows((prev) => prev.filter((r) => r.id !== selected!.id));
          setSelected(null);
        }}
      />
    </AppShell>
  );
}

function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wide ${className ?? ""}`}>
      {children}
    </th>
  );
}

function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className ?? ""}`}>{children}</td>;
}
