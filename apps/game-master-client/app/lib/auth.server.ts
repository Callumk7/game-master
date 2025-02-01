import { type Session, createCookie, redirect } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";
import jwt from "jsonwebtoken";
import { env } from "./env.server";

const secret = "5upErsEce7";

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

// JWT for server-to-server communication
export const generateServerToken = (userId: string) => {
	return jwt.sign({ userId }, env.SERVER_SECRET, { expiresIn: "1h" });
};

// Using an auth token from a third party server
export class AuthClient {
	private baseUrl: string;
	private accessToken: string | null;
	private refreshToken: string | null;
	private tokenRefreshPromise: Promise<void> | null = null;

	constructor(
		baseUrl: string,
		accessToken?: string | null,
		refreshToken?: string | null,
	) {
		this.baseUrl = baseUrl;
		this.accessToken = accessToken ?? null;
		this.refreshToken = refreshToken ?? null;
	}

	private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}/${endpoint}`;
		const headers = new Headers({
			"Content-Type": "application/json",
			...options.headers,
		});

		if (this.accessToken) {
			headers.set("Authorization", `Bearer ${this.accessToken}`);
		}

		const response = await fetch(url, {
			...options,
			headers,
		});

		if (response.status === 401 && this.refreshToken) {
			await this.refreshAccessToken();
			headers.set("Authorization", `Bearer ${this.accessToken}`);
			const retryResponse = await fetch(url, {
				...options,
				headers,
			});
			return retryResponse.json();
		}

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	}

	private async refreshAccessToken(): Promise<void> {
		if (this.tokenRefreshPromise) {
			return this.tokenRefreshPromise;
		}

		this.tokenRefreshPromise = (async () => {
			try {
				const response = await this.fetch<AuthTokens>("/api/refresh", {
					method: "POST",
					body: JSON.stringify({ refresh_token: this.refreshToken }),
				});

				this.accessToken = response.access_token;
				this.refreshToken = response.refresh_token;
			} finally {
				this.tokenRefreshPromise = null;
			}
		})();

		return this.tokenRefreshPromise;
	}

	async login(email: string, password: string, tenantId: number): Promise<void> {
		const response = await this.fetch<AuthTokens>("api/login", {
			method: "POST",
			body: JSON.stringify({ email, password, tenant_id: tenantId }),
		});

		console.log("Tokens set:", {
			hasAccessToken: !!this.accessToken,
			hasRefreshToken: !!this.refreshToken,
		});

		this.accessToken = response.access_token;
		this.refreshToken = response.refresh_token;
	}
}

export interface AuthTokens {
	access_token: string;
	refresh_token: string;
}

export function extractJwtFromHeaders(req: Request): string | null {
	// Get the Authorization header
	const authHeader = req.headers.get("Authorization");

	// Check if header exists and starts with 'Bearer '
	if (authHeader?.startsWith("Bearer ")) {
		// Extract and return the token (everything after 'Bearer ')
		return authHeader.split(" ")[1].trim();
	}

	// Return null if no valid JWT is found
	return null;
}
