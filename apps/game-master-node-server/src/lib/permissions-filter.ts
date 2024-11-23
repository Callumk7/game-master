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
		return true;
	}

	if (permissions) {
		const userPermission = permissions.find((p) => p.userId === userId);
		if (userPermission && userPermission.permission !== "none") {
			return true;
		}
	}

	if (visibility !== "private") {
		return true;
	}

	return false;
}
