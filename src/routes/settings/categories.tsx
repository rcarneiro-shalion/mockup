import { createFileRoute } from "@tanstack/react-router";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { LinkText } from "@/components/seeds/ListPrimitives";
import { CATEGORIES_KEY, INITIAL_CATEGORIES, type SettingCategory } from "@/lib/settings";

export const Route = createFileRoute("/settings/categories")({
  head: () => ({ meta: [{ title: "Categories — Shalion" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const columns: SettingsColumn<SettingCategory>[] = [
    { key: "sector", label: "Sector", sortValue: (r) => r.sector, cell: (r) => <span className="text-foreground/80">{r.sector}</span> },
    { key: "name", label: "Name", sortValue: (r) => r.name, cell: (r) => <LinkText>{r.name}</LinkText> },
    { key: "description", label: "Description", cell: (r) => <span className="block max-w-[220px] truncate text-foreground/80" title={r.description}>{r.description}</span> },
    { key: "esDescription", label: "ES description", cell: (r) => <span className="block max-w-[220px] truncate text-foreground/80" title={r.esDescription}>{r.esDescription}</span> },
    { key: "createdAt", label: "Created at", sortValue: (r) => r.createdAt, cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span> },
    { key: "updatedAt", label: "Updated at", sortValue: (r) => r.updatedAt, cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span> },
  ];
  return (
    <SettingsList
      title="Categories"
      newLabel="Add category"
      storageKey={CATEGORIES_KEY}
      initial={INITIAL_CATEGORIES}
      searchPlaceholder="Search categories by name or descriptions"
      searchText={(r) => `${r.name} ${r.description} ${r.esDescription}`}
      entityLabel="category"
      columns={columns}
    />
  );
}
