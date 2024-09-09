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

	// Editor state for auto-saving to the server
	const [isEditing, setIsEditing] = useState(false);
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

	// We want to save the data to the server if it is no longer editing, and it
	// has been edited.
	useEffect(() => {
		if (editor && isEdited && !isEditing) {
			fetcher.submit(
				{
					htmlContent: editor.getHTML(),
					content: editor.getText(),
				},
				{ method: "PATCH", action: options.action },
			);
		}
	}, [isEditing, isEdited, fetcher.submit, editor, options.action]);

	return {
		optimisticContent,
		editor,
		isEditing,
		setIsEditing,
	};
};
