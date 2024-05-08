import { zValidator } from "@hono/zod-validator";
import { createCharacterRequest } from "@repo/db";
import { z } from "zod";

export const userIdValidator = zValidator(
	"form",
	z.object({
		userId: z.string(),
	}),
);

export const newCharacterValidator = zValidator(
	"json",
	createCharacterRequest
)
