import type { AppLoadContext } from "@remix-run/cloudflare";
import { createDrizzleForTurso, factions } from "@repo/db";
import { eq } from "drizzle-orm";
import { validateUser } from "~/lib/auth";

export const getFactionsAndMembers = async (
	context: AppLoadContext,
	request: Request,
) => {
	const userId = await validateUser(request);
	const db = createDrizzleForTurso(context.cloudflare.env);
	const data = await db.query.factions.findMany({
		where: eq(factions.userId, userId),
		with: {
			members: {
				with: {
					character: true,
				},
			},
			notes: {
				with: {
					note: true,
				},
			},
		},
	});

	return data;
};
