import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { EditRecordDialog, type FieldDef } from "@/components/seeds/EditRecordDialog";
import { AddRecordDialog, type AddFieldDef } from "@/components/seeds/AddRecordDialog";
import { LinkText, Pill } from "@/components/seeds/ListPrimitives";
import { usePersistentState } from "@/hooks/usePersistentState";
import { TASK_GROUPS_KEY, INITIAL_TASK_GROUPS, type SettingTaskGroup } from "@/lib/settings";
import { getScrappingOptions } from "@/lib/scrappingOptions";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/task-groups")({
  head: () => ({ meta: [{ title: "TaskGroup — Shalion" }] }),
  component: TaskGroupsPage,
});

const stamp = () =>
  new Date().toLocaleString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

// Slug = short code, max 5 chars, uppercased.
const cleanSlug = (s: unknown) => ((s as string) || "").trim().toUpperCase().slice(0, 5);

function TaskGroupsPage() {
  const [rows, setRows] = usePersistentState<SettingTaskGroup[]>(TASK_GROUPS_KEY, INITIAL_TASK_GROUPS);
  const [selected, setSelected] = useState<SettingTaskGroup | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const columns: SettingsColumn<SettingTaskGroup>[] = [
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
      key: "slug",
      label: "Slug",
      sortValue: (r) => r.slug,
      cell: (r) => (r.slug ? <Pill tone="blue">{r.slug}</Pill> : <span className="text-muted-foreground">—</span>),
    },
    { key: "createdAt", label: "Created at", sortValue: (r) => r.createdAt, cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span> },
    { key: "updatedAt", label: "Updated at", sortValue: (r) => r.updatedAt, cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span> },
  ];

  const addFields: AddFieldDef[] = [
    { kind: "text", label: "Name", required: true, span: 1 },
    { kind: "text", label: "Slug", required: true, span: 1 },
  ];
  const editFields: FieldDef[] = selected
    ? [
        { kind: "text", label: "Name", value: selected.name, required: true, span: 1 },
        { kind: "text", label: "Slug", value: selected.slug, required: true, span: 1 },
      ]
    : [];

  // Name required; slug required, ≤5 chars, UNIQUE (case-insensitive). `ignoreId` skips the row being edited.
  const validate = (values: Record<string, string | boolean>, ignoreId?: string): string | null => {
    const name = ((values["Name"] as string) || "").trim();
    const slug = cleanSlug(values["Slug"]);
    if (!name) return "Name is required";
    if (!slug) return "Slug is required";
    if (rows.some((r) => r.id !== ignoreId && r.slug.toUpperCase() === slug)) return `Slug "${slug}" is already in use`;
    return null;
  };

  // A task group can't be deleted while a scraping option references it (by name, on its TaskGroup field).
  const usedBy = (tg: SettingTaskGroup) =>
    getScrappingOptions().filter((o) => (o.taskGroups ?? []).includes(tg.name)).map((o) => o.name);
  const tryDelete = (tg: SettingTaskGroup): boolean => {
    const inUse = usedBy(tg);
    if (inUse.length) {
      toast.error(`Can't delete "${tg.name}" — used by ${inUse.length} scraping option${inUse.length === 1 ? "" : "s"}`);
      return false;
    }
    setRows((prev) => prev.filter((r) => r.id !== tg.id));
    return true;
  };

  return (
    <SettingsList
      title="TaskGroup"
      newLabel="New task group"
      onNew={() => setAddOpen(true)}
      searchPlaceholder="Search task groups by name or slug"
      searchText={(r) => `${r.name} ${r.slug}`}
      entityLabel="task group"
      columns={columns}
      rows={rows}
      onEdit={(r) => setSelected(r)}
      onDelete={(id) => {
        const tg = rows.find((r) => r.id === id);
        if (tg) tryDelete(tg);
      }}
      extra={
        <>
          <AddRecordDialog
            open={addOpen}
            onOpenChange={setAddOpen}
            title="Add task group"
            saveLabel="Add task group"
            fields={addFields}
            validate={(v) => validate(v)}
            onSave={(values) => {
              const now = stamp();
              setRows((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  name: ((values["Name"] as string) || "Untitled").trim(),
                  slug: cleanSlug(values["Slug"]),
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
            saveLabel="Save task group"
            fields={editFields}
            hideDelete
            validate={(v) => validate(v, selected?.id)}
            onSave={(values) => {
              setRows((prev) =>
                prev.map((r) =>
                  r.id === selected!.id
                    ? { ...r, name: (values["Name"] as string).trim(), slug: cleanSlug(values["Slug"]), updatedAt: stamp() }
                    : r,
                ),
              );
              setSelected(null);
            }}
          />
        </>
      }
    />
  );
}
