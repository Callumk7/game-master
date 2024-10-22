import type { NoteWithPermissions, Permission } from "@repo/api";

export type PermissionTable = {
	isOwner: boolean;
	permissionLevel: Permission;
	canEditPermissions: boolean;
	canDelete: boolean;
};

export class NotesPermissionGenerator {
	userId: string;
	noteId: string;
	noteWithPermissions: NoteWithPermissions;
	userPermission?: Permission;

	constructor(
		userId: string,
		noteId: string,
		noteWithPermissions: NoteWithPermissions,
	) {
		this.userId = userId;
		this.noteId = noteId;
		this.noteWithPermissions = noteWithPermissions;
		this.userPermission = noteWithPermissions.permissions.find(
			(p) => p.userId === userId,
		)?.permission;
	}

	getPermissionTable(): PermissionTable {
		const isOwner = this.noteWithPermissions.ownerId === this.userId;
		if (isOwner) {
			return {
				isOwner,
				permissionLevel: "edit",
				canEditPermissions: true,
				canDelete: true,
			};
		}

		if (!this.userPermission) {
			switch (this.noteWithPermissions.visibility) {
				case "private":
					return {
						isOwner,
						permissionLevel: "none",
						canEditPermissions: false,
						canDelete: false,
					};

				case "public":
					return {
						isOwner,
						permissionLevel: "edit",
						canEditPermissions: false,
						canDelete: true,
					};
				case "viewable":
					return {
						isOwner,
						permissionLevel: "view",
						canEditPermissions: false,
						canDelete: false,
					};
			}
		}

		// user is not owner, has a permission
		switch (this.userPermission) {
			case "none":
				return {
					isOwner,
					permissionLevel: "none",
					canEditPermissions: false,
					canDelete: false,
				};
			case "view":
				return {
					isOwner,
					permissionLevel: "view",
					canEditPermissions: false,
					canDelete: false,
				};
			case "edit":
				return {
					isOwner,
					permissionLevel: "edit",
					canEditPermissions: false,
					canDelete: true,
				};
		}
	}
}
