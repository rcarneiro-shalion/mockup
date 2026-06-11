import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CategoryForm } from "@/components/settings/CategoryForm";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { CATEGORIES_KEY, INITIAL_CATEGORIES, type SettingCategory } from "@/lib/settings";

export const Route = createFileRoute("/settings/categories/$categoryId")({
  head: () => ({ meta: [{ title: "Edit category — Shalion" }] }),
  component: EditCategoryPage,
});

function EditCategoryPage() {
  const { categoryId } = Route.useParams();
  const [rows] = usePersistentState<SettingCategory[]>(CATEGORIES_KEY, INITIAL_CATEGORIES);
  const navigate = useNavigate();

  const category = rows.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">Category not found.</p>
          <Button variant="outline" onClick={() => navigate({ to: "/settings/categories" })}>
            Back to Categories
          </Button>
        </div>
      </AppShell>
    );
  }

  return <CategoryForm mode="edit" initial={category} />;
}
