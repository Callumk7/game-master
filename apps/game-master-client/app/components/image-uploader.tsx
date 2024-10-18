import { useFetcher } from "@remix-run/react";
import { type ChangeEvent, useRef, useState } from "react";
import { Button } from "./ui/button";

interface ImageUploaderProps {
	action?: string;
	ownerId: string;
}
export function ImageUploader({ action, ownerId }: ImageUploaderProps) {
	const {
		fileName,
		fileInputRef,
		simulateInputClick,
		handleFileChange,
		handleSubmitCleanup,
	} = useCustomUploadButton();
	const fetcher = useFetcher();
	return (
		<fetcher.Form
			method="POST"
			encType="multipart/form-data"
			onSubmit={handleSubmitCleanup}
			action={action}
		>
			<input
				type="file"
				name="image"
				className="hidden"
				onChange={handleFileChange}
				ref={fileInputRef}
			/>
			<input type="hidden" value={ownerId} name="ownerId" />
			{fileName ? (
				<div className="flex items-center gap-2">
					<Button type="submit" variant={"outline"}>
						Upload
					</Button>
				</div>
			) : (
				<Button onPress={simulateInputClick} variant={"outline"}>
					Select Image
				</Button>
			)}
		</fetcher.Form>
	);
}

const useCustomUploadButton = () => {
	const [fileName, setFileName] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const simulateInputClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files;
		if (files?.[0]) {
			const { name } = files[0];
			setFileName(name);
		} else {
			handleSubmitCleanup();
		}
	};

	const handleSubmitCleanup = () => {
		setFileName("");
	};

	return {
		fileName,
		fileInputRef,
		simulateInputClick,
		handleFileChange,
		handleSubmitCleanup,
	};
};
