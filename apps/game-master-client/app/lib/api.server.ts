import { SDK, type ServerResponse } from "@repo/api";
import { SERVER_URL } from "~/config";

export const api = new SDK({ baseUrl: SERVER_URL, apiKey: "temp_key" });

export function extractDataFromResponseOrThrow<T>(result: ServerResponse<T>) {
	if (!result.success) {
		throw new Response("Server Error", { status: 500 });
	}
	return result.data;
}
