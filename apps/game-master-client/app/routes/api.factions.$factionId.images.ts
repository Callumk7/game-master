import { type ActionFunctionArgs, json } from "react-router";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApiFromReq } from "~/lib/api.server";
import { getContentType } from "~/util/get-content-type";
import { badRequest, unsuccessfulResponse } from "~/util/responses";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { factionId } = parseParams(params, { factionId: z.string() });
	const { api } = await createApiFromReq(request);
	const contentType = getContentType(request);
	const uploadStream = request.body;

	if (!contentType) {
		return badRequest("request does not contain content type");
	}

	if (!uploadStream) {
		return badRequest("request does not contain an upload stream");
	}
	const response = await api.factions.images.upload(
		factionId,
		uploadStream,
		contentType,
	);

	if (!response.success) {
		return unsuccessfulResponse("Server failed to upload image");
	}

	return json({ url: response.data.imageUrl });
};
