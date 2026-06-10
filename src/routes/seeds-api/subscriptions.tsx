import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { SubscriptionDialog } from "@/components/seeds/SubscriptionDialog";
import {
  PageHeader,
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  Pill,
} from "@/components/seeds/ListPrimitives";
import { Switch } from "@/components/ui/switch";
import { Calendar, MoreVertical, ArrowUp, Store, Sprout } from "lucide-react";
import {
  SUBSCRIPTIONS_KEY,
  INITIAL_SUBSCRIPTIONS,
  type Subscription,
} from "@/lib/subscriptions";

export const Route = createFileRoute("/seeds-api/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions — Shalion" }] }),
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  const [rows, setRows] = usePersistentState<Subscription[]>(SUBSCRIPTIONS_KEY, INITIAL_SUBSCRIPTIONS);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <PageHeader
          title="Subscriptions"
          action={{ label: "Add subscription", onClick: () => setAddOpen(true) }}
        />
        <FilterBar search="Search by name">
          <FilterChip label="Projects" />
          <FilterChip label="Stores" icon={Store} />
          <FilterChip label="Seeds" icon={Sprout} />
          <FilterChip label="Scrapping options" />
          <FilterChip label="Geoloc modes" />
          <FilterChip label="Created at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <Th>
                <span className="inline-flex items-center gap-1">
                  Name <ArrowUp className="h-3 w-3" />
                </span>
              </Th>
              <Th>Project</Th>
              <Th>Seeds</Th>
              <Th>Scrapping option</Th>
              <Th>Geoloc</Th>
              <Th>Active</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => setSelectedIdx(i)}>{r.name}</LinkText></Td>
                <Td className="text-foreground/80">{r.project}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {r.seeds.length ? (
                      r.seeds.map((s) => <Pill key={s} tone="green">{s}</Pill>)
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </Td>
                <Td><LinkText>{r.scrappingOption}</LinkText></Td>
                <Td><Pill tone="violet">{r.geo}</Pill></Td>
                <Td><Switch defaultChecked /></Td>
                <Td>
                  <button className="rounded p-1 text-muted-foreground hover:bg-secondary">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={rows.length} />
      </div>

      <SubscriptionDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        mode="add"
        initial={null}
        onSave={(values) => setRows((prev) => [...prev, values])}
      />

      <SubscriptionDialog
        open={selectedIdx !== null}
        onOpenChange={(v) => { if (!v) setSelectedIdx(null); }}
        mode="edit"
        initial={selectedIdx !== null ? rows[selectedIdx] : null}
        onSave={(values) => {
          setRows((prev) => prev.map((r, i) => (i === selectedIdx ? values : r)));
          setSelectedIdx(null);
        }}
        onDelete={() => {
          setRows((prev) => prev.filter((_, i) => i !== selectedIdx));
          setSelectedIdx(null);
        }}
      />
    </AppShell>
  );
}
