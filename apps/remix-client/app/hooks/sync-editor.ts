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

/**
 * This hook keeps the input data in sync between the editor component,
 * and the database. It sends a PATCH request to the action (or nearest if
 * no action is provided in the init options) which includes htmlContent, and
 * an intent of UPDATE_CONTENT (can be overridden)
 */
export const useSyncEditor = (options: SyncEditorOptions) => {
	const fetcher = useFetcher();

	let optimisticContent = options.initContent;

	if (fetcher.formData?.has("htmlContent")) {
		console.log("found htmlContent for optimisticContent");
		optimisticContent = String(fetcher.formData.get("htmlContent"));
		console.log(optimisticContent);
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
					htmlContent: editor.getHTML(),
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
