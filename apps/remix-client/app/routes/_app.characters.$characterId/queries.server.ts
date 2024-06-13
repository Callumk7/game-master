import { json, type AppLoadContext } from "@remix-run/cloudflare";
import { internalServerError, noContent } from "@repo/db";
import { patch, postDelete, put } from "~/lib/game-master";

export const handleUpdateCharacterBio = async (
	context: AppLoadContext,
	characterId: string,
	request: Request,
) => {
	const form = await request.formData();
	const bio = String(form.get("htmlContent"));
	form.append("bio", bio);
	const res = await patch(context, `characters/${characterId}`, form);

	if (res.ok) {
		return json(await res.json());
	}

	return internalServerError();
};

// export const handleUpdateCharacterName = async (
// 	context: AppLoadContext,
// 	characterId: string,
// 	request: Request,
// ) => {
// 	const form = await request.formData();
// 	const res = await patch(context, `characters/${characterId}`, form);
//
// 	if (res.ok) {
// 		return json(await res.json());
// 	}
//
// 	return internalServerError();
// };

export const handleForwardUpdateCharacterRequest = async (
	context: AppLoadContext,
	characterId: string,
	request: Request,
) => {
	const form = await request.formData();
	const res = await patch(context, `characters/${characterId}`, form);

	if (res.ok) {
		return json(await res.json());
	}

	return internalServerError();
};

export const handleDeleteCharacter = async (
	context: AppLoadContext,
	characterId: string,
	request: Request,
) => {
	const form = await request.formData();
	const res = await postDelete(context, `characters/${characterId}`, form);
	if (res.ok) {
		return noContent();
	}
	return internalServerError();
};

export const handleBulkLinkToCharacter = async (
	request: Request,
	context: AppLoadContext,
	characterId: string,
) => {
	const form = await request.formData();
	const res = await put(context, `characters/${characterId}/links`, form);
	return json(await res.json());
};
