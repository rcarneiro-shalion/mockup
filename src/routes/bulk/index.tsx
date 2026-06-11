import { createFileRoute } from "@tanstack/react-router";
import { BulkManual } from "@/components/bulk/BulkManual";

export const Route = createFileRoute("/bulk/")({
  head: () => ({ meta: [{ title: "Bulk — Shalion" }] }),
  component: BulkManual,
});
