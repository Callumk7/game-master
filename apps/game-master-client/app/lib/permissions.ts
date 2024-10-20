import type { UserPermission, Visibility } from "@repo/api";

type EntityPermissionData = {
	ownerId: string;
	visbility: Visibility;
	permissions?: UserPermission[];
};

export function userHasVisibility(
	userId: string,
	{ ownerId, visbility, permissions }: EntityPermissionData,
) {
	if (userId === ownerId) {
		console.log("user is the owner")
		return true;
	}

	if (permissions) {
		const userPermission = permissions.find((p) => p.userId === userId);
		if (
			userPermission && userPermission.permission !== "none"
		) {
			console.log("user does not have a none permission")
			return true;
		}
	}

	if (visbility !== "private") {
		console.log("visibility is not private")
		return true;
	}

	console.log("entity is not visibile")
	return false;
}
