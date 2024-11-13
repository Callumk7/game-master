import { FontBoldIcon, FontItalicIcon, HeadingIcon } from "@radix-ui/react-icons";
import type { FormMethod } from "@remix-run/react";
import Typography from "@tiptap/extension-typography";
import {
  BubbleMenu,
  type Editor,
  EditorContent,
  type Extensions,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { cn } from "callum-util";
import { Button } from "~/ui/button";
import { Toolbar } from "~/ui/toolbar";
import { Label } from "../ui/field";
import { useSyncEditorContent } from "./sync";

import Fuse from "fuse.js";
import { useIsClient } from "~/hooks/is-client";
import type { MentionItem } from "~/types/mentions";
import { CustomMention } from "./extensions/mention-extension";
import { suggestion } from "./util/suggestion";
import { CustomFileHandler } from "./extensions/file-upload";

// Core editor hook. A wrapper around the tiptap useEditor
// hook, which ensures consistent settings when spawning a
// new editor on each page.
export const useDefaultEditor = (
  content?: string | undefined,
  suggestionItems?: () => MentionItem[],
  editable = true,
  fetcher?: (file: File) => Promise<string>,
) => {
  const extensions: Extensions = [
    StarterKit,
    Image.configure({
      HTMLAttributes: {
        class: "rounded-md border overflow-hidden"
      }
    }),
    Typography,
    CustomFileHandler(fetcher)
  ];
  if (suggestionItems) {
    extensions.push(
      CustomMention.configure({
        suggestion: {
          ...suggestion,
          items: ({ query }) => {
            const fuse = new Fuse(suggestionItems(), {
              keys: ["id", "label", "href"],
            });
            return fuse.search(query).map((result) => result.item);
          },
        },
      }),
    );
  }
  return useEditor({
    extensions,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    content,
    editorProps: {
      attributes: {
        class:
          "rounded-md p-3 h-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      },
    },
    editable,
  });
};

// Core editor component
interface EditorBodyProps {
  htmlContent: string;
  suggestionItems: () => MentionItem[];
  action?: string;
  method?: FormMethod;
  fetcher?: (file: File) => Promise<string>;
}
export function EditorBody({
  htmlContent,
  action,
  method,
  suggestionItems,
  fetcher,
}: EditorBodyProps) {
  const { editor, isEdited, status, saveContent } = useSyncEditorContent({
    initContent: htmlContent,
    suggestionItems,
    action,
    method,
    fetcher,
  });

  return (
    <div className="editor">
      <EditorWithControls editor={editor} />
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
    </div>
  );
}

export function EditorClient(props: EditorBodyProps) {
  const isClient = useIsClient();
  if (!isClient) return null;
  return <EditorBody {...props} />;
}

export function EditorPreview({ htmlContent }: { htmlContent: string }) {
  const editor = useDefaultEditor(htmlContent, undefined, false);
  return <EditorWithControls editor={editor} />;
}

interface EditorWithControlsProps {
  editor: Editor | null;
  bordered?: boolean;
  label?: string;
  className?: string;
}

export function EditorWithControls({
  editor,
  bordered,
  label,
  className,
}: EditorWithControlsProps) {
  if (!editor) return null;
  return (
    <div>
      {label && <Label id="editor-label">{label}</Label>}
      <EditorContent
        className={cn("flex-auto", bordered ? "border rounded-md" : "", className)}
        editor={editor}
        aria-labelledby="editor-label"
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
    <div className="p-3 bg-popover border rounded-md">
      <EditorControls editor={editor} />
    </div>
  );
}

interface EditorControlsProps {
  editor: Editor;
}

export function EditorControls({ editor }: EditorControlsProps) {
  return (
    <Toolbar>
      <Button
        size="icon"
        variant="secondary"
        onPress={() => editor.chain().focus().toggleBold().run()}
        aria-label="Font bold"
      >
        <FontBoldIcon />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onPress={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Font italic"
      >
        <FontItalicIcon />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        aria-label="Font heading"
      >
        <HeadingIcon />
      </Button>
    </Toolbar>
  );
}
