import { type FormMethod, useFetcher } from "@remix-run/react";
import { useDefaultEditor } from ".";
import { useState } from "react";

type SyncEditorOptions = {
	action?: string;
	method?: FormMethod;
	initContent: string;
	suggestionItems: () => string[];
};

export const useSyncEditorContent = (options: SyncEditorOptions) => {
	const fetcher = useFetcher();

	let optimisticContent = options.initContent;

	if (fetcher.formData?.has("htmlContent")) {
		optimisticContent = String(fetcher.formData.get("htmlContent"));
	}

	const editor = useDefaultEditor(options.suggestionItems, optimisticContent);

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
					method: options.method ?? "patch", // WARN: test this syntax
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

type StateFunction = () => void;

const useStateSync = <T>(data: T, stateFunction: StateFunction) => {
	const [prevData, setPrevData] = useState(data);
	if (data !== prevData) {
		setPrevData(data);
		stateFunction();
	}
};
