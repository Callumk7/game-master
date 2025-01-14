export class ApiError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public code?: string
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export class DatabaseError extends ApiError {
	constructor(message = "Database Error") {
		super(message, 500, 'DATABASE_ERROR');
		this.name = "DatabaseError";
	}
}

export class AuthenticationError extends ApiError {
	constructor(message = "Authentication failed") {
		super(message, 401, 'AUTH_ERROR');
		this.name = "AuthenticationError";
	}
}

export class NotFoundError extends ApiError {
	constructor(resource: string) {
		super(`${resource} not found`, 404, 'NOT_FOUND');
		this.name = "NotFoundError";
	}
}

export class ValidationError extends ApiError {
	constructor(message: string) {
		super(message, 400, 'VALIDATION_ERROR');
		this.name = "ValidationError";
	}
}
