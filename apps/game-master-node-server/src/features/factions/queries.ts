import type {
	FactionWithPermissions,
	Permission,
	UpdateFactionRequestBody,
} from "@repo/api";
import { eq, sql } from "drizzle-orm";
import { db } from "~/db";
import {
	factions,
	factionsPermissions,
	type InsertDatabaseFaction,
} from "~/db/schema/factions";

export const createFaction = async (factionInsert: InsertDatabaseFaction) => {
	const newFaction = await db
		.insert(factions)
		.values(factionInsert)
		.returning()
		.then((result) => result[0]);

	if (!newFaction) {
		throw new Error("Error returning faction from the database.");
	}

	return newFaction;
};

export const updateFaction = async (
	factionId: string,
	factionData: UpdateFactionRequestBody,
) => {
	const factionUpdate = await db
		.update(factions)
		.set(factionData)
		.where(eq(factions.id, factionId))
		.returning()
		.then((result) => result[0]);

	if (!factionUpdate) {
		throw new Error("Failed to return data from the database");
	}

	return factionUpdate;
};

export const getFactionWithPermissions = async (
	factionId: string,
): Promise<FactionWithPermissions> => {
	const factionResult = await db.query.factions.findFirst({
		where: eq(factions.id, factionId),
		with: {
			permissions: {
				columns: {
					userId: true,
					permission: true,
				},
			},
		},
	});

	if (!factionResult) {
		throw new Error("Could not find faction in the database");
	}

	return factionResult;
};

export async function createFactionPermission(
	userId: string,
	factionId: string,
	permission: Permission,
) {
	const result = await db
		.insert(factionsPermissions)
		.values({
			userId,
			factionId,
			permission,
		})
		.onConflictDoUpdate({
			target: [factionsPermissions.userId, factionsPermissions.factionId],
			set: {
				permission: sql`excluded.permission`,
			},
		})
		.returning()
		.then((rows) => rows[0]);

	if (!result) {
		throw new Error("Error creating faction permission in database");
	}

	return result;
}
