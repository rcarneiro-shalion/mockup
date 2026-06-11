import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { LinkText } from "@/components/seeds/ListPrimitives";
import { usePersistentState } from "@/hooks/usePersistentState";
import { CATEGORIES_KEY, INITIAL_CATEGORIES, type SettingCategory } from "@/lib/settings";

export const Route = createFileRoute("/settings/categories/")({
  head: () => ({ meta: [{ title: "Categories — Shalion" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const [rows, setRows] = usePersistentState<SettingCategory[]>(CATEGORIES_KEY, INITIAL_CATEGORIES);
  const navigate = useNavigate();

  const columns: SettingsColumn<SettingCategory>[] = [
    { key: "sector", label: "Sector", sortValue: (r) => r.sector, cell: (r) => <span className="text-foreground/80">{r.sector}</span> },
    {
      key: "name",
      label: "Name",
      sortValue: (r) => r.name,
      cell: (r) => (
        <LinkText onClick={() => navigate({ to: "/settings/categories/$categoryId", params: { categoryId: r.id } })}>
          {r.name}
        </LinkText>
      ),
    },
    { key: "description", label: "Description", cell: (r) => <span className="block max-w-[220px] truncate text-foreground/80" title={r.description}>{r.description}</span> },
    { key: "esDescription", label: "ES description", cell: (r) => <span className="block max-w-[220px] truncate text-foreground/80" title={r.esDescription}>{r.esDescription}</span> },
    { key: "createdAt", label: "Created at", sortValue: (r) => r.createdAt, cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span> },
    { key: "updatedAt", label: "Updated at", sortValue: (r) => r.updatedAt, cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span> },
  ];

  return (
    <SettingsList
      title="Categories"
      newLabel="Add category"
      onNew={() => navigate({ to: "/settings/categories/new" })}
      searchPlaceholder="Search categories by name or descriptions"
      searchText={(r) => `${r.name} ${r.description} ${r.esDescription}`}
      entityLabel="category"
      columns={columns}
      rows={rows}
      onDelete={(id) => setRows((prev) => prev.filter((r) => r.id !== id))}
    />
  );
}
