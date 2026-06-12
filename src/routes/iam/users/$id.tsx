import { createFileRoute } from "@tanstack/react-router";
import { UserDetailPage } from "@/components/iam/UserDetailPage";

export const Route = createFileRoute("/iam/users/$id")({
  head: () => ({ meta: [{ title: "User — Shalion" }] }),
  component: DetailComp,
});

function DetailComp() {
  const { id } = Route.useParams();
  return <UserDetailPage userId={id} />;
}
