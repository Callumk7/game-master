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

// NOTE: This was used a while back, when I was experimenting with my own auth server,
// Once I am sure that I don't need anymore, I will remove.
// export const _createApiFromReq = async (req: Request) => {
// 	const auth = new AlligatorServer(1);
// 	try {
// 		const user = await auth.getUserFromRequest(req);
// 		const result = await db.query.users.findFirst({
// 			where: eq(users.authId, user.id),
// 			columns: {
// 				id: true,
// 			},
// 		});
// 		if (result) {
// 			const api = createApi(result.id);
// 			return { userId: result.id, api };
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		throw redirect("/login");
// 	}
// 	throw redirect("/login");
// };

export function extractDataFromResponseOrThrow<T>(result: ServerResponse<T>) {
	if (!result.success) {
		throw new Response("Server Error", { status: 500 });
	}
	return result.data;
}
