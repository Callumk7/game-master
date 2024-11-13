import type { EntityType } from "@repo/api";

interface ImageUploadArgs {
	ownerId: string;
	entityId: string;
	entityType: EntityType;
}
export const useImageUpload = ({
	ownerId,
	entityId,
	entityType,
}: ImageUploadArgs) => {
	return async (file: File) => {
		const formData = new FormData();
		formData.append("image", file);
		formData.append("ownerId", ownerId);
		const response = await fetch(
			`/api/${entityType}/${entityId}/images`,
			{
				method: "POST",
				body: formData,
				headers: {
					accept: "application/json",
				},
			},
		);

		// TODO: Error handling
		const { url } = (await response.json()) as { url: string };
		console.log(url);
		return url;
	};
};
