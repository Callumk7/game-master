import type {
	Note,
	NoteWithPermissions,
	Permission,
	UserPermission,
	Visibility,
} from "@repo/api";

type CanAccessArgs = {
	userId: string;
	ownerId: string;
	globalVisibility: Visibility;
	userPermissions?: UserPermission[];
};

export const PermissionService = {
	calculateUserPermissionLevel({
		userId,
		ownerId,
		globalVisibility,
		userPermissions,
	}: CanAccessArgs): Permission {
		if (ownerId === userId) return "edit";
		const userPermission = userPermissions?.find(
			(p) => p.userId === userId,
		)?.permission;
		if (userPermission) return userPermission;
		switch (globalVisibility) {
			case "private":
				return "none";

			case "public":
				return "edit";

			case "viewable":
				return "view";
		}
	},

	appendPermissionLevel(note: NoteWithPermissions, userId: string) {
		const noteUpdate = note;
		noteUpdate.userPermissionLevel = this.calculateUserPermissionLevel({
			userId,
			ownerId: note.ownerId,
			globalVisibility: note.visibility,
			userPermissions: note.permissions,
		});

		return noteUpdate;
	},
};
