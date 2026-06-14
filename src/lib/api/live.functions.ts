import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { fetchShalion, mutateShalion } from "./shalion.server";

// Recursive JSON schema for a mutation body (matches JsonValue on the server).
const jsonValue: z.ZodType = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(jsonValue), z.record(z.string(), jsonValue)]),
);

// Server fn invoked from the client to consult a real Shalion develop API.
// The handler runs server-only, so the bearer token and the upstream request
// never reach the browser (and CORS is irrelevant — it's a server-to-server
// call). Read-only GET against an allow-listed service.
export const fetchLive = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      service: z.string().min(1),
      path: z.string().startsWith("/"),
      token: z.string().optional(),
      idToken: z.string().optional(),
      env: z.enum(["develop", "staging", "prod"]).optional(),
    }),
  )
  .handler(async ({ data }) => {
    return fetchShalion(data);
  });

// Allow-listed write (POST/DELETE) to a Shalion assignment endpoint. The proxy
// (mutateShalion) enforces the method + path allow-list server-side.
export const mutateLive = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      service: z.string().min(1),
      path: z.string().startsWith("/"),
      method: z.enum(["POST", "DELETE"]),
      body: jsonValue.optional(),
      token: z.string().optional(),
      idToken: z.string().optional(),
      env: z.enum(["develop", "staging", "prod"]).optional(),
    }),
  )
  .handler(async ({ data }) => {
    return mutateShalion(data);
  });
