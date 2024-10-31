import { type ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { badRequest, unsuccessfulResponse } from "~/util/responses";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const api = createApi(userId);
	const { noteId } = parseParams(params, { noteId: z.string() });
	if (request.method === "POST") {
		const contentType = request.headers.get("Content-Type"); // TODO: should be a shared function
		const uploadStream = request.body;

		if (!contentType) {
			return badRequest("request does not contain content type");
		}

		if (!uploadStream) {
			return badRequest("request does not contain an upload stream");
		}

		// forward the request to the server
		const serverResponse = await api.notes.uploadImage(
			noteId,
			uploadStream,
			contentType,
		);

		if (!serverResponse.success) {
			return unsuccessfulResponse("Server failed to upload image");
		}

		return json(serverResponse.data);
	}
};
