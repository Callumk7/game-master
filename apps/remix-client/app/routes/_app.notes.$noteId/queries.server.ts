import { type AppLoadContext, json } from "@remix-run/cloudflare";
import { z } from "zod";
import { zx } from "zodix";
import { post, put } from "~/lib/game-master";

export const handleBulkLinkToNote = async (
	request: Request,
	context: AppLoadContext,
	noteId: string,
) => {
	const form = await request.formData();
	const res = await put(context, `notes/${noteId}/links`, form);
	return json(await res.json());
};

export const handleLinkNoteToFolder = async (
	request: Request,
	context: AppLoadContext,
	userId: string,
	noteId: string,
) => {
	const { folderName } = await zx.parseForm(request, { folderName: z.string() });
	const form = await request.formData();
	form.append("userId", userId);
	form.append("name", folderName);
	form.append("noteId", noteId);

	const res = await post(context, "folders", form);
	return json(await res.json());
};
