import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Bindings } from "..";
import { uuidv4 } from "callum-util";
import { HonoRequest } from "hono";
import { badRequestExeption } from "~/utils";

const REGION = "eu-west-2";
const BUCKET_NAME = "game-master-images";

export const createS3Client = (env: Bindings) => {
	return new S3Client({
		credentials: {
			accessKeyId: env.S3_ACCESS_KEY,
			secretAccessKey: env.S3_SECRET_KEY,
		},
		region: REGION,
	});
};

export const validateUpload = async (req: HonoRequest) => {
	const body = await req.parseBody();
	// get the 'image' key for this file
	const key = "image";
	const image = body[key];
	if (!(image instanceof File)) {
		throw badRequestExeption("image is not a File");
	}
	return image;
};

export const uploadToS3 = async (env: Bindings, file: File) => {
	const buffer = await file.arrayBuffer().then(Buffer.from);
	const contentType = file.type;
	const key = `img_${uuidv4()}`;
	const params: PutObjectCommandInput = {
		Bucket: BUCKET_NAME,
		Key: key,
		Body: buffer,
		ContentType: contentType,
	};
	const s3 = createS3Client(env);
	await s3.send(new PutObjectCommand(params));
	return key;
};
