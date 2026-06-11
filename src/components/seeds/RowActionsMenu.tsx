import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";
import { MoreVertical, Copy, Trash2 } from "lucide-react";

/**
 * Standard datagrid row actions: a "⋮" menu with Copy ID (to clipboard) and
 * Delete (with a confirmation prompt). Reused across every list in the app.
 */
export function RowActionsMenu({
  id,
  onDelete,
  entityLabel = "item",
}: {
  /** The row id copied to the clipboard. */
  id: string;
  /** Called after the user confirms deletion. Omit to hide the Delete action. */
  onDelete?: () => void;
  /** Used in the confirmation copy, e.g. "data group". */
  entityLabel?: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const copyId = () => {
    try {
      navigator?.clipboard?.writeText(id);
      toast.success("ID copied to clipboard");
    } catch {
      toast.error("Could not copy ID");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded p-1 text-muted-foreground hover:bg-secondary" aria-label="Row actions">
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={copyId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          {onDelete && (
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {entityLabel}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {entityLabel}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { onDelete?.(); setConfirmOpen(false); }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
