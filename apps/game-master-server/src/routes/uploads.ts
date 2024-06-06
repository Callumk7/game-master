import { Context, Hono } from "hono";
import { Bindings } from "..";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { Buffer } from "node:buffer";
import { createS3Client } from "~/services/s3";
import { badRequestExeption } from "~/utils";
import { uuidv4 } from "callum-util";

const BUCKET_NAME = "game-master-images";

export const uploadsRoute = new Hono<{ Bindings: Bindings }>();

uploadsRoute.post("/", async (c) => {
	const file = await validateUpload(c);
	const buffer = await file.arrayBuffer().then(Buffer.from);
	const key = `img_${uuidv4()}`;
	const params: PutObjectCommandInput = {
		Bucket: BUCKET_NAME,
		Key: key,
		Body: buffer,
		ContentType: "image/png",
	};
	const s3 = createS3Client(c.env);
	await s3.send(new PutObjectCommand(params));
	return c.json({ key });
});

const validateUpload = async (c: Context<{ Bindings: Bindings }>) => {
	const body = await c.req.parseBody();
	// get the 'image' key for this file
	const key = "image";
	const image = body[key];
	if (!(image instanceof File)) {
		throw badRequestExeption("image is not a File");
	}
	return image;
};
