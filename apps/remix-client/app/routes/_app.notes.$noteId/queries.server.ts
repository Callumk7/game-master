import { INTENT, IntentSchema, notesSelectSchema } from "@repo/db";
import { zx } from "zodix";
import { createZodFetcher } from "zod-fetch";

const masterFetch = createZodFetcher();

export const handleUpdateNote = async (request: Request, url: string) => {
	const { intent } = await zx.parseForm(request, { intent: IntentSchema });
	switch (intent) {
		case INTENT.UPDATE_NAME:
			masterFetch(notesSelectSchema, url, {
				method: "PATCH",
				body: JSON.stringify({noteId: })
			})
			break;

		default:
			break;
	}
};
