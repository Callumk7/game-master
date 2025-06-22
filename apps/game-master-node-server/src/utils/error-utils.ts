export class S3ServiceError extends Error {
	constructor(
		message: string,
		public readonly operation: string,
		public readonly originalError?: unknown,
		public readonly statusCode?: number,
	) {
		super(message);
		this.name = "S3ServiceError";
	}
}

export class S3ValidationError extends S3ServiceError {
	constructor(message: string, originalError?: unknown) {
		super(message, "validation", originalError, 400);
		this.name = "S3ValidationError";
	}
}

export class S3NotFoundError extends S3ServiceError {
	constructor(key: string, originalError?: unknown) {
		super(`File not found: ${key}`, "get", originalError, 404);
		this.name = "S3NotFoundError";
	}
}

export class S3PermissionError extends S3ServiceError {
	constructor(operation: string, originalError?: unknown) {
		super(
			`Permission denied for operation: ${operation}`,
			operation,
			originalError,
			403,
		);
		this.name = "S3PermissionError";
	}
}

/**
 * Type guard to check if error is an Error instance
 */
export function isError(error: unknown): error is Error {
	return error instanceof Error;
}

/**
 * Type guard to check if error has a message property
 */
export function hasMessage(error: unknown): error is { message: string } {
	return typeof error === "object" && error !== null && "message" in error;
}

/**
 * Safely extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
	if (isError(error)) {
		return error.message;
	}

	if (hasMessage(error)) {
		return String(error.message);
	}

	if (typeof error === "string") {
		return error;
	}

	return "An unknown error occurred";
}

/**
 * Extract AWS-specific error information
 */
export function parseAWSError(error: unknown): {
	message: string;
	code?: string;
	statusCode?: number;
	requestId?: string;
} {
	const message = getErrorMessage(error);

	// AWS SDK errors typically have these properties
	if (typeof error === "object" && error !== null) {
		// biome-ignore lint/suspicious/noExplicitAny: dealing with S3
		const awsError = error as any;
		return {
			message,
			code: awsError.Code || awsError.code || awsError.name,
			statusCode: awsError.$metadata?.httpStatusCode || awsError.statusCode,
			requestId: awsError.$metadata?.requestId || awsError.requestId,
		};
	}

	return { message };
}

/**
 * Determine if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
	const awsError = parseAWSError(error);

	// Common retryable AWS error codes
	const retryableCodes = [
		"ThrottlingException",
		"Throttling",
		"TooManyRequestsException",
		"ServiceUnavailable",
		"InternalError",
		"RequestTimeout",
	];

	if (awsError.code && retryableCodes.includes(awsError.code)) {
		return true;
	}

	// HTTP status codes that are typically retryable
	if (awsError.statusCode) {
		return awsError.statusCode >= 500 || awsError.statusCode === 429;
	}

	return false;
}
