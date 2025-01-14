import { SDK, type ServerResponse } from "@repo/api";
import { validateUser } from "./auth.server";
import { env } from "./env.server";

export const createApi = (token: string) => {
	return new SDK({ baseUrl: env.SERVER_URL, apiKey: token });
};

export const createApiFromReq = async (req: Request) => {
	const { userId, token } = await validateUser(req);
	const api = createApi(token);
	return { userId, api };
};

export function extractDataFromResponseOrThrow<T>(result: ServerResponse<T>) {
	if (!result.success) {
		throw new Response("Server Error", { status: 500 });
	}
	return result.data;
}
