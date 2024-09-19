import { useEditor, EditorContent, BubbleMenu, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import { FontBoldIcon, FontItalicIcon, HeadingIcon } from "@radix-ui/react-icons";
import { Toolbar } from "~/ui/toolbar";
import { Button } from "~/ui/button";
import { useSyncEditorContent } from "./sync";
import type { FormMethod } from "@remix-run/react";
import type { EntityType } from "~/types/general";
import { cn } from "callum-util";
import { Label } from "../ui/field";

export const useDefaultEditor = (content: string | undefined = undefined) => {
	return useEditor({
		extensions: [StarterKit, Typography],
		immediatelyRender: false,
		content,
		editorProps: {
			attributes: {
				class:
					"rounded-md p-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
			},
		},
	});
};

interface EditorBodyProps {
	htmlContent: string;
	action?: string;
	method?: FormMethod;
}
export function EditorBody({ htmlContent, action, method }: EditorBodyProps) {
	const { editor, isEdited, status, saveContent } = useSyncEditorContent({
		initContent: htmlContent,
		action,
	});

	return (
		<div className="editor">
			<Toolbar className={"flex p-2"}>
				<Button
					size={"sm"}
					onPress={saveContent}
					isDisabled={!isEdited}
					variant={isEdited ? "default" : "outline"}
				>
					{isEdited ? "Save" : "Content Saved"}
				</Button>
			</Toolbar>
			<EditorWithControls editor={editor} />
		</div>
	);
}

interface EditorWithControlsProps {
	editor: Editor | null;
	bordered?: boolean;
	label?: string;
}

export function EditorWithControls({ editor, bordered, label }: EditorWithControlsProps) {
	if (!editor) return null;
	return (
		<div>
			{label && <Label>{label}</Label>}
			<EditorContent
				className={cn("flex-auto", bordered ? "border rounded-md" : "")}
				editor={editor}
			/>
			<BubbleMenu editor={editor}>
				<BubbleMenuItems editor={editor} />
			</BubbleMenu>
		</div>
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
