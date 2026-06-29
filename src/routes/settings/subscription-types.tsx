import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { EditRecordDialog, type FieldDef } from "@/components/seeds/EditRecordDialog";
import { AddRecordDialog, type AddFieldDef } from "@/components/seeds/AddRecordDialog";
import { LinkText, Pill } from "@/components/seeds/ListPrimitives";
import { usePersistentState } from "@/hooks/usePersistentState";
import {
  SUBSCRIPTION_TYPES_KEY,
  INITIAL_SUBSCRIPTION_TYPES,
  type SettingSubscriptionType,
} from "@/lib/settings";

export const Route = createFileRoute("/settings/subscription-types")({
  head: () => ({ meta: [{ title: "Subscription type — Shalion" }] }),
  component: SubscriptionTypesPage,
});

// Settings-style readable timestamp, e.g. "Wed, Jun 18, 2026, 12:00 PM".
const stamp = () =>
  new Date().toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function SubscriptionTypesPage() {
  const [rows, setRows] = usePersistentState<SettingSubscriptionType[]>(
    SUBSCRIPTION_TYPES_KEY,
    INITIAL_SUBSCRIPTION_TYPES,
  );
  const [selected, setSelected] = useState<SettingSubscriptionType | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const columns: SettingsColumn<SettingSubscriptionType>[] = [
    {
      key: "name",
      label: "Name",
      sortValue: (r) => r.name,
      cell: (r) => (
        <LinkText onClick={() => setSelected(r)}>
          <Pill tone="slate">{r.name}</Pill>
        </LinkText>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortValue: (r) => r.description,
      cell: (r) => <span className="block max-w-[420px] truncate text-foreground/80" title={r.description}>{r.description || "—"}</span>,
    },
    { key: "createdAt", label: "Created at", sortValue: (r) => r.createdAt, cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span> },
    { key: "updatedAt", label: "Updated at", sortValue: (r) => r.updatedAt, cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span> },
  ];

  const addFields: AddFieldDef[] = [
    { kind: "text", label: "Name", required: true, span: 2 },
    { kind: "textarea", label: "Description", span: 2 },
  ];

  const editFields: FieldDef[] = selected
    ? [
        { kind: "text", label: "Name", value: selected.name, required: true, span: 2 },
        { kind: "textarea", label: "Description", value: selected.description, span: 2 },
      ]
    : [];

  return (
    <SettingsList
      title="Subscription type"
      newLabel="New subscription type"
      onNew={() => setAddOpen(true)}
      searchPlaceholder="Search subscription types by name or description"
      searchText={(r) => `${r.name} ${r.description}`}
      entityLabel="subscription type"
      columns={columns}
      rows={rows}
      onDelete={(id) => setRows((prev) => prev.filter((r) => r.id !== id))}
      onEdit={(r) => setSelected(r)}
      extra={
        <>
          <AddRecordDialog
            open={addOpen}
            onOpenChange={setAddOpen}
            title="Add subscription type"
            saveLabel="Add subscription type"
            fields={addFields}
            onSave={(values) => {
              const now = stamp();
              setRows((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  name: ((values["Name"] as string) || "Untitled").trim(),
                  description: ((values["Description"] as string) || "").trim(),
                  createdAt: now,
                  updatedAt: now,
                },
              ]);
            }}
          />

          <EditRecordDialog
            open={!!selected}
            onOpenChange={(v) => { if (!v) setSelected(null); }}
            title={selected?.name ?? ""}
            saveLabel="Save subscription type"
            fields={editFields}
            onSave={(values) => {
              setRows((prev) =>
                prev.map((r) =>
                  r.id === selected!.id
                    ? {
                        ...r,
                        name: (values["Name"] as string).trim(),
                        description: ((values["Description"] as string) || "").trim(),
                        updatedAt: stamp(),
                      }
                    : r,
                ),
              );
              setSelected(null);
            }}
            onDelete={() => {
              setRows((prev) => prev.filter((r) => r.id !== selected!.id));
              setSelected(null);
            }}
          />
        </>
      }
    />
  );
}
