import type { ReactNode } from "react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { Plus, TriangleAlert } from "lucide-react";

export function PlaceholderPage({
  title,
  addLabel,
  notice,
}: {
  title: string;
  addLabel?: string;
  /** Optional amber banner shown under the title (e.g. a deprecation notice). */
  notice?: ReactNode;
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
        {notice ? (
          <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <span className="leading-relaxed">{notice}</span>
          </div>
        ) : null}
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
