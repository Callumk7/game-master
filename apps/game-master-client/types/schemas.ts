import { z } from "zod";

export const OptionalEntitySchema = z.array(z.string()).or(z.string()).optional();
