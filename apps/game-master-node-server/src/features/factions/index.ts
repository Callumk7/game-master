import {
	createFactionSchema,
	createPermissionSchema,
	duplicateFactionSchema,
	updateFactionSchema,
} from "@repo/api";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { factions } from "~/db/schema/factions";
import {
	basicSuccessResponse,
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { generateFactionId } from "~/lib/ids";
import { getPayload } from "~/lib/jwt";
import { PermissionService } from "~/services/permissions";
import {
	createFaction,
	createFactionPermission,
	getFactionImages,
	getFactionMembers,
	getFactionWithPermissions,
	updateFaction,
} from "./queries";
import { createFactionInsert } from "./util";
import { validateUploadIsImageOrThrow } from "~/utils";
import { s3 } from "~/lib/s3";
import { images } from "~/db/schema/images";

export const factionRoute = new Hono();

const getFaction = async (factionId: string) => {
	return await db.query.factions.findFirst({
		where: eq(factions.id, factionId),
	});
};

factionRoute.get("/:factionId", async (c) => {
	const factionId = c.req.param("factionId");
	try {
		const factionResult = await getFaction(factionId);
		if (!factionResult) {
			return handleNotFound(c);
		}
		return c.json(factionResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

factionRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createFactionSchema, c);

	const newFactionInsert = createFactionInsert(data);

	try {
		const newFaction = await createFaction(newFactionInsert);
		return successResponse(c, newFaction);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

factionRoute.delete("/:factionId", async (c) => {
	const factionId = c.req.param("factionId");
	try {
		await db.delete(factions).where(eq(factions.id, factionId));
		return basicSuccessResponse(c);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

factionRoute.patch("/:factionId", async (c) => {
	const factionId = c.req.param("factionId");
	const data = await validateOrThrowError(updateFactionSchema, c);

	try {
		const factionUpdate = await updateFaction(factionId, data);
		return successResponse(c, factionUpdate);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

factionRoute.post("/:factionId/duplicate", async (c) => {
	const factionId = c.req.param("factionId");
	const data = await validateOrThrowError(duplicateFactionSchema, c);
	try {
		const faction = await getFaction(factionId);
		if (!faction) return handleNotFound(c);
		const currentDate = new Date();
		const newFaction = await db
			.insert(factions)
			.values({
				...faction,
				id: generateFactionId(),
				name: data.name,
				ownerId: data.ownerId,
				createdAt: currentDate,
				updatedAt: currentDate,
			})
			.returning()
			.then((result) => result[0]);
		return successResponse(c, newFaction);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

factionRoute.get("/:factionId/permissions", async (c) => {
	const factionId = c.req.param("factionId");
	const { userId } = getPayload(c);
	try {
		const factionResult = await getFactionWithPermissions(factionId);
		const userPermissionLevel = PermissionService.calculateUserPermissionLevel({
			userId,
			ownerId: factionResult.ownerId,
			globalVisibility: factionResult.visibility,
			userPermissions: factionResult.permissions,
		});
		factionResult.userPermissionLevel = userPermissionLevel;
		return c.json(factionResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

factionRoute.post("/:factionId/permissions", async (c) => {
	const factionId = c.req.param("factionId");
	const data = await validateOrThrowError(createPermissionSchema, c);
	try {
		const newPermission = await createFactionPermission(
			data.userId,
			factionId,
			data.permission,
		);
		return successResponse(c, newPermission);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

factionRoute.get("/:factionId/members", async (c) => {
	const factionId = c.req.param("factionId");
	try {
		const factionMembersResult = await getFactionMembers(factionId);
		return c.json(factionMembersResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

////////////////////////////////////////////////////////////////////////////////
//                                IMAGES
////////////////////////////////////////////////////////////////////////////////

factionRoute.post("/:factionId/cover", async (c) => {
	const factionId = c.req.param("factionId");
	const { ownerId, image } = await validateUploadIsImageOrThrow(c.req);
	let imageUrl: string;
	try {
		const result = await s3.upload(image, { ownerId, entityId: factionId });
		imageUrl = result.imageUrl;
	} catch (error) {
		console.error(error);
		return handleDatabaseError(c, "The error was caught in the images route");
	}

	try {
		// could be a function shared with the service above
		const update = await db
			.update(factions)
			.set({ coverImageUrl: imageUrl })
			.where(eq(factions.id, factionId))
			.returning();

		return successResponse(c, update);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

factionRoute.post("/:factionId/images", async (c) => {
	const factionId = c.req.param("factionId");
	const { ownerId, image } = await validateUploadIsImageOrThrow(c.req);
	let imageUrl: string;
	let imageId: string;
	try {
		const result = await s3.upload(image, { ownerId, entityId: factionId });
		imageUrl = result.imageUrl;
		imageId = result.imageId;
	} catch (error) {
		console.error(error);
		return handleDatabaseError(c, "The error was caught in the images route");
	}

	try {
		const imageResult = await db
			.insert(images)
			.values({ id: imageId, ownerId, factionId: factionId, imageUrl })
			.returning()
			.then((result) => result[0]);

		if (!imageResult) {
			return handleDatabaseError(c, "image result not returned from database");
		}

		return successResponse(c, imageResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

factionRoute.get("/:factionId/images", async (c) => {
	const factionId = c.req.param("factionId");
	try {
		const factionImages = await getFactionImages(factionId);
		return c.json(factionImages)
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
