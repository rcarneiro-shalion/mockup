import { createFileRoute } from "@tanstack/react-router";
import { RuleForm } from "@/components/settings/RuleForm";

export const Route = createFileRoute("/settings/rules/new")({
  head: () => ({ meta: [{ title: "Add rule — Shalion" }] }),
  component: () => <RuleForm mode="add" />,
});
