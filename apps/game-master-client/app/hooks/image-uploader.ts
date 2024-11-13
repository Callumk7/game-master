import type { EntityType } from "@repo/api";

interface ImageUploadArgs {
	ownerId: string;
	entityId: string;
	gameId: string;
	entityType: EntityType;
}
export const useImageUpload = ({
	ownerId,
	entityId,
	gameId,
	entityType,
}: ImageUploadArgs) => {
	return async (file: File) => {
		const formData = new FormData();
		formData.append("image", file);
		formData.append("ownerId", ownerId);
		const response = await fetch(
			`/games/${gameId}/${entityType}/${entityId}/upload`,
			{
				method: "POST",
				body: formData,
			},
		);

		// TODO: Error handling
		const { url } = (await response.json()) as { url: string };
		return url;
	};
};
