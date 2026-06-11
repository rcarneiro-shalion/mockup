import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { SettingsList, type SettingsColumn } from "@/components/settings/SettingsList";
import { LinkText } from "@/components/seeds/ListPrimitives";
import { usePersistentState } from "@/hooks/usePersistentState";
import { TARGETS_KEY, INITIAL_TARGETS, type SettingTarget } from "@/lib/settings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings/targets")({
  head: () => ({ meta: [{ title: "Targets — Shalion" }] }),
  component: TargetsPage,
});

function TargetsPage() {
  const [rows, setRows] = usePersistentState<SettingTarget[]>(TARGETS_KEY, INITIAL_TARGETS);
  const [editing, setEditing] = useState<SettingTarget | "new" | null>(null);

  const columns: SettingsColumn<SettingTarget>[] = [
    { key: "name", label: "Name", sortValue: (r) => r.name, cell: (r) => <LinkText onClick={() => setEditing(r)}>{r.name}</LinkText> },
    { key: "defaultValue", label: "Default value", sortValue: (r) => r.defaultValue, cell: (r) => <span className="text-foreground/80">{r.defaultValue}</span> },
    { key: "createdAt", label: "Created at", sortValue: (r) => r.createdAt, cell: (r) => <span className="text-muted-foreground">{r.createdAt}</span> },
    { key: "updatedAt", label: "Updated at", sortValue: (r) => r.updatedAt, cell: (r) => <span className="text-muted-foreground">{r.updatedAt}</span> },
  ];

  const handleSave = (t: { name: string; defaultValue: string }) => {
    const stamp = new Date().toDateString();
    if (editing === "new") {
      setRows((p) => [{ id: crypto.randomUUID(), name: t.name, defaultValue: t.defaultValue, createdAt: stamp, updatedAt: stamp }, ...p]);
      toast.success(`Target "${t.name}" created`);
    } else if (editing) {
      const id = editing.id;
      setRows((p) => p.map((x) => (x.id === id ? { ...x, name: t.name, defaultValue: t.defaultValue, updatedAt: stamp } : x)));
      toast.success(`Target "${t.name}" saved`);
    }
    setEditing(null);
  };

  return (
    <SettingsList
      title="Targets"
      newLabel="New target"
      onNew={() => setEditing("new")}
      searchPlaceholder="Search by targets name"
      searchText={(r) => r.name}
      entityLabel="target"
      columns={columns}
      rows={rows}
      onDelete={(id) => setRows((p) => p.filter((x) => x.id !== id))}
      extra={editing && <TargetModal target={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSave={handleSave} />}
    />
  );
}

function TargetModal({
  target,
  onClose,
  onSave,
}: {
  target: SettingTarget | null;
  onClose: () => void;
  onSave: (t: { name: string; defaultValue: string }) => void;
}) {
  const [name, setName] = useState(target?.name ?? "");
  const [defaultValue, setDefaultValue] = useState(target?.defaultValue ?? "0");
  const isNew = target === null;

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add target" : "Edit target"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="target-name" className="text-foreground/80">Name <span className="text-destructive">*</span></Label>
            <Input id="target-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Target name" autoFocus />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="target-default" className="text-foreground/80">Default value <span className="text-destructive">*</span></Label>
            <Input id="target-default" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ name: name.trim(), defaultValue })} disabled={!name.trim()}>
            {isNew ? "Create target" : "Save target"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
