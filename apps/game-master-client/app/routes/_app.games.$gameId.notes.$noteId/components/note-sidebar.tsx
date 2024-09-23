import { Button } from "~/components/ui/button";
import { ListBox, ListBoxHeader, ListBoxItem } from "~/components/ui/list-box";
import { useIsRightSidebarOpen } from "~/store/selection";
import type { BasicEntity } from "~/types/general";

interface NoteSidebarProps {
  linkedNotes: BasicEntity[];
}
export function NoteSidebar({ linkedNotes }: NoteSidebarProps) {
  const isRightSidebarOpen = useIsRightSidebarOpen();
  if (!isRightSidebarOpen) return null;
  return (
    <div className="w-64 h-full border-l fixed right-0 top-0 p-2 space-y-2 flex flex-col">
      <Button size={"sm"} className={"place-self-end"}>Link</Button>
      <ListBox>
        <ListBoxHeader>Backlinks</ListBoxHeader>
        {linkedNotes.map((note) => (
          <ListBoxItem key={note.id}>{note.name}</ListBoxItem>
        ))}
      </ListBox>
    </div>
  );
}
