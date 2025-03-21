import { type ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { getContentType } from "~/util/get-content-type";
import { badRequest, unsuccessfulResponse } from "~/util/responses";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { api } = await createApiFromReq(request);
	const { noteId } = parseParams(params, { noteId: z.string() });
	if (request.method === "POST") {
		const contentType = getContentType(request);
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

		return json({ url: serverResponse.data.imageUrl });
	}
};
