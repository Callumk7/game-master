import { redirect } from "@remix-run/node";
import jwt from "jsonwebtoken";
import { auth } from "./auth";
import { env } from "./env.server";

export const validateUser = async (request: Request): Promise<string> => {
	try {
		const data = await auth.api.getSession({
			headers: request.headers,
		});

		if (!data) {
			throw new Error("user not found when trying to get session from better-auth");
		}
		return data.user.id;
	} catch (error) {
		throw redirect("/login");
	}
};

// JWT for server-to-server communication
export const generateServerToken = (userId: string) => {
	return jwt.sign({ userId }, env.SERVER_SECRET, { expiresIn: "1h" });
};
