import { z } from "zod";

export type Id = string;

type SuccessfulResponse<T> = { success: true; data: T };
type UnsuccessfulResponse = { success: false; message: string };
export type ServerResponse<T> = SuccessfulResponse<T> | UnsuccessfulResponse;
export type BasicServerResponse = { success: boolean };

export interface BasicEntity {
	id: Id;
	name: string;
	gameId: string;
}

export interface BasicEntityWithDates extends BasicEntity {
	createdAt: Date;
	updatedAt: Date;
}

export type EntityType = "notes" | "characters" | "factions" | "folders";

export const visibilitySchema = z.enum(["public", "private", "viewable"]);
export type Visibility = z.infer<typeof visibilitySchema>;

export type QueryOptions = {
	limit?: number;
	offset?: number;
};

export const OptionalEntitySchema = z.array(z.string()).or(z.string()).optional();

export const permissionSchema = z.enum(["none", "view", "edit"]);
export type Permission = z.infer<typeof permissionSchema>;

export interface UserPermission {
	userId: Id;
	permission: Permission;
}

export const createPermissionSchema = z.object({
	userId: z.string(),
	permission: permissionSchema,
});
export type CreatePermissionRequestBody = z.infer<typeof createPermissionSchema>;
