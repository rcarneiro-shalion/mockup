import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SeedForm } from "@/components/seeds/SeedForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { SEEDS_KEY, INITIAL_SEEDS, type Seed } from "@/lib/seeds";

export const Route = createFileRoute("/seeds-api/seeds/$seedId")({
  head: () => ({ meta: [{ title: "Edit seed — Shalion" }] }),
  component: EditSeedPage,
});

function EditSeedPage() {
  const { seedId } = useParams({ from: "/seeds-api/seeds/$seedId" });
  const [seeds, setSeeds] = usePersistentState<Seed[]>(SEEDS_KEY, INITIAL_SEEDS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/seeds-api/seeds" });

  const seed = seeds.find((s) => s.id === seedId) ?? null;

  if (!seed) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">Seed not found.</p>
          <button onClick={goBack} className="text-sm text-[var(--sidebar-active-fg)] hover:underline">
            Back to Seeds
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <SeedForm
      type={seed.type ?? "URL"}
      initial={seed}
      onCancel={goBack}
      onSave={(updated) => {
        setSeeds((prev) => prev.map((s) => (s.id === seedId ? updated : s)));
        goBack();
      }}
      onDelete={() => {
        setSeeds((prev) => prev.filter((s) => s.id !== seedId));
        goBack();
      }}
    />
  );
}
