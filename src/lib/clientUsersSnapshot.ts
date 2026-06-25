import type { Client, ClientUser } from "@/lib/clients";

/**
 * Pre-fetched SNAPSHOT of a client's users — what the section shows when NOT connected to the
 * live API (the deployed/Vercel build, or before a localhost Connect). The point is that the
 * "make-it-real" prototype shows realistic data everywhere, not an empty grid.
 *
 * Today this returns the curated seeded `client.users` (already shaped like real data). To bake
 * a REAL snapshot — so the hosted demo mirrors production — pull
 * `GET /v1.0/admin/datagroups` + `GET /v1.0/admin/user-datagroups` from
 * visualization-api-prod, filter to this client by exact name, map each row to a `ClientUser`
 * ({ id, email, status, dataGroupIds }), and return it here keyed by client id. Same read-only
 * overlay pattern as projectsBulk/storesBulk (baked into the bundle, never persisted, merged at
 * read) — see live-api-endpoints + mockup-storage-architecture notes. A refresh script can
 * regenerate the overlay whenever a fresh export is available.
 */
export function getClientUsersSnapshot(client: Client): ClientUser[] {
  return client.users ?? [];
}
