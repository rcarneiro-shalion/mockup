import { createFileRoute } from "@tanstack/react-router";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { LinkText } from "@/components/seeds/ListPrimitives";

type Box = { id: string; name: string; createdAt: string; updatedAt: string };
const BOXES_KEY = "settings:boxes";
const INITIAL_BOXES: Box[] = [];

export const Route = createFileRoute("/settings/boxes")({
  head: () => ({ meta: [{ title: "Boxes — Shalion" }] }),
  component: BoxesPage,
});

function BoxesPage() {
  const columns: SettingsColumn<Box>[] = [
    { key: "name", label: "Name", sortValue: (r) => r.name, cell: (r) => <LinkText>{r.name}</LinkText> },
    { key: "createdAt", label: "Created at", sortValue: (r) => r.createdAt, cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span> },
    { key: "updatedAt", label: "Updated at", sortValue: (r) => r.updatedAt, cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span> },
  ];
  return (
    <SettingsList
      title="Boxes"
      newLabel="New box"
      storageKey={BOXES_KEY}
      initial={INITIAL_BOXES}
      searchPlaceholder="Search boxes by name"
      searchText={(r) => r.name}
      entityLabel="box"
      columns={columns}
    />
  );
}
