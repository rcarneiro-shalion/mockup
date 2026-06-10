import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function PlaceholderPage({
  title,
  addLabel,
}: {
  title: string;
  addLabel?: string;
}) {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">{title}</h1>
          {addLabel ? (
            <Button>
              <Plus className="h-4 w-4" />
              {addLabel}
            </Button>
          ) : null}
        </div>
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              This view will be designed in upcoming iterations.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
