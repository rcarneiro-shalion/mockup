import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { fetchShalion } from "./shalion.server";

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
    }),
  )
  .handler(async ({ data }) => {
    return fetchShalion(data);
  });
