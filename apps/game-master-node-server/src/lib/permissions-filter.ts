import type { UserPermission, Visibility } from "@repo/api";

type FilterData = {
	ownerId: string;
	visibility: Visibility;
	permissions?: UserPermission[];
};

export function filterItems(
	userId: string,
	{ ownerId, visibility, permissions }: FilterData,
) {
	if (userId === ownerId) {
		console.log("user is the owner");
		return true;
	}

	if (permissions) {
		const userPermission = permissions.find((p) => p.userId === userId);
		if (userPermission && userPermission.permission !== "none") {
			console.log("user does not have a none permission");
			return true;
		}
	}

	if (visibility !== "private") {
		console.log("visibility is not private");
		return true;
	}

	console.log("entity is not visibile");
	return false;
}
