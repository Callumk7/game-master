import { type ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { badRequest, internalServerError } from "@repo/db";
import { createApi } from "~/lib/game-master";
import { extractParam } from "~/lib/zx-util";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const characterId = extractParam("characterId", params);
	const api = createApi(context);
	if (request.method === "POST") {
		const contentType = request.headers.get("Content-Type");
		const uploadStream = request.body;
		if (!contentType) {
			return badRequest("No Content-Type provided in request header");
		}
		if (!uploadStream) {
			return badRequest("No body provided in request");
		}
		// Handle forwarding the request to the Server
		const response = await api.post(`characters/${characterId}/uploads`, {
			headers: {
				"Content-Type": contentType, // We need the exact header from the client request
			},
			body: uploadStream,
		});
		// Check if the response is ok, if not, throw an error
		if (!response.ok) {
			throw new Response("Failed to forward request", { status: response.status });
		}
		const { key } = (await response.json()) as { key: string };
		return json({ key });
	}

	if (request.method === "DELETE") {
		const response = await api.delete(`characters/${characterId}/uploads`);
		if (response.ok) {
			return json({ characterId });
		}
		return internalServerError();
	}
};
