export interface User {
	id: number;
	email: string;
	role: "admin" | "user";
	tenant_id: number;
	created_at: string;
	updated_at: string;
}

export interface AuthTokens {
	access_token: string;
	refresh_token: string;
}

export interface AuthError {
	error: string;
}