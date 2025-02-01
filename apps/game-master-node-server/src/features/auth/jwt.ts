import { decode, sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import { env } from "~/lib/env";

const JWT_EXPIRES_IN = "24h";

export const generateToken = async (payload: JWTPayload): Promise<string> => {
	return await sign(payload, env.SERVER_SECRET);
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
	try {
		return verify(token, env.SERVER_SECRET);
	} catch (error) {
		throw new Error("Invalid Token");
	}
};
