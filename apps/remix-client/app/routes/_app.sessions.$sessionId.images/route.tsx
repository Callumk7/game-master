import { Container } from "~/components/layout";
import { Header } from "~/components/typeography";
import { badRequest, methodNotAllowed, type Image, internalServerError } from "@repo/db";
import { useSessionRouteData } from "../_app.sessions.$sessionId/route";
import { useCustomUploadButton } from "~/hooks/custom-upload-button";
import { json, useFetcher } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { extractParam } from "~/lib/zx-util";
import { createApi } from "~/lib/game-master";
import { Cross1Icon } from "@radix-ui/react-icons";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const sessionId = extractParam("sessionId", params);
	const api = createApi(context);
	if (request.method === "POST") {
		const contentType = request.headers.get("Content-Type"); // Required for forwarding the request to the server
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
	if (request.method === "DELETE") {
		const form = await request.formData();
		const response = await api.delete(`sessions/${sessionId}/uploads`, { body: form });
		if (response.ok) {
			return json({ sessionId });
		}
		return internalServerError();
	}
	return methodNotAllowed();
};

export default function SessionImagesRoute() {
	const { session } = useSessionRouteData();
	const images = session.images;
	return (
		<Container width="max" className="space-y-4">
			<Header style="h2">Images</Header>
			<ImageUploader />
			{images && (
				<div className="flex flex-wrap gap-4">
					{images.map((image) => (
						<ImagePreview key={image.id} image={image} />
					))}
				</div>
			)}
		</Container>
	);
}

function ImagePreview({ image }: { image: Image }) {
	const fetcher = useFetcher();
	return (
		<div className="group rounded-2xl border relative border-grade-6 w-fit overflow-hidden max-w-64 h-fit">
			<img
				src={image.imageUrl}
				alt="User uploaded imagery"
				className="object-fill object-center"
			/>
			<Button
				size="icon-sm"
				variant="hover-destructive"
				className={"absolute opacity-0 top-2 right-2 group-hover:opacity-100"}
				onPress={() => fetcher.submit({ key: image.key }, { method: "DELETE" })}
			>
				<Cross1Icon />
			</Button>
		</div>
	);
}

// Ok, this is the main react component for uploading a series of images
// for the session route. The goal is very similar to the componennt used
// on the character route, but must handle an array of images, and the
// addition of images to that array once they have been uploaded to S3
function ImageUploader() {
	const {
		fileName,
		fileInputRef,
		handleInputClick,
		handleFileChange,
		handleSubmitCleanup,
	} = useCustomUploadButton();
	const fetcher = useFetcher();

	return (
		<fetcher.Form
			method="POST"
			encType="multipart/form-data"
			onSubmit={handleSubmitCleanup}
		>
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
