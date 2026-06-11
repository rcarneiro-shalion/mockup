import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  Pill,
  SortTh,
  useSort,
  sortRows,
} from "@/components/seeds/ListPrimitives";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { BulkMethodsModal } from "./BulkMethodsModal";
import { usePersistentState } from "@/hooks/usePersistentState";
import { BULK_METHODS, BULK_GROUPS, type BulkMethod } from "@/lib/bulkMethods";
import { toast } from "sonner";
import { Plus, Upload, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "Completed" | "Processing" | "Queued" | "Partial" | "Failed";
type BulkProcess = {
  id: string;
  entity: string;
  action: string;
  fileName: string;
  status: Status;
  rows: number;
  errors: number;
  createdBy: string;
  createdAt: string;
};

const STATUS_TONE: Record<Status, "green" | "blue" | "slate" | "amber" | "red"> = {
  Completed: "green",
  Processing: "blue",
  Queued: "slate",
  Partial: "amber",
  Failed: "red",
};

const INITIAL: BulkProcess[] = [
  { id: "bp-1", entity: "Client Sku", action: "Upsert", fileName: "client-sku-coca-latam.xlsx", status: "Completed", rows: 1284, errors: 0, createdBy: "rcarneiro@shalion.com", createdAt: "Mon, Jun 9, 2026 9:12 AM" },
  { id: "bp-2", entity: "Seed with tags", action: "Upsert", fileName: "seeds-amazon-us-q2.xlsx", status: "Partial", rows: 980, errors: 12, createdBy: "dmolini@shalion.com", createdAt: "Mon, Jun 9, 2026 8:40 AM" },
  { id: "bp-3", entity: "Assortment", action: "Upsert", fileName: "assortment-walmart.xlsx", status: "Completed", rows: 540, errors: 0, createdBy: "mflores@shalion.com", createdAt: "Fri, Jun 6, 2026 4:20 PM" },
  { id: "bp-4", entity: "Brand", action: "Delete", fileName: "brands-cleanup.xlsx", status: "Failed", rows: 0, errors: 7, createdBy: "rcarneiro@shalion.com", createdAt: "Fri, Jun 6, 2026 11:05 AM" },
  { id: "bp-5", entity: "Store Sku", action: "Rematch (DK Change)", fileName: "store-sku-rematch.xlsx", status: "Completed", rows: 2310, errors: 3, createdBy: "alarco@shalion.com", createdAt: "Thu, Jun 5, 2026 2:18 PM" },
  { id: "bp-6", entity: "Sku Rpc", action: "Upsert", fileName: "sku-rpc-june.xlsx", status: "Queued", rows: 0, errors: 0, createdBy: "rcarneiro@shalion.com", createdAt: "Thu, Jun 5, 2026 10:00 AM" },
];

const stamp = () => new Date().toDateString();

export function BulkPage() {
  const [rows, setRows] = usePersistentState<BulkProcess[]>("bulk:processes:v1", INITIAL);
  const [q, setQ] = useState("");
  const sort = useSort();
  const [newOpen, setNewOpen] = useState(false);

  const ql = q.trim().toLowerCase();
  const filtered = ql
    ? rows.filter((r) =>
        [r.entity, r.action, r.fileName, r.status, r.createdBy].join(" ").toLowerCase().includes(ql),
      )
    : rows;
  const sorted = sortRows(filtered, sort);

  const startProcess = (m: BulkMethod, fileName: string) => {
    const proc: BulkProcess = {
      id: crypto.randomUUID(),
      entity: m.entity,
      action: m.action,
      fileName,
      status: "Processing",
      rows: 0,
      errors: 0,
      createdBy: "rcarneiro@shalion.com",
      createdAt: stamp(),
    };
    setRows((prev) => [proc, ...prev]);
    setNewOpen(false);
    toast.success(`Bulk ${m.action} for ${m.entity} started`);
    // Simulate the run finishing.
    setTimeout(() => {
      const total = 200 + Math.floor(Math.random() * 1800);
      const errors = Math.random() < 0.25 ? Math.floor(Math.random() * 15) : 0;
      setRows((prev) =>
        prev.map((p) =>
          p.id === proc.id
            ? { ...p, status: errors > 0 ? "Partial" : "Completed", rows: total, errors }
            : p,
        ),
      );
    }, 1900);
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">Bulk</h1>
          <div className="flex items-center gap-2">
            <BulkMethodsModal />
            <Button size="sm" className="h-8 gap-1.5" onClick={() => setNewOpen(true)}>
              <Plus className="h-4 w-4" /> New bulk process
            </Button>
          </div>
        </div>

        <div className="px-6 pt-1">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Import or update many records at once by uploading a spreadsheet. Open{" "}
            <span className="font-medium text-foreground">Bulk methods</span> for the catalogue of
            every supported operation and its example file, then start a new process below.
          </p>
        </div>

        <FilterBar search="Search processes by entity, file or status" searchValue={q} onSearchChange={setQ}>
          {null}
        </FilterBar>

        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="File" sortKey="fileName" sort={sort} />
              <SortTh label="Entity" sortKey="entity" sort={sort} />
              <SortTh label="Action" sortKey="action" sort={sort} />
              <SortTh label="Status" sortKey="status" sort={sort} />
              <SortTh label="Rows" sortKey="rows" sort={sort} />
              <SortTh label="Errors" sortKey="errors" sort={sort} />
              <SortTh label="Created by" sortKey="createdBy" sort={sort} />
              <SortTh label="Created at" sortKey="createdAt" sort={sort} />
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                <Td className="font-medium text-foreground">{r.fileName}</Td>
                <Td className="text-foreground/80">{r.entity}</Td>
                <Td className="text-foreground/80">{r.action}</Td>
                <Td>
                  <span className="inline-flex items-center gap-1.5">
                    {r.status === "Processing" && (
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />
                    )}
                    <Pill tone={STATUS_TONE[r.status]}>{r.status}</Pill>
                  </span>
                </Td>
                <Td className="tabular-nums text-foreground/80">{r.rows ? r.rows.toLocaleString("en-US") : "-"}</Td>
                <Td className={cn("tabular-nums", r.errors > 0 ? "text-rose-600" : "text-muted-foreground")}>
                  {r.errors || "-"}
                </Td>
                <Td className="text-muted-foreground">{r.createdBy}</Td>
                <Td className="whitespace-nowrap text-muted-foreground">{r.createdAt}</Td>
                <Td>
                  <RowActionsMenu
                    id={r.id}
                    entityLabel="bulk process"
                    onDelete={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>

        <Pagination total={sorted.length} />
      </div>

      <NewProcessDialog open={newOpen} onOpenChange={setNewOpen} onStart={startProcess} />
    </AppShell>
  );
}

function NewProcessDialog({
  open,
  onOpenChange,
  onStart,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onStart: (m: BulkMethod, fileName: string) => void;
}) {
  const [methodKey, setMethodKey] = useState("");
  const [fileName, setFileName] = useState("");

  const byKey = useMemo(() => {
    const map = new Map<string, BulkMethod>();
    for (const m of BULK_METHODS) map.set(`${m.entity}::${m.action}`, m);
    return map;
  }, []);
  const method = methodKey ? byKey.get(methodKey) : undefined;

  const reset = () => {
    setMethodKey("");
    setFileName("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>New bulk process</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground/80">
              Method <span className="text-destructive">*</span>
            </Label>
            <Select value={methodKey} onValueChange={setMethodKey}>
              <SelectTrigger>
                <SelectValue placeholder="Select an entity and action" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {BULK_GROUPS.map((g) => (
                  <SelectGroup key={g}>
                    <SelectLabel>{g}</SelectLabel>
                    {BULK_METHODS.filter((m) => m.group === g).map((m) => (
                      <SelectItem key={`${m.entity}::${m.action}`} value={`${m.entity}::${m.action}`}>
                        {m.entity} — {m.action}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          {method && (
            <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-3">
              <p className="text-sm leading-relaxed text-foreground/90">{method.goal}</p>
              {method.mandatoryFields.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {method.mandatoryFields.map((f) => (
                    <span
                      key={f}
                      className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[11px] text-foreground/80"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
              {method.fileUrl && (
                <a
                  href={method.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--sidebar-active-fg)] hover:underline"
                >
                  <Download className="h-3.5 w-3.5" /> Download example file
                </a>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground/80">
              File <span className="text-destructive">*</span>
            </Label>
            <button
              type="button"
              onClick={() => setFileName(method ? `${method.entity.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-5)}.xlsx` : "upload.xlsx")}
              className="flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
            >
              <Upload className="h-4 w-4" />
              {fileName || "Choose a filled .xlsx file"}
            </button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!method || !fileName} onClick={() => method && onStart(method, fileName)}>
            Run import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
