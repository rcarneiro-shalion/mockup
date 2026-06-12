# IAM Users — many datagroups per user (spec TECH-14456) — Jun 2026

Spec "User navigating by many datagroups". Slide 6 (ERD AS-IS) proves the DB already
models USER ↔ DATA_GROUP as **N:M** (`USER_DATA_GROUP`: id, user_id, data_group_id);
the "a user can only have one DataGroup" message was only an application/API lock.
Decisions: identity = Cognito user id (email + account); `user_datagroup` gets a
**default (T/F)**; **exactly one default per user per account**; internal staff
(CS/Sales) can span datagroups across many client accounts.

## Built (slide 26 — IAM → Users → Detail)
- `src/lib/iamUsers.ts`: `IAM_ACCOUNTS` (account domain → its datagroups) + `IAM_USERS`
  (same ids/emails as IAM_SPECS["iam-users"]) with `memberships[] {accountId, dataGroupId, isDefault}`.
- `src/components/iam/UserDetailPage.tsx`: custom detail. Datagroups **grouped by account**;
  per row a **membership checkbox** + a **"Set default"/"Default" radio** (one default per
  account, amber star). First datagroup added to an account auto-becomes default; removing
  the default promotes another. "Add account" select grants access to another account.
  State persisted per user: `iam:user-dg:<id>:v2` + `iam:user-dg-extra:<id>:v2`.
- `src/routes/iam/users/$id.tsx` now renders `UserDetailPage` (was the generic EntityEditPage).
- `IAM_SPECS["iam-users"]`: added a **Datagroups** count column; accounts shown as domains
  (coca-cola.shalion, groupm.shalion, …). admin@shalion = 6 dg across 3 accounts (internal).
- `businessRules.ts` iamUsers: new "Data groups (many per user)" group — N:M, default per
  account, internal staff span clients, Cognito identity, lock removed.
- Bumped approx persistence key `:v2` → `:v3` (EntityList/EditPage) so the new Datagroups
  column re-seeds.

## Out of scope (noted, not built here)
The client-facing navigation (login account/context picker → "Your applications" →
"Select datagroup/parameters" → dashboard, datagroup selector shown only when >1) lives in
the client dashboard app (dashboard-frontend), not this admin console.
