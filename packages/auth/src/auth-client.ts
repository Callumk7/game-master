import type { AuthTokens, User } from "./types";
import fetch from "cross-fetch";

export class AuthClient {
	private baseUrl: string;
	private accessToken: string | null;
	private refreshToken: string | null;
	private tokenRefreshPromise: Promise<void> | null = null;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
		this.accessToken = null;
		this.refreshToken = null;
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

		this.accessToken = response.access_token;
		this.refreshToken = response.refresh_token;
	}

	async logout(): Promise<void> {
		if (this.refreshToken) {
			await this.fetch("api/logout", {
				method: "POST",
				body: JSON.stringify({ refresh_token: this.refreshToken }),
			});
		}

		this.accessToken = null;
		this.refreshToken = null;
	}

	async getCurrentUser(): Promise<User> {
		return this.fetch<User>("api/protected/me");
	}

	async listUsers(tenantId: number): Promise<User[]> {
		return this.fetch<User[]>(`api/protected/tenants/${tenantId}/users`);
	}

	isAuthenticated(): boolean {
		return !!this.accessToken;
	}

	getAccessToken(): string | null {
		return this.accessToken;
	}
}
