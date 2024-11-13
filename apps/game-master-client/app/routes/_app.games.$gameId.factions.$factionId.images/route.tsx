import { type ActionFunctionArgs, type LoaderFunctionArgs, json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseParams } from "zodix";
import { ImageUploader } from "~/components/image-uploader";
import { Layout } from "~/components/layout";
import { createApiFromReq } from "~/lib/api.server";
import { getContentType } from "~/util/get-content-type";
import { badRequest, unsuccessfulResponse } from "~/util/responses";

const getParams = (params: Params) => {
  return parseParams(params, { factionId: z.string() }).factionId;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api, userId } = await createApiFromReq(request);
  const factionId = getParams(params);
  const factionImages = await api.factions.images.getAll(factionId);
  return typedjson({ factionImages, userId });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const factionId = getParams(params);
	const { api } = await createApiFromReq(request);
	const contentType = getContentType(request);
	const uploadStream = request.body;

	if (!contentType) {
		return badRequest("request does not contain content type");
	}

	if (!uploadStream) {
		return badRequest("request does not contain an upload stream");
	}
	const response = await api.factions.uploadImage(factionId, uploadStream, contentType);

	if (!response.success) {
		return unsuccessfulResponse("Server failed to upload image");
	}

	return json({ url: response.data.imageUrl });
};

export default function FactionImagesRoute() {
  const { factionImages, userId } = useTypedLoaderData<typeof loader>();
  return (
    <Layout width={"wide"}>
      <ImageUploader ownerId={userId} />
      <div className="grid grid-cols-4 gap-2">
        {factionImages.map((image) => (
          <img key={image.id} src={image.imageUrl} alt="Character" />
        ))}
      </div>
    </Layout>
  );
}
