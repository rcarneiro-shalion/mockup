import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SeedForm } from "@/components/seeds/SeedForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { SEEDS_KEY, INITIAL_SEEDS, type Seed, type SeedType } from "@/lib/seeds";

const VALID_TYPES: SeedType[] = ["URL", "API", "KEYWORD", "PDP"];

export const Route = createFileRoute("/seeds-api/seeds/new")({
  validateSearch: (search: Record<string, unknown>): { type: SeedType } => {
    const t = String(search.type ?? "").toUpperCase();
    return { type: (VALID_TYPES.includes(t as SeedType) ? t : "URL") as SeedType };
  },
  head: () => ({ meta: [{ title: "Add seed — Shalion" }] }),
  component: AddSeedPage,
});

function AddSeedPage() {
  const { type } = Route.useSearch();
  const [, setSeeds] = usePersistentState<Seed[]>(SEEDS_KEY, INITIAL_SEEDS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/seeds-api/seeds" });

  return (
    <SeedForm
      type={type}
      onCancel={goBack}
      onSave={(seed) => {
        setSeeds((prev) => [...prev, seed]);
        goBack();
      }}
    />
  );
}
