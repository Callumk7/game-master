import { SDK, type ServerResponse } from "@repo/api";
import { env } from "./env.server";
import { generateServerToken } from "./auth.server";

export const createApi = (userId: string) => {
	const serverToken = generateServerToken(userId);
	return new SDK({ baseUrl: env.SERVER_URL, apiKey: serverToken });
};

export function extractDataFromResponseOrThrow<T>(result: ServerResponse<T>) {
	if (!result.success) {
		throw new Response("Server Error", { status: 500 });
	}
	return result.data;
}
