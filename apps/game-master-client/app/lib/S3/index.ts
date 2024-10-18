import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

const REGION = "eu-west-2";
const BUCKET_NAME = "game-master-images";

export const S3 = new S3Client({
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY!,
		secretAccessKey: process.env.S3_SECRET_KEY!,
	},
});
