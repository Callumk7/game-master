import { createCookie } from "@remix-run/node";

const oneYear = 365 * 24 * 60 * 60 * 1000;

export const themeCookie = createCookie("theme", {
	maxAge: oneYear
})

export async function getTheme(request: Request) {
	const cookieHeader = request.headers.get("Cookie");
	const theme = await themeCookie.parse(cookieHeader);
	return theme || "system";
}
