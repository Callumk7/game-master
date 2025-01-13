import type { AuthTokens, User } from "./types.js";
import fetch from "cross-fetch";

export class AuthClient {
	private baseUrl: string;
	private accessToken: string | null;
	private refreshToken: string | null;
	private tokenRefreshPromise: Promise<void> | null = null;
	private authStateListeners: (() => void)[] = [];

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
		this.accessToken = localStorage.getItem("accessToken");
		this.refreshToken = localStorage.getItem("refreshToken");
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

		this.notifyAuthStateChange();
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
		this.persistTokens();
		this.notifyAuthStateChange();
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
		this.notifyAuthStateChange();
	}

	async getCurrentUser(): Promise<User> {
		return this.fetch<User>("api/protected/me");
	}

	async listUsers(tenantId: number): Promise<User[]> {
		return this.fetch<User[]>(`api/protected/tenants/${tenantId}/users`);
	}

	isAuthenticated(): boolean {
		console.log("isAuthenticated check:", {
			hasAccessToken: !!this.accessToken,
			token: this.accessToken,
		});
		return !!this.accessToken;
	}

	getAccessToken(): string | null {
		return this.accessToken;
	}

	private notifyAuthStateChange() {
		console.log("Notifying auth state change", {
			listenerCount: this.authStateListeners.length,
			isAuthenticated: this.isAuthenticated(),
		});
		this.authStateListeners.forEach((listener) => listener());
	}

	public subscribeToAuthStateChange(listener: () => void): () => void {
		this.authStateListeners.push(listener);
		return () => {
			this.authStateListeners = this.authStateListeners.filter(
				(l) => l !== listener,
			);
		};
	}

	private persistTokens() {
		if (this.accessToken && this.refreshToken) {
			localStorage.setItem("accessToken", this.accessToken);
			localStorage.setItem("refreshToken", this.refreshToken);
		} else {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
		}
	}
}
