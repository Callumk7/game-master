import { useFetcher } from "@remix-run/react";
import type { EntityType } from "@repo/db";
import { Button } from "./ui/button";
import { type ChangeEvent, useState, useRef } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";

interface ImageUploadProps {
	imageSrc: string | null;
	alt?: string;
}

export function ImageUpload({ imageSrc, alt }: ImageUploadProps) {
	const fetcher = useFetcher();
	const { fileName, fileInputRef, handleInputClick, handleFileChange } =
		useCustomUploadButton();

	if (imageSrc) {
		return (
			<div className="group rounded-2xl border relative border-grade-6 overflow-hidden">
				<img
					src={imageSrc}
					alt={alt ?? "User uploaded image"}
					className="object-fill object-center"
				/>
				<Button
					size="icon-sm"
					variant="hover-destructive"
					className={"absolute opacity-0 top-2 right-2 group-hover:opacity-100"}
					onPress={() => fetcher.submit({}, { method: "DELETE", action: "uploads" })}
				>
					<Cross1Icon />
				</Button>
			</div>
		);
	}

	return (
		<fetcher.Form action="uploads" method="POST" encType="multipart/form-data">
			<input
				type="file"
				name="image"
				className="hidden"
				onChange={handleFileChange}
				ref={fileInputRef}
			/>
			{fileName ? (
				<Button type="submit">Submit</Button>
			) : (
				<Button onPress={handleInputClick} variant="secondary">
					Upload File
				</Button>
			)}
		</fetcher.Form>
	);
}

const useCustomUploadButton = () => {
	const [fileName, setFileName] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const handleInputClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files;
		if (files?.[0]) {
			const { name } = files[0];
			setFileName(name);
		} else {
			setFileName("");
		}
	};

	return {
		fileName,
		fileInputRef,
		handleInputClick,
		handleFileChange,
	};
};
