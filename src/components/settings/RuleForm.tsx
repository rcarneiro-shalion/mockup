import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MoreHorizontal, Plus, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Th, Td, Pagination } from "@/components/seeds/ListPrimitives";
import { usePersistentState } from "@/hooks/usePersistentState";
import { RULES_KEY, INITIAL_RULES, type SettingRule, type RuleRef } from "@/lib/settings";
import { getClientNames } from "@/lib/clients";
import { getDashboardApps } from "@/lib/dashboardApps";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NONE = "__none__";
// Sample data groups available in the picker (no central data-group registry yet).
const DATA_GROUP_OPTIONS = ["Coca Cola Latam", "Coca Cola CCH", "Coca Cola EMEA", "Coca Cola APAC"];

type Tab = "scope" | "dashboard";

function emptyRule(): SettingRule {
  const stamp = new Date().toDateString();
  return {
    id: crypto.randomUUID(),
    name: "",
    prompt: "",
    client: "",
    datagroup: "",
    isVerified: false,
    scope: [],
    dashboardApps: [],
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export function RuleForm({ mode, initial }: { mode: "add" | "edit"; initial?: SettingRule }) {
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/settings/rules" });

  const [, setRules] = usePersistentState<SettingRule[]>(RULES_KEY, INITIAL_RULES);
  const [rule, setRule] = useState<SettingRule>(() => initial ?? emptyRule());
  const [tab, setTab] = useState<Tab>("scope");
  const [scopeOpen, setScopeOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);

  const set = <K extends keyof SettingRule>(k: K, v: SettingRule[K]) =>
    setRule((prev) => ({ ...prev, [k]: v }));

  const scope = rule.scope ?? [];
  const dashboardApps = rule.dashboardApps ?? [];
  const canSave = rule.name.trim().length > 0;

  const stamp = () => new Date().toDateString();
  const makeRef = (name: string): RuleRef => {
    const s = stamp();
    return { id: crypto.randomUUID(), name, createdAt: s, updatedAt: s };
  };

  const handleSave = () => {
    if (!canSave) {
      toast.error("Name is required");
      return;
    }
    const next: SettingRule = { ...rule, updatedAt: stamp() };
    if (mode === "add") {
      setRules((prev) => [next, ...prev]);
      toast.success(`Rule "${next.name}" created`);
    } else {
      setRules((prev) => prev.map((r) => (r.id === next.id ? next : r)));
      toast.success(`Rule "${next.name}" saved`);
    }
    goBack();
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Rule
            </button>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {mode === "add" ? "Add rule" : rule.name || "Rule"}
            </h1>
          </div>
          <button
            type="button"
            className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary"
            aria-label="More actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-5xl space-y-5">
            {/* Fields card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input value={rule.name} onChange={(e) => set("name", e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">
                    Prompt <span className="text-destructive">*</span>
                  </Label>
                  <textarea
                    value={rule.prompt}
                    onChange={(e) => set("prompt", e.target.value)}
                    rows={10}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-foreground/80">Client</Label>
                    <Select
                      value={rule.client || NONE}
                      onValueChange={(v) => set("client", v === NONE ? "" : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>—</SelectItem>
                        {getClientNames().map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-foreground/80">Data group</Label>
                    <Select
                      value={rule.datagroup || NONE}
                      onValueChange={(v) => set("datagroup", v === NONE ? "" : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a data group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>—</SelectItem>
                        {DATA_GROUP_OPTIONS.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="is-verified"
                    checked={!!rule.isVerified}
                    onCheckedChange={(v) => set("isVerified", v === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="is-verified" className="cursor-pointer">
                    <span className="text-sm font-medium text-foreground">Is verified</span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Define if the rule is verified by a human or not.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Tab strip */}
            <div className="border-b border-border">
              <div className="flex items-center gap-6">
                <TabButton active={tab === "scope"} onClick={() => setTab("scope")}>
                  Scope
                </TabButton>
                <TabButton active={tab === "dashboard"} onClick={() => setTab("dashboard")}>
                  Dashboard application
                </TabButton>
              </div>
            </div>

            {tab === "scope" ? (
              <RefCard
                title="Scope"
                addLabel="Assign scope"
                firstColLabel="Name"
                rows={scope}
                emptyLabel="No scope assigned yet."
                onAdd={() => setScopeOpen(true)}
                onRemove={(id) =>
                  set(
                    "scope",
                    scope.filter((r) => r.id !== id),
                  )
                }
              />
            ) : (
              <RefCard
                title="Dashboard Application"
                addLabel="Assign dashboard application"
                firstColLabel="Label"
                rows={dashboardApps}
                emptyLabel="No dashboard applications assigned yet."
                onAdd={() => setAppOpen(true)}
                onRemove={(id) =>
                  set(
                    "dashboardApps",
                    dashboardApps.filter((r) => r.id !== id),
                  )
                }
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={goBack}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            {mode === "add" ? "Add rule" : "Save rule"}
          </Button>
        </div>
      </div>

      <AssignScopeDialog
        open={scopeOpen}
        onOpenChange={setScopeOpen}
        onAdd={(name) => set("scope", [...scope, makeRef(name)])}
      />
      <AssignAppDialog
        open={appOpen}
        onOpenChange={setAppOpen}
        assignedLabels={dashboardApps.map((a) => a.name)}
        onAdd={(label) => set("dashboardApps", [...dashboardApps, makeRef(label)])}
      />
    </AppShell>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "-mb-px border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
        active
          ? "border-[var(--sidebar-active-fg)] text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function RefCard({
  title,
  addLabel,
  firstColLabel,
  rows,
  emptyLabel,
  onAdd,
  onRemove,
}: {
  title: string;
  addLabel: string;
  firstColLabel: string;
  rows: RuleRef[];
  emptyLabel: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-foreground">{title}</span>
        <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </Button>
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr>
              <Th>{firstColLabel}</Th>
              <Th>Created at</Th>
              <Th>Updated at</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <Td className="text-muted-foreground">
                  <span className="block py-2">{emptyLabel}</span>
                </Td>
                <Td />
                <Td />
                <Td />
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                  <Td className="text-foreground/90">{r.name}</Td>
                  <Td className="text-muted-foreground">{r.createdAt}</Td>
                  <Td className="text-muted-foreground">{r.updatedAt}</Td>
                  <Td>
                    <button
                      onClick={() => onRemove(r.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                      aria-label={`Remove ${r.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination total={rows.length} />
    </div>
  );
}

function AssignScopeDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const submit = () => {
    const n = name.trim();
    if (!n) return;
    onAdd(n);
    setName("");
    onOpenChange(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setName("");
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Assign scope</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="scope-name" className="text-foreground/80">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="scope-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Scope name"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim()}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AssignAppDialog({
  open,
  onOpenChange,
  assignedLabels,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  assignedLabels: string[];
  onAdd: (label: string) => void;
}) {
  const [search, setSearch] = useState("");
  const options = useMemo(() => {
    const all = getDashboardApps().map((a) => a.label);
    const q = search.trim().toLowerCase();
    return all
      .filter((l) => !assignedLabels.includes(l))
      .filter((l) => !q || l.toLowerCase().includes(q));
  }, [search, assignedLabels]);

  const choose = (label: string) => {
    onAdd(label);
    setSearch("");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setSearch("");
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Assign dashboard application</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dashboard applications"
            autoFocus
          />
          <div className="max-h-64 overflow-auto rounded-md border border-border">
            {options.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                No dashboard applications found.
              </p>
            ) : (
              options.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => choose(label)}
                  className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary"
                >
                  {label}
                </button>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
