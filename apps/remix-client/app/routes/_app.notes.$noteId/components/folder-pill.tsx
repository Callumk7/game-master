import { Cross1Icon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import { z } from "zod";

// ZOD section
export const DeleteFolderSchema = z.object({
	intent: z.literal("DELETE_FOLDER"),
	folderId: z.string(),
});
type DeleteFolderSubmission = z.infer<typeof DeleteFolderSchema>;

interface FolderPillProps {
	folderName: string;
	folderId: string;
}
export function FolderPill({ folderName, folderId }: FolderPillProps) {
	const submit = useSubmit();

	const handlePillPressed = () => {
		const submission: DeleteFolderSubmission = {
			folderId,
			intent: "DELETE_FOLDER",
		};
		submit(submission, { method: "DELETE" });
	};

	return (
		<button
			type="button"
			className="flex gap-1 items-center py-1 px-2 mb-4 text-xs rounded-full bg-primary-7 border border-primary-9 text-primary-12 w-fit hover:bg-primary-9"
			onClick={handlePillPressed}
		>
			<span>{folderName}</span>
			<Cross1Icon className="h-3 w-3" />
		</button>
	);
}
