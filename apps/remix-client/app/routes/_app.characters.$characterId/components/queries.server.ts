import { json, type AppLoadContext } from "@remix-run/cloudflare";
import { internalServerError, noContent } from "@repo/db";
import { patch, postDelete } from "~/lib/game-master";

// WARN: This logic has now been moved to the server.
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

// WARN: This logic has now been moved to the server.
export const handleUpdateCharacterName = async (
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

// NOTE: This is all that is required: 2024-06-13
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
