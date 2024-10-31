import { SDK, type ServerResponse } from "@repo/api";
import { generateServerToken, validateUser } from "./auth.server";
import { env } from "./env.server";

export const createApi = (userId: string) => {
	const serverToken = generateServerToken(userId);
	return new SDK({ baseUrl: env.SERVER_URL, apiKey: serverToken });
};

export const createApiFromReq = async (req: Request) => {
	const userId = await validateUser(req);
	const api = createApi(userId);
	return { userId, api };
};

export function extractDataFromResponseOrThrow<T>(result: ServerResponse<T>) {
	if (!result.success) {
		throw new Response("Server Error", { status: 500 });
	}
	return result.data;
}
