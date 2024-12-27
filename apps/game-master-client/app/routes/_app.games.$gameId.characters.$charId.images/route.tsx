import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { type Params, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { parseParams } from "zodix";
import ImageGrid from "~/components/image-grid";
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
  return { characterImages, userId };
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

    return { url: serverResponse.data.imageUrl };
  }
};

export default function CharacterImagesRoute() {
  const { characterImages, userId } = useLoaderData<typeof loader>();
  return (
    <Layout width={"wide"}>
      <ImageUploader ownerId={userId} />
      <ImageGrid images={characterImages} />
    </Layout>
  );
}
