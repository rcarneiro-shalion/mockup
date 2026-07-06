import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LocationCatalogForm } from "@/components/retailers/LocationCatalogForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { LOCATION_CATALOGS_KEY, INITIAL_LOCATION_CATALOGS, emptyLocationCatalog, type LocationCatalog } from "@/lib/retailers";
import { catalogTerms } from "@/lib/catalogTerms";

export const Route = createFileRoute("/location-catalogs/new")({
  head: () => ({ meta: [{ title: `${catalogTerms().addRoot} — Shalion` }] }),
  component: AddLocationCatalogPage,
});

function AddLocationCatalogPage() {
  const [, setRows] = usePersistentState<LocationCatalog[]>(LOCATION_CATALOGS_KEY, INITIAL_LOCATION_CATALOGS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/location-catalogs" });
  return <LocationCatalogForm mode="add" initial={emptyLocationCatalog()} onCancel={goBack} onSave={(c) => { setRows((p) => [...p, c]); goBack(); }} />;
}
