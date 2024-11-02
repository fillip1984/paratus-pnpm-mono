import { z } from "zod";

import type { RouterOutputs } from "@acme/api";

export const PersistedSchema = z.object({
  id: z.string(),
});

export type Task = RouterOutputs["task"]["readAll"][number];
export type Project = RouterOutputs["project"]["readAll"][number];
export type Category = RouterOutputs["project"]["readAllCategories"][number];
