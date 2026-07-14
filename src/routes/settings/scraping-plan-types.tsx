import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { EditRecordDialog, type FieldDef } from "@/components/seeds/EditRecordDialog";
import { AddRecordDialog, type AddFieldDef } from "@/components/seeds/AddRecordDialog";
import { LinkText, Pill } from "@/components/seeds/ListPrimitives";
import { usePersistentState } from "@/hooks/usePersistentState";
import {
  SCRAPING_PLAN_TYPES_KEY,
  INITIAL_SCRAPING_PLAN_TYPES,
  type SettingScrapingPlanType,
} from "@/lib/settings";

export const Route = createFileRoute("/settings/scraping-plan-types")({
  head: () => ({ meta: [{ title: "Scraping Plan type — Shalion" }] }),
  component: ScrapingPlanTypesPage,
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

function ScrapingPlanTypesPage() {
  const [rows, setRows] = usePersistentState<SettingScrapingPlanType[]>(
    SCRAPING_PLAN_TYPES_KEY,
    INITIAL_SCRAPING_PLAN_TYPES,
  );
  const [selected, setSelected] = useState<SettingScrapingPlanType | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const columns: SettingsColumn<SettingScrapingPlanType>[] = [
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
    { kind: "text", label: "Name", required: true, span: 1 },
    { kind: "text", label: "Slug", required: true, span: 1 },
    { kind: "textarea", label: "Description", span: 2 },
  ];

  const editFields: FieldDef[] = selected
    ? [
        { kind: "text", label: "Name", value: selected.name, required: true, span: 1 },
        { kind: "text", label: "Slug", value: selected.slug, required: true, span: 1 },
        { kind: "textarea", label: "Description", value: selected.description, span: 2 },
      ]
    : [];

  // Slug is a short code, max 3 chars, uppercased (e.g. SE, ME, GEO).
  const cleanSlug = (s: unknown) => ((s as string) || "").trim().toUpperCase().slice(0, 3);

  return (
    <SettingsList
      title="Scraping Plan type"
      newLabel="New scraping plan type"
      onNew={() => setAddOpen(true)}
      searchPlaceholder="Search scraping plan types by name or description"
      searchText={(r) => `${r.name} ${r.slug} ${r.description}`}
      entityLabel="scraping plan type"
      columns={columns}
      rows={rows}
      onDelete={(id) => setRows((prev) => prev.filter((r) => r.id !== id))}
      onEdit={(r) => setSelected(r)}
      extra={
        <>
          <AddRecordDialog
            open={addOpen}
            onOpenChange={setAddOpen}
            title="Add scraping plan type"
            saveLabel="Add scraping plan type"
            fields={addFields}
            onSave={(values) => {
              const now = stamp();
              setRows((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  name: ((values["Name"] as string) || "Untitled").trim(),
                  slug: cleanSlug(values["Slug"]),
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
            saveLabel="Save scraping plan type"
            fields={editFields}
            onSave={(values) => {
              setRows((prev) =>
                prev.map((r) =>
                  r.id === selected!.id
                    ? {
                        ...r,
                        name: (values["Name"] as string).trim(),
                        slug: cleanSlug(values["Slug"]),
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
