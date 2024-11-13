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
  return parseParams(params, { charId: z.string() }).charId;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { api, userId } = await createApiFromReq(request);
  const charId = getParams(params);
  const characterImages = await api.characters.images.getAll(charId);
  return typedjson({ characterImages, userId });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { api } = await createApiFromReq(request);
  const charId = getParams(params);
  if (request.method === "POST") {
    const contentType = getContentType(request);
    const uploadStream = request.body;

    if (!contentType) {
      return badRequest("request does not contain content type");
    }

    if (!uploadStream) {
      return badRequest("request does not contain an upload stream");
    }

    // forward the request to the server
    const serverResponse = await api.characters.images.upload(
      charId,
      uploadStream,
      contentType,
    );

    if (!serverResponse.success) {
      return unsuccessfulResponse("Server failed to upload image");
    }

    return json({ url: serverResponse.data.imageUrl });
  }
};

export default function CharacterImagesRoute() {
  const { characterImages, userId } = useTypedLoaderData<typeof loader>();
  return (
    <Layout width={"wide"}>
      <ImageUploader ownerId={userId} />
      <div className="grid grid-cols-4 gap-2">
        {characterImages.map((image) => (
          <img key={image.id} src={image.imageUrl} alt="Character" />
        ))}
      </div>
    </Layout>
  );
}
