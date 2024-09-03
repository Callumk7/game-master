import { createCookieSessionStorage } from "@remix-run/node";

export type AuthSession = {
	accessToken: string;
	refreshToken: string;
	userId: string;
	email: string;
	expiresIn: number;
	expiresAt: number;
};

export const authSessionKey = "auth";

export type SessionData = {
	[authSessionKey]: AuthSession;
};

export type FlashData = { errorMessage: string };

export function createSessionStorage() {
	return createCookieSessionStorage({
		cookie: {
			name: "__authSession",
			httpOnly: true,
			path: "/",
			sameSite: "lax",
			secrets: [process.env.SESSION_SECRET!],
			secure: process.env.NODE_ENV === "production",
		},
	});
}
