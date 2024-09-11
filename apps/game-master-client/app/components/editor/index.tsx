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
    content,
    editorProps: {
      attributes: {
        class:
          "rounded-md p-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      },
    },
  });
};

export function EditorBody({
  htmlContent,
  action,
}: { htmlContent: string; action?: string }) {
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
      <EditorContent className="editor__content" editor={editor} />
      {editor && (
        <BubbleMenu editor={editor}>
          <BubbleMenuItems editor={editor} />
        </BubbleMenu>
      )}
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
