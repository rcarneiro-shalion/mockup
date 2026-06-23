import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { LocationCatalogForm } from "@/components/retailers/LocationCatalogForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { LOCATION_CATALOGS_KEY, INITIAL_LOCATION_CATALOGS, type LocationCatalog } from "@/lib/retailers";
import { nowStamp } from "@/lib/clients";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/location-catalogs/$catalogId")({
  head: () => ({ meta: [{ title: "Edit location catalog — Shalion" }] }),
  component: EditLocationCatalogPage,
});

function EditLocationCatalogPage() {
  const { catalogId } = useParams({ from: "/location-catalogs/$catalogId" });
  const [rows, setRows] = usePersistentState<LocationCatalog[]>(LOCATION_CATALOGS_KEY, INITIAL_LOCATION_CATALOGS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/location-catalogs" });
  const c = rows.find((x) => x.id === catalogId);

  if (!c) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">Location catalog not found.</p>
          <Button variant="outline" onClick={goBack}>Back to Location Catalog</Button>
        </div>
      </AppShell>
    );
  }

  // Persist a catalog update in place (no navigation). Used by the outer Save AND by the
  // set-grid auto-save, so set/location edits survive leaving the page any way.
  const persist = (updated: LocationCatalog) =>
    setRows((p) => p.map((x) => (x.id === catalogId ? { ...updated, updatedAt: nowStamp() } : x)));

  return (
    <LocationCatalogForm
      mode="edit"
      initial={c}
      onCancel={goBack}
      onSave={(updated) => { persist(updated); goBack(); }}
      onAutoSave={persist}
      onDelete={() => { setRows((p) => p.filter((x) => x.id !== catalogId)); goBack(); }}
    />
  );
}
