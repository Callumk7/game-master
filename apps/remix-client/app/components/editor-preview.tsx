import { type Editor, EditorContent } from "@tiptap/react";
import { RenderHtml } from "./render-html";

interface EditorPreviewProps {
	editor: Editor | null;
	isEditing: boolean;
	htmlContent: string;
}

export function EditorPreview({ editor, isEditing, htmlContent }: EditorPreviewProps) {
	return (
		<>
			{isEditing ? (
				<EditorContent editor={editor} />
			) : (
				<RenderHtml content={htmlContent} />
			)}
		</>
	);
}
