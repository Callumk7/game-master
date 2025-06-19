import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	type PutObjectCommandInput,
	S3Client,
} from "@aws-sdk/client-s3";
import "dotenv/config";
import { env } from "./env";
import { generateImageId } from "./ids";
import { uuidv4 } from "callum-util";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
	isRetryableError,
	parseAWSError,
	S3NotFoundError,
	S3PermissionError,
	S3ServiceError,
	S3ValidationError,
} from "~/utils/error-utils";

const REGION = "eu-west-2";
const BUCKET_NAME = "game-master-images";
const S3_BUCKET_URL = `https://game-master-images.s3.${REGION}.amazonaws.com`;

type __UploadOptions = {
	ownerId: string;
	entityId?: string;
};

const S3 = new S3Client({
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY,
		secretAccessKey: env.S3_SECRET_KEY,
	},
	region: REGION,
});

class Images {
	constructor(private s3: S3Client) {}

	async upload(image: File, { ownerId, entityId }: __UploadOptions) {
		const buffer = await image.arrayBuffer().then(Buffer.from);
		const contentType = image.type;

		const imageId = generateImageId();
		const key = this.createKey(ownerId, imageId, entityId);

		const uploadParams: PutObjectCommandInput = {
			Bucket: BUCKET_NAME,
			Key: key,
			Body: buffer,
			ContentType: contentType,
		};

		try {
			await this.s3.send(new PutObjectCommand(uploadParams));
		} catch (error) {
			console.error(error);
			throw new Error("S3 upload error");
		}

		return {
			imageId,
			imageUrl: `${S3_BUCKET_URL}/${key}`,
		};
	}

	private createKey(ownerId: string, imageId: string, entityId?: string): string {
		const entityFolder = entityId ? `${entityId}/` : "";
		return `${ownerId}/${entityFolder}${imageId}`;
	}
}

export const s3 = new Images(S3);

// NOTE: This is the new S3 Class that I will start to use through the application
interface S3Config {
	region: string;
	bucketName: string;
	accessKeyId?: string;
	secretAccessKey?: string;
	maxFileSize?: number; // in bytes
	allowedMimeTypes?: string[];
}

export interface UploadOptions {
	key?: string;
	contentType?: string;
	metadata?: Record<string, string>;
	tags?: Record<string, string>;
}

export interface UploadResult {
	key: string;
	url: string;
	size: number;
	contentType: string;
	etag: string;
}

export interface FileInfo {
	key: string;
	size: number;
	lastModified: Date;
	contentType: string;
	metadata?: Record<string, string>;
}

export class S3Service {
	private s3Client: S3Client;
	private config: S3Config;

	constructor(config: S3Config) {
		this.config = config;
		this.s3Client = new S3Client({
			region: config.region,
			credentials:
				config.accessKeyId && config.secretAccessKey
					? {
							accessKeyId: config.accessKeyId,
							secretAccessKey: config.secretAccessKey,
						}
					: undefined,
		});
	}

	/**
	 * Upload a file to S3 with comprehensive error handling
	 */
	async uploadFile(
		file: Buffer | Uint8Array | string,
		options: UploadOptions = {},
	): Promise<UploadResult> {
		try {
			// Validation with specific error types
			this.validateUploadInput(file, options);

			const key = options.key || this.generateUniqueKey(options.contentType);
			const fileSize = Buffer.isBuffer(file) ? file.length : file.length;

			const command = new PutObjectCommand({
				Bucket: this.config.bucketName,
				Key: key,
				Body: file,
				ContentType: options.contentType,
				Metadata: options.metadata,
				Tagging: options.tags ? this.objectToTagString(options.tags) : undefined,
			});

			const result = await this.executeWithRetry(
				() => this.s3Client.send(command),
				"upload",
				3, // max retries
			);

			return {
				key,
				url: this.getPublicUrl(key),
				size: fileSize,
				contentType: options.contentType || "application/octet-stream",
				etag: result.ETag || "",
			};
		} catch (error) {
			throw this.handleS3Error(error, "upload", { key: options.key });
		}
	}

	/**
	 * Delete a file from S3 with error handling
	 */
	async deleteFile(key: string): Promise<void> {
		try {
			if (!key || typeof key !== "string") {
				throw new S3ValidationError("Key must be a non-empty string");
			}

			const command = new DeleteObjectCommand({
				Bucket: this.config.bucketName,
				Key: key,
			});

			await this.executeWithRetry(() => this.s3Client.send(command), "delete", 3);
		} catch (error) {
			throw this.handleS3Error(error, "delete", { key });
		}
	}

	/**
	 * Delete multiple files from S3
	 */
	async deleteFiles(keys: string[]): Promise<void> {
		const deletePromises = keys.map((key) => this.deleteFile(key));
		await Promise.all(deletePromises);
	}

	/**
	 * Get file information with proper error handling
	 */
	async getFileInfo(key: string): Promise<FileInfo> {
		try {
			if (!key || typeof key !== "string") {
				throw new S3ValidationError("Key must be a non-empty string");
			}

			const command = new HeadObjectCommand({
				Bucket: this.config.bucketName,
				Key: key,
			});

			const result = await this.executeWithRetry(
				() => this.s3Client.send(command),
				"get",
				2,
			);

			return {
				key,
				size: result.ContentLength || 0,
				lastModified: result.LastModified || new Date(),
				contentType: result.ContentType || "application/octet-stream",
				metadata: result.Metadata,
			};
		} catch (error) {
			throw this.handleS3Error(error, "get", { key });
		}
	}

	/**
	 * Check if file exists with proper error handling
	 */
	async fileExists(key: string): Promise<boolean> {
		try {
			await this.getFileInfo(key);
			return true;
		} catch (error) {
			// Only return false for NotFound errors, re-throw others
			if (error instanceof S3NotFoundError) {
				return false;
			}
			throw error;
		}
	}

	/**
	 * Generate presigned URL for upload
	 */
	async getPresignedUploadUrl(
		key: string,
		contentType: string,
		expiresIn: number = 3600,
	): Promise<string> {
		const command = new PutObjectCommand({
			Bucket: this.config.bucketName,
			Key: key,
			ContentType: contentType,
		});

		return getSignedUrl(this.s3Client, command, { expiresIn });
	}

	/**
	 * Generate presigned URL for download
	 */
	async getPresignedDownloadUrl(
		key: string,
		expiresIn: number = 3600,
	): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.config.bucketName,
			Key: key,
		});

		return getSignedUrl(this.s3Client, command, { expiresIn });
	}

	/**
	 * Get public URL (for public buckets)
	 */
	getPublicUrl(key: string): string {
		return `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${key}`;
	}

	/**
	 * Generate unique key for file
	 */
	private generateUniqueKey(contentType?: string): string {
		const timestamp = Date.now();
		const uuid = uuidv4();
		const extension = this.getExtensionFromMimeType(contentType);

		return `uploads/${timestamp}-${uuid}${extension}`;
	}

	/**
	 * Get file extension from MIME type
	 */
	private getExtensionFromMimeType(mimeType?: string): string {
		const mimeToExt: Record<string, string> = {
			"image/jpeg": ".jpg",
			"image/png": ".png",
			"image/gif": ".gif",
			"image/webp": ".webp",
			"image/svg+xml": ".svg",
		};

		return mimeType ? mimeToExt[mimeType] || "" : "";
	}

	/**
	 * Convert object to tag string
	 */
	private objectToTagString(tags: Record<string, string>): string {
		return Object.entries(tags)
			.map(([key, value]) => `${key}=${value}`)
			.join("&");
	}

	/**
	 * Validate upload input
	 */
	private validateUploadInput(
		file: Buffer | Uint8Array | string,
		options: UploadOptions,
	): void {
		if (!file) {
			throw new S3ValidationError("File data is required");
		}

		const fileSize = Buffer.isBuffer(file) ? file.length : file.length;

		if (fileSize === 0) {
			throw new S3ValidationError("File cannot be empty");
		}

		if (this.config.maxFileSize && fileSize > this.config.maxFileSize) {
			throw new S3ValidationError(
				`File size ${fileSize} bytes exceeds maximum allowed size ${this.config.maxFileSize} bytes`,
			);
		}

		if (this.config.allowedMimeTypes && options.contentType) {
			if (!this.config.allowedMimeTypes.includes(options.contentType)) {
				throw new S3ValidationError(
					`MIME type '${options.contentType}' is not allowed. Allowed types: ${this.config.allowedMimeTypes.join(", ")}`,
				);
			}
		}
	}

	/**
	 * Execute operation with retry logic
	 */
	private async executeWithRetry<T>(
		operation: () => Promise<T>,
		operationName: string,
		maxRetries: number = 3,
		baseDelay: number = 1000,
	): Promise<T> {
		let lastError: unknown;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				return await operation();
			} catch (error) {
				lastError = error;

				// Don't retry on the last attempt or if error is not retryable
				if (attempt === maxRetries || !isRetryableError(error)) {
					throw error;
				}

				// Exponential backoff with jitter
				const delay = baseDelay * 2 ** attempt + Math.random() * 1000;
				await this.sleep(delay);

				console.warn(
					`Retrying ${operationName} operation (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms`,
				);
			}
		}

		throw lastError;
	}

	/**
	 * Handle and transform S3 errors into appropriate error types
	 */
	private handleS3Error(
		error: unknown,
		operation: string,
		// biome-ignore lint/suspicious/noExplicitAny: Unknown
		context?: Record<string, any>,
	): Error {
		const awsError = parseAWSError(error);

		// Handle specific AWS error codes
		switch (awsError.code) {
			case "NoSuchKey":
			case "NotFound":
				return new S3NotFoundError(context?.key || "unknown", error);

			case "AccessDenied":
			case "Forbidden":
				return new S3PermissionError(operation, error);

			case "InvalidBucketName":
			case "NoSuchBucket":
				return new S3ServiceError(
					`Bucket configuration error: ${awsError.message}`,
					operation,
					error,
					400,
				);

			case "EntityTooLarge":
				return new S3ValidationError("File size exceeds S3 limits", error);

			case "ThrottlingException":
			case "Throttling":
				return new S3ServiceError(
					"Request rate exceeded, please retry later",
					operation,
					error,
					429,
				);

			default:
				// Generic S3 service error
				return new S3ServiceError(
					`S3 ${operation} operation failed: ${awsError.message}`,
					operation,
					error,
					awsError.statusCode,
				);
		}
	}

	/**
	 * Sleep utility for retry delays
	 */
	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

export const s3Service = new S3Service({
	region: REGION,
	accessKeyId: env.S3_ACCESS_KEY,
	secretAccessKey: env.S3_SECRET_KEY,
	bucketName: BUCKET_NAME,
});
