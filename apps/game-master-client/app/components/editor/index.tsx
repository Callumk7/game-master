import { useEditor, EditorContent, BubbleMenu, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import {
	DiscIcon,
	FontBoldIcon,
	FontItalicIcon,
	HeadingIcon,
} from "@radix-ui/react-icons";
import { Toolbar } from "~/ui/toolbar";
import { Button } from "~/ui/button";
import { useSyncEditorContent } from "./sync";

export const useDefaultEditor = (content: string | null) => {
	return useEditor({
		extensions: [StarterKit, Typography],
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: "prose prose-invert max-w-none",
			},
		},
		content,
	});
};

export function EditorBody({ htmlContent }: { htmlContent: string }) {
	const { editor, isEditing, setIsEditing } = useSyncEditorContent({
		initContent: htmlContent,
	});

	return (
		<>
			<Button
				size={"icon"}
				variant={isEditing ? "secondary" : "ghost"}
				onPress={() => setIsEditing(!isEditing)}
			>
				<DiscIcon />
			</Button>
			<EditorContent editor={editor} />
			{editor && (
				<BubbleMenu editor={editor}>
					<BubbleMenuItems editor={editor} />
				</BubbleMenu>
			)}
		</>
	);
}

interface BubbleMenuItemsProps {
	editor: Editor;
}
export function BubbleMenuItems({ editor }: BubbleMenuItemsProps) {
	return (
		<Toolbar className="p-3 bg-accent border rounded-md">
			<Button
				size="icon"
				variant="secondary"
				onPress={() => editor.chain().focus().toggleBold().run()}
			>
				<FontBoldIcon />
			</Button>
			<Button
				size="icon"
				variant="secondary"
				onPress={() => editor.chain().focus().toggleItalic().run()}
			>
				<FontItalicIcon />
			</Button>
			<Button
				size="icon"
				variant="secondary"
				onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			>
				<HeadingIcon />
			</Button>
		</Toolbar>
	);
}
