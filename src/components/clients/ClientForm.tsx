import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Client } from "@/lib/clients";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, ChevronUp, HelpCircle, Pencil, Trash2 } from "lucide-react";

export function ClientForm({
  mode,
  initial,
  onSave,
  onCancel,
  onDelete,
}: {
  mode: "add" | "edit";
  initial: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [client, setClient] = useState<Client>(initial);
  const [metaOpen, setMetaOpen] = useState(true);
  const [metaEditing, setMetaEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const set = <K extends keyof Client>(k: K, v: Client[K]) =>
    setClient((prev) => ({ ...prev, [k]: v }));

  const canSave = client.name.trim() && client.acronym.trim();

  const handleSave = async () => {
    if (!canSave) {
      toast.error("Name and Acronym are required");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onSave(client);
      toast.success(`Client ${mode === "add" ? "created" : "saved"} successfully`);
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Clients
            </button>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {mode === "add" ? "Add client" : client.name || "Client"}
            </h1>
          </div>
          {mode === "edit" && onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"
              aria-label="Delete client"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-5xl space-y-5">
            {/* Fields */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <Label className="text-sm font-medium text-foreground/80">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input value={client.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="flex items-center gap-1 text-sm font-medium text-foreground/80">
                    Acronym
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={client.acronym}
                    onChange={(e) => set("acronym", e.target.value.toUpperCase())}
                    maxLength={8}
                  />
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <input
                  id="is-test"
                  type="checkbox"
                  checked={client.isTest}
                  onChange={(e) => set("isTest", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border"
                />
                <label htmlFor="is-test" className="cursor-pointer">
                  <span className="text-sm font-medium text-foreground">Is test</span>
                  <p className="mt-1 text-sm text-muted-foreground">Check if this client is a fake client.</p>
                </label>
              </div>
            </div>

            {/* Meta properties */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMetaOpen((v) => !v)}
                  className="flex items-center gap-2"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
                    <ChevronUp className={cn("h-4 w-4 transition-transform", !metaOpen && "rotate-180")} />
                  </span>
                  <span className="text-base font-semibold text-foreground">Meta properties</span>
                </button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground"
                    onClick={() => set("meta", "{}")}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={() => setMetaEditing((v) => !v)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {metaEditing ? "Done" : "Edit"}
                  </Button>
                </div>
              </div>

              {metaOpen && (
                <textarea
                  value={client.meta}
                  onChange={(e) => set("meta", e.target.value)}
                  readOnly={!metaEditing}
                  spellCheck={false}
                  rows={metaEditing ? 6 : 1}
                  className={cn(
                    "mt-4 w-full rounded-md border border-input px-3 py-2 font-mono text-sm text-emerald-700 focus:outline-none focus:ring-1 focus:ring-ring",
                    metaEditing ? "bg-background" : "bg-secondary/40",
                  )}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !canSave}>
            {isSaving ? "Saving..." : mode === "add" ? "Add client" : "Save client"}
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { onDelete?.(); }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
