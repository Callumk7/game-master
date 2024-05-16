import { z } from "zod";

export const sharedSchema = z.object({ id: z.string(), name: z.string() });
