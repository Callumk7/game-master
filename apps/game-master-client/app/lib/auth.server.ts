import { redirect } from "@remix-run/node";
import jwt from "jsonwebtoken";
import { env } from "./env.server";
import { AlligatorServer } from "alligator-auth";


const auth = new AlligatorServer(1);

export const validateUser = async (request: Request): Promise<string> => {
	try {
		const user = await auth.getUserFromRequest(request);
		return user.external_id!;
	} catch (error) {
		const refreshSuccess = await auth.refreshTokens(request);
		if (refreshSuccess.tokenRefreshed) {
			const user = await auth.getUserFromRequest(request);
			return user.external_id!;
		}
		throw redirect("/login")
	}
};

// JWT for server-to-server communication
export const generateServerToken = (userId: string) => {
	return jwt.sign({ userId }, env.SERVER_SECRET, { expiresIn: "1h" });
};
