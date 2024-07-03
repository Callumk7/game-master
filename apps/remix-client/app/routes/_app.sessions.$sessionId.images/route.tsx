import { Container } from "~/components/layout";
import { Header } from "~/components/typeography";
import { badRequest, methodNotAllowed, type Image } from "@repo/db";
import { useSessionRouteData } from "../_app.sessions.$sessionId/route";
import { useCustomUploadButton } from "~/hooks/custom-upload-button";
import { json, useFetcher } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { extractParam } from "~/lib/zx-util";
import { createApi } from "~/lib/game-master";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const sessionId = extractParam("sessionId", params);
	const api = createApi(context);
	if (request.method === "POST") {
		const contentType = request.headers.get("Content-Type");
		const uploadStream = request.body;
		if (!contentType) {
			return badRequest("No Content-Type provided in request header");
		}
		if (!uploadStream) {
			return badRequest("No body provided in request");
		}
		// Handle forwarding the request to the Server
		const response = await api.post(`sessions/${sessionId}/uploads`, {
			headers: {
				"Content-Type": contentType, // We need the exact header from the client request
			},
			body: uploadStream,
		});
		// Check if the response is ok, if not, throw an error
		if (!response.ok) {
			throw new Response("Failed to forward request", { status: response.status });
		}
		const { key } = (await response.json()) as { key: string };
		return json({ key });
	}
	return methodNotAllowed();
};

export default function SessionImagesRoute() {
	const { session } = useSessionRouteData();
	const images = session.images;
	return (
		<Container width="max">
			<Header>Images</Header>
			<ImageUploader />
			{images && (
				<div>
					{images.map((image) => (
						<img
							key={image.id}
							src={image.imageUrl}
							alt="User uploaded session imagery"
						/>
					))}
				</div>
			)}
		</Container>
	);
}

// Ok, this is the main react component for uploading a series of images
// for the session route. The goal is very similar to the componennt used
// on the character route, but must handle an array of images, and the
// addition of images to that array once they have been uploaded to S3
function ImageUploader() {
	const { fileName, fileInputRef, handleInputClick, handleFileChange } =
		useCustomUploadButton();
	const fetcher = useFetcher();

	return (
		<fetcher.Form method="POST" encType="multipart/form-data">
			<input
				type="file"
				name="image"
				className="hidden"
				onChange={handleFileChange}
				ref={fileInputRef}
			/>
			{fileName ? (
				<div className="flex items-center gap-2">
					<Button type="submit">Submit</Button>
					<span className="text-xs font-light text-grade-10">{fileName}</span>
				</div>
			) : (
				<Button onPress={handleInputClick} variant="secondary">
					Upload File
				</Button>
			)}
		</fetcher.Form>
	);
}
