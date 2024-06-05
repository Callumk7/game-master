import { S3Client } from "@aws-sdk/client-s3";
import { Bindings } from "..";

const REGION = "eu-west-2";

export const createS3Client = (env: Bindings) => {
	return new S3Client({
		credentials: {
			accessKeyId: env.S3_ACCESS_KEY,
			secretAccessKey: env.S3_SECRET_KEY,
		},
		region: REGION,
	});
};
