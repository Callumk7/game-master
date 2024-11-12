import type { Note } from "@repo/api";
import { Link } from "../ui/link";
import { noteHref } from "~/util/generate-hrefs";
import type { ReactNode } from "react";

interface LinkedNotesAsideProps {
  linkedNotes: Note[];
}

export function LinkedNotesAside({ linkedNotes }: LinkedNotesAsideProps) {
  return (
    <div className="space-y-2 divide-y">
      {linkedNotes.map((note) => (
        <div key={note.id}>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600 font-medium italic">{note.type}</p>
            <Link variant={"link"} href={noteHref(note.gameId, note.id)}>
              {note.name}
            </Link>
          </div>
          <p className="text-xs whitespace-pre-wrap">{note.content?.slice(0, 100)}</p>
        </div>
      ))}
    </div>
  );
}

interface LinksAsideProps {
  children: ReactNode;
}

export function LinksAside({ children }: LinksAsideProps) {
  return <aside className="w-full border-r space-y-2 relative">{children}</aside>;
}
