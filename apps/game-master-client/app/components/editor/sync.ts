import { type FormMethod, useFetcher } from "@remix-run/react";
import { useEffect, useLayoutEffect, useState } from "react";
import type { MentionItem } from "~/types/mentions";
import { useDefaultEditor } from ".";

type EditorSyncStatus = "saved" | "saving" | "just-saved";

type SyncEditorOptions = {
	action?: string;
	method?: FormMethod;
	initContent: string;
	suggestionItems?: () => MentionItem[];
	fetcher?: (file: File) => Promise<string>;
};

export const useSyncEditorContent = (options: SyncEditorOptions) => {
	const fetcher = useFetcher();
	const [lastSavedContent, setLastSavedContent] = useState(options.initContent);
	const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
	const [syncStatus, setSyncStatus] = useState<EditorSyncStatus>("saved");

	let optimisticContent = options.initContent;

	if (fetcher.formData?.has("htmlContent")) {
		optimisticContent = String(fetcher.formData.get("htmlContent"));
	}

	const editor = useDefaultEditor(
		optimisticContent,
		options.suggestionItems,
		true,
		options.fetcher,
	);

	const debouncedSave = (html: string, text: string) => {
		if (html === lastSavedContent) return;

		setSyncStatus("saving");

		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		const timeout = setTimeout(() => {
			if (editor && editor.getHTML() === html) {
				fetcher.submit(
					{
						htmlContent: html,
						content: text,
					},
					{
						method: options.method ?? "patch",
						action: options.action,
					},
				);
				setLastSavedContent(html);
				setSyncStatus("just-saved");
			}
		}, 1000);

		setDebounceTimeout(timeout);
	};

	useEffect(() => {
		if (editor) {
			const updateListener = () => {
				debouncedSave(editor.getHTML(), editor.getText());
			};

			editor.on("update", updateListener);

			return () => {
				editor.off("update", updateListener);
				if (debounceTimeout) {
					clearTimeout(debounceTimeout);
				}
			};
		}
	}, [editor]);

	// Setting editor content inside a react lifecycle hook throws errors
	// regarding tiptap's use of flushSync during render. It doesn't break
	// the app, but the warning is annoying. Using the browser queueMicrotask
	// api fixes the error, at the expense of potential delayed content load
	// on quick navigations, and breaks the component for edits.
	// biome-ignore lint/correctness/useExhaustiveDependencies: We are only triggering the effect if content changes
	useLayoutEffect(() => {
		if (editor && optimisticContent !== editor.getHTML() && !debounceTimeout) {
			editor.commands.setContent(optimisticContent);
		}
	}, [optimisticContent]);

	return {
		optimisticContent,
		editor,
		syncStatus,
	};
};
