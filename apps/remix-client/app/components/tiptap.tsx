import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { focusRing } from "./utils";

export const useDefaultEditor = (content: string | null) => {
	return useEditor({
		extensions: [StarterKit, Highlight, Typography],
		editorProps: {
			attributes: {
				class: focusRing({ className: "prose prose-invert max-w-none" }),
			},
		},
		content,
	});
};

// Currently unnecessary
interface TextEditorProps {
	editor: Editor | null;
}
export function TextEditor({ editor }: TextEditorProps) {
	return <EditorContent editor={editor} />;
}
