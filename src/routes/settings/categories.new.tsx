import { createFileRoute } from "@tanstack/react-router";
import { CategoryForm } from "@/components/settings/CategoryForm";

export const Route = createFileRoute("/settings/categories/new")({
  head: () => ({ meta: [{ title: "Add category — Shalion" }] }),
  component: AddCategoryPage,
});

function AddCategoryPage() {
  return <CategoryForm mode="add" />;
}
