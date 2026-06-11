import { createFileRoute } from "@tanstack/react-router";
import { BulkPage } from "@/components/bulk/BulkPage";

export const Route = createFileRoute("/bulk/")({
  head: () => ({ meta: [{ title: "Bulk — Shalion" }] }),
  component: BulkPage,
});
