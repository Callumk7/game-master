import type { AppLoadContext } from "@remix-run/cloudflare";
import { LINK_INTENT, internalServerError, noContent } from "@repo/db";
import { z } from "zod";
import { zx } from "zodix";
import { post } from "~/lib/game-master";

export const createNoteAndLinkToCharacter = async (
	request: Request,
	context: AppLoadContext,
	userId: string,
	characterId: string,
) => {
	const form = await request.formData(); // New note form data that has already been provided
	form.append("userId", userId);
	form.append("intent", LINK_INTENT.CHARACTERS);
	form.append("linkId", characterId);
	const res = await post(context, "notes", form);
	return await res.json();
};

export const linkNotesToCharacter = async (
	request: Request,
	context: AppLoadContext,
	characterId: string,
) => {
	const { noteId } = await zx.parseForm(request, { noteId: z.string() });
	const form = await request.formData();
	form.append("linkIds", characterId);
	const res = await post(context, `notes/${noteId}/links`, form);
	if (res.ok) {
		return noContent();
	}
	return internalServerError();
};
