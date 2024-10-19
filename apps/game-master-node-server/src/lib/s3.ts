import {
	PutObjectCommand,
	S3Client,
	type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import "dotenv/config";
import { generateImageId } from "./ids";

const REGION = "eu-west-2";
const BUCKET_NAME = "game-master-images";
const S3_BUCKET_URL = `https://game-master-images.s3.${REGION}.amazonaws.com`;

type UploadOptions = {
	ownerId: string;
	entityId?: string;
};

const S3 = new S3Client({
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY!,
		secretAccessKey: process.env.S3_SECRET_KEY!,
	},
	region: REGION,
});

class Images {
	constructor(private s3: S3Client) {}

	async upload(image: File, { ownerId, entityId }: UploadOptions) {
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
