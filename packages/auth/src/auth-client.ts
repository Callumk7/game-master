import { LocalStorageAdapter } from "./adapters.js";
import type { AuthTokens, TokenStorage, User } from "./types.js";
import fetch from "cross-fetch";

export class AuthClient {
	private baseUrl: string;
	private accessToken: string | null;
	private refreshToken: string | null;
	private tokenRefreshPromise: Promise<void> | null = null;
	private tenantId: number;
	private storage: TokenStorage;

	constructor(baseUrl: string, tenantId: number, storage?: TokenStorage) {
		this.baseUrl = baseUrl;
		this.tenantId = tenantId;
		this.storage = storage || new LocalStorageAdapter();
		this.accessToken = this.storage.getItem("accessToken");
		this.refreshToken = this.storage.getItem("refreshToken");
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

	async login(email: string, password: string): Promise<void> {
		const response = await this.fetch<AuthTokens>("api/login", {
			method: "POST",
			body: JSON.stringify({ email, password, tenant_id: this.tenantId }),
		});

		console.log("Tokens set:", {
			hasAccessToken: !!this.accessToken,
			hasRefreshToken: !!this.refreshToken,
		});

		this.accessToken = response.access_token;
		this.refreshToken = response.refresh_token;
		this.persistTokens();
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
		this.persistTokens();
	}

	async getCurrentUser(): Promise<User> {
		return this.fetch<User>("api/protected/me");
	}

	async signUp(email: string, password: string): Promise<void> {
		const response = await this.fetch<AuthTokens>("api/register", {
			method: "POST",
			body: JSON.stringify({email, password, tenant_id: this.tenantId})
		})

		console.log("Tokens set:", {
			hasAccessToken: !!this.accessToken,
			hasRefreshToken: !!this.refreshToken,
		});

		this.accessToken = response.access_token;
		this.refreshToken = response.refresh_token;
		this.persistTokens();
	}

	hasToken(): boolean {
		console.log("isAuthenticated check:", {
			hasAccessToken: !!this.accessToken,
			token: this.accessToken,
		});
		return !!this.accessToken;
	}

	verifyToken() {

	}

	getAccessToken(): string | null {
		return this.accessToken;
	}

	private persistTokens() {
		if (this.accessToken && this.refreshToken) {
			this.storage.setItem("accessToken", this.accessToken);
			this.storage.setItem("refreshToken", this.refreshToken);
		} else {
			this.storage.removeItem("accessToken");
			this.storage.removeItem("refreshToken");
		}
	}
}
