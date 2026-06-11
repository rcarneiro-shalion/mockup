import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  CATEGORIES_KEY,
  INITIAL_CATEGORIES,
  type SettingCategory,
} from "@/lib/settings";
import { usePersistentState } from "@/hooks/usePersistentState";

const NO_PARENT = "__none__";

export function CategoryForm({
  mode,
  initial,
}: {
  mode: "add" | "edit";
  /** The category being edited. Omit / undefined for the add flow. */
  initial?: SettingCategory;
}) {
  const navigate = useNavigate();
  const [, setRows] = usePersistentState<SettingCategory[]>(CATEGORIES_KEY, INITIAL_CATEGORIES);

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [esDescription, setEsDescription] = useState(initial?.esDescription ?? "");
  const [parent, setParent] = useState(initial?.parent ?? "");

  const goBack = () => navigate({ to: "/settings/categories" });

  // Parent options: every other category's name (the form's own row is excluded on edit).
  const parentOptions = INITIAL_CATEGORIES.filter((c) => c.id !== initial?.id).map((c) => c.name);

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) {
      toast.error("Name is required");
      return;
    }
    const stamp = new Date().toDateString();
    if (mode === "add") {
      setRows((prev) => [
        {
          id: crypto.randomUUID(),
          sector: "Automotive",
          name: name.trim(),
          description,
          esDescription,
          parent: parent || undefined,
          createdAt: stamp,
          updatedAt: stamp,
        },
        ...prev,
      ]);
    } else if (initial) {
      setRows((prev) =>
        prev.map((c) =>
          c.id === initial.id
            ? { ...c, name: name.trim(), description, esDescription, parent: parent || undefined, updatedAt: stamp }
            : c,
        ),
      );
    }
    toast.success(`Category ${mode === "add" ? "created" : "saved"} successfully`);
    goBack();
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="px-6 pt-5">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Categories
          </button>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            {mode === "add" ? "Add category" : initial?.name || "Category"}
          </h1>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">Description</Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={cn(
                      "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
                      "placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">
                    🇪🇸 Spanish description
                  </Label>
                  <textarea
                    value={esDescription}
                    onChange={(e) => setEsDescription(e.target.value)}
                    rows={3}
                    className={cn(
                      "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
                      "placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">Parent category</Label>
                  <Select
                    value={parent || NO_PARENT}
                    onValueChange={(v) => setParent(v === NO_PARENT ? "" : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_PARENT}>None</SelectItem>
                      {parentOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={goBack}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            {mode === "add" ? "Add category" : "Save category"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
