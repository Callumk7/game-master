import { useFetcher } from "@remix-run/react";
import { useDefaultEditor } from ".";
import { useEffect, useState } from "react";
import { useStateSync } from "~/hooks/state-sync";

type SyncEditorOptions = {
	action?: string;
	initContent: string;
};

export const useSyncEditorContent = (options: SyncEditorOptions) => {
	const fetcher = useFetcher();

	let optimisticContent = options.initContent;

	if (fetcher.formData?.has("htmlContent")) {
		console.log("optimistic htmlCOntent exists");
		optimisticContent = String(fetcher.formData.get("htmlContent"));
	}

	const editor = useDefaultEditor(optimisticContent);

	const [isEdited, setIsEdited] = useState(false);

	if (editor) {
		editor.on("update", () => {
			if (!isEdited) setIsEdited(true);
		});
	}

	// custom hook to track state updates on parallel navigation
	useStateSync(optimisticContent, () => {
		if (editor) {
			editor.commands.setContent(optimisticContent);
		}
	});

	const saveContent = () => {
		if (editor && isEdited) {
			fetcher.submit(
				{
					htmlContent: editor.getHTML(),
					content: editor.getText(),
				},
				{
					method: "PATCH",
					action: options.action,
				},
			);
		}
		setIsEdited(false);
	};

	return {
		optimisticContent,
		editor,
		isEdited,
		status: fetcher.state,
		saveContent
	};
};
