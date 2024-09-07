import {
  useEditor,
  EditorContent,
  BubbleMenu,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FontBoldIcon, FontItalicIcon, HeadingIcon } from "@radix-ui/react-icons";
import { Toolbar } from "~/ui/toolbar";
import { Button } from "~/ui/button";

// define your extension array
const extensions = [StarterKit];

const content = "<p>Hello World!</p>";

export function EditorBody() {
  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
  });

  return (
    <>
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
    <Toolbar className="p-3 bg-background/80 backdrop-blur rounded-md">
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
        onPress={() => editor.chain().focus().toggleHeading({level: 1}).run()}
      >
        <HeadingIcon />
      </Button>
    </Toolbar>
  );
}
