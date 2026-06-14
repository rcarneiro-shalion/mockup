import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage, type ApproxRow } from "@/components/common/EntityListPage";
import { IAM_SPECS } from "@/lib/iamEntities";

// --- live-data mapping (IAM applications → list rows) ---------------------
function pickArray(json: unknown): Record<string, unknown>[] {
  if (Array.isArray(json)) return json as Record<string, unknown>[];
  const o = (json ?? {}) as Record<string, unknown>;
  const cand = o.data ?? o.content ?? o.items ?? o.results ?? o.applications;
  return Array.isArray(cand) ? (cand as Record<string, unknown>[]) : [];
}
const str = (v: unknown): string => (v == null ? "" : String(v));
const fmtDate = (v: unknown): string => (typeof v === "string" ? v.replace("T", " ").slice(0, 16) : "");

function mapApplications(json: unknown): ApproxRow[] {
  return pickArray(json).map((a, i) => ({
    id: str(a.id ?? a.slug ?? i),
    name: str(a.name),
    slug: str(a.slug),
    creationDateTime: fmtDate(a.creationDateTime),
    lastUpdatedDateTime: fmtDate(a.lastUpdatedDateTime),
  }));
}

export const Route = createFileRoute("/iam/applications/")({
  head: () => ({ meta: [{ title: "Applications — Shalion" }] }),
  component: () => (
    <EntityListPage
      spec={IAM_SPECS["iam-applications"]}
      editBase={"/iam/applications"}
      live={{ service: "iam", env: "prod", path: "/v1.0/admin/applications", map: mapApplications }}
    />
  ),
});
