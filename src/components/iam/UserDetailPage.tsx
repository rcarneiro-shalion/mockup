import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePersistentState } from "@/hooks/usePersistentState";
import { IAM_ACCOUNTS, accountById, userById, type Membership } from "@/lib/iamUsers";
import { ArrowLeft, Star, Building2, Layers, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const key = (accountId: string, dataGroupId: string) => `${accountId}::${dataGroupId}`;

export function UserDetailPage({ userId }: { userId: string }) {
  const user = userById(userId);

  const [memberships, setMemberships] = usePersistentState<Membership[]>(
    `iam:user-dg:${userId}:v2`,
    user?.memberships ?? [],
  );
  const [extraAccounts, setExtraAccounts] = usePersistentState<string[]>(
    `iam:user-dg-extra:${userId}:v2`,
    [],
  );

  const memberSet = useMemo(
    () => new Set(memberships.map((m) => key(m.accountId, m.dataGroupId))),
    [memberships],
  );
  const defaultByAccount = useMemo(() => {
    const map: Record<string, string> = {};
    for (const m of memberships) if (m.isDefault) map[m.accountId] = m.dataGroupId;
    return map;
  }, [memberships]);

  const shownAccountIds = useMemo(() => {
    const ids = new Set<string>([...memberships.map((m) => m.accountId), ...extraAccounts]);
    return IAM_ACCOUNTS.filter((a) => ids.has(a.id)).map((a) => a.id);
  }, [memberships, extraAccounts]);

  if (!user) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">User not found.</p>
          <Button asChild variant="outline">
            <Link to="/iam/users">Back to Users</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const toggleMember = (accountId: string, dataGroupId: string) => {
    setMemberships((prev) => {
      const exists = prev.some((m) => m.accountId === accountId && m.dataGroupId === dataGroupId);
      if (exists) {
        const removedWasDefault = prev.some(
          (m) => m.accountId === accountId && m.dataGroupId === dataGroupId && m.isDefault,
        );
        let next = prev.filter((m) => !(m.accountId === accountId && m.dataGroupId === dataGroupId));
        // keep exactly one default per account: promote a remaining member if needed
        if (removedWasDefault) {
          const remaining = next.find((m) => m.accountId === accountId);
          if (remaining)
            next = next.map((m) =>
              m.accountId === accountId
                ? { ...m, isDefault: m.dataGroupId === remaining.dataGroupId }
                : m,
            );
        }
        return next;
      }
      // first datagroup added to an account becomes its default automatically
      const accountHasMember = prev.some((m) => m.accountId === accountId);
      return [...prev, { accountId, dataGroupId, isDefault: !accountHasMember }];
    });
  };

  const setDefault = (accountId: string, dataGroupId: string) => {
    setMemberships((prev) => {
      const isMember = prev.some((m) => m.accountId === accountId && m.dataGroupId === dataGroupId);
      const base = isMember ? prev : [...prev, { accountId, dataGroupId, isDefault: false }];
      return base.map((m) =>
        m.accountId === accountId ? { ...m, isDefault: m.dataGroupId === dataGroupId } : m,
      );
    });
    const acc = accountById(accountId);
    const dg = acc?.dataGroups.find((d) => d.id === dataGroupId);
    if (dg) toast.success(`Default for ${acc?.domain}: ${dg.name}`);
  };

  const addableAccounts = IAM_ACCOUNTS.filter((a) => !shownAccountIds.includes(a.id));
  const totalDatagroups = memberships.length;

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <div>
            <Link
              to="/iam/users"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Users
            </Link>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{user.email}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-muted-foreground">
                {user.role}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-medium",
                  user.status === "Active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {user.status}
              </span>
              {user.internal && (
                <span className="rounded-full bg-violet-100 px-2 py-0.5 font-medium text-violet-700">
                  Internal (Shalion)
                </span>
              )}
              <span className="text-muted-foreground">
                · {totalDatagroups} datagroup{totalDatagroups === 1 ? "" : "s"} across{" "}
                {shownAccountIds.length} account{shownAccountIds.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Layers className="h-4 w-4 text-[var(--sidebar-active-fg)]" /> Data groups by account
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  A user can belong to many datagroups, even across accounts. Tick the datagroups they
                  can access and pick the <strong>default</strong> one per account (the context shown
                  first when they sign in).
                </p>
              </div>
              {addableAccounts.length > 0 && (
                <Select onValueChange={(v) => setExtraAccounts((p) => [...p, v])}>
                  <SelectTrigger className="h-8 w-[200px] shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <Plus className="h-3.5 w-3.5" /> Add account
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {addableAccounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-4">
              {shownAccountIds.map((accId) => {
                const acc = accountById(accId)!;
                const memberCount = acc.dataGroups.filter((d) => memberSet.has(key(accId, d.id))).length;
                const defDg = acc.dataGroups.find((d) => defaultByAccount[accId] === d.id);
                return (
                  <div key={accId} className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5">
                      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {acc.domain}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {memberCount} of {acc.dataGroups.length} ·{" "}
                        {defDg ? (
                          <>
                            default: <span className="font-medium text-foreground/80">{defDg.name}</span>
                          </>
                        ) : (
                          "no default"
                        )}
                      </span>
                    </div>
                    <ul className="divide-y divide-border">
                      {acc.dataGroups.map((dg) => {
                        const member = memberSet.has(key(accId, dg.id));
                        const isDefault = defaultByAccount[accId] === dg.id;
                        return (
                          <li key={dg.id} className="flex items-center gap-3 px-4 py-2.5">
                            <label className="flex flex-1 cursor-pointer items-center gap-2.5">
                              <Checkbox
                                checked={member}
                                onCheckedChange={() => toggleMember(accId, dg.id)}
                              />
                              <span className={cn("text-sm", member ? "text-foreground" : "text-muted-foreground")}>
                                {dg.name}
                              </span>
                            </label>
                            <button
                              type="button"
                              role="radio"
                              aria-checked={isDefault}
                              disabled={!member}
                              onClick={() => setDefault(accId, dg.id)}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                                isDefault
                                  ? "border-amber-300 bg-amber-50 text-amber-700"
                                  : member
                                    ? "border-border text-muted-foreground hover:bg-secondary"
                                    : "cursor-not-allowed border-transparent text-muted-foreground/30",
                              )}
                            >
                              <Star className={cn("h-3.5 w-3.5", isDefault && "fill-amber-400 text-amber-500")} />
                              {isDefault ? "Default" : "Set default"}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}

              {shownAccountIds.length === 0 && (
                <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                  This user has no datagroup yet. Use “Add account” to grant access.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
