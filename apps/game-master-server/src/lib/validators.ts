import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const userIdValidator = zValidator(
	"form",
	z.object({
		userId: z.string(),
	}),
);
