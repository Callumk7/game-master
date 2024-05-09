import { useEffect, useState } from "react";
import { useDefaultEditor } from "~/components/tiptap";
import { useFetcher } from "@remix-run/react";
import { INTENT } from "@repo/db";
import { useStateSync } from "./sync-state";

type SyncEditorOptions = {
	action?: string;
	intent?: INTENT;
	initContent: string;
};

export const useSyncEditor = (options: SyncEditorOptions) => {
	const fetcher = useFetcher();

	let optimisticContent = options.initContent;

	if (fetcher.formData?.has("html_content")) {
		optimisticContent = String(fetcher.formData.get("html_content"));
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

	useStateSync(optimisticContent, () => {
		if (editor) {
			editor.commands.setContent(optimisticContent);
		}
	});

	// We want to save the data to the server if it is no longer editing, and it
	// has been edited
	useEffect(() => {
		if (editor && isEdited && !isEditing) {
			fetcher.submit(
				{
					html_content: editor.getHTML(),
					intent: options.intent ?? INTENT.UPDATE_CONTENT,
				},
				{ method: "PATCH", action: options.action },
			);
		}
	}, [isEditing, isEdited, fetcher.submit, editor, options.action, options.intent]);

	return {
		optimisticContent,
		editor,
		isEditing,
		setIsEditing,
	};
};
