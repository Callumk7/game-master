import { type Session, createCookie, redirect } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";

const secret = "5upErsEce7"; // TODO: Yeah..

export const authCookie = createCookie("auth", {
	httpOnly: true,
	path: "/",
	sameSite: "lax",
	secrets: [secret],
	maxAge: 60 * 60 * 24 * 30, // 30 days
	secure: true,
});

export type SessionData = {
	userId: string;
	username: string;
	email: string;
};

type SessionFlashData = {
	error: string;
};

const { getSession, commitSession, destroySession } = createCookieSessionStorage<
	SessionData,
	SessionFlashData
>({
	cookie: authCookie,
});

export { getSession, commitSession, destroySession };

export const validateUser = async (request: Request): Promise<string> => {
	const session = await getSession(request.headers.get("Cookie"));
	const userId = session.get("userId");
	if (!userId) throw redirect("/login");
	return userId;
};

export const validateUserSession = async (request: Request) => {
	const session = await getSession(request.headers.get("Cookie"));
	if (!session.get("userId")) throw redirect("/login");
	return session;
};

export const getUserId = (session: Session<SessionData, SessionFlashData>) => {
	const userId = session.get("userId");
	if (!userId) throw redirect("/login");
	return userId;
};

export const getUserSession = async (request: Request) => {
	const session = await getSession(request.headers.get("Cookie"));
	return session;
};
