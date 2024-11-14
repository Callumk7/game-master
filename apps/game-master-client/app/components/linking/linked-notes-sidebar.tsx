import type { Note } from "@repo/api";
import type { ReactNode } from "react";
import { noteHref } from "~/util/generate-hrefs";
import { Link } from "../ui/link";

interface LinkedNotesAsideProps {
  linkedNotes: Note[];
}

export function LinkedNotesAside({ linkedNotes }: LinkedNotesAsideProps) {
  return (
    <div className="space-y-2 divide-y">
      {linkedNotes.map((note) => (
        <div key={note.id}>
          <div className="flex flex-col items-start">
            <Link variant={"link"} href={noteHref(note.gameId, note.id)} className={"pl-0 text-wrap h-fit"}>
              {note.name}
            </Link>
            <p className="text-xs text-slate-500 font-medium italic">{note.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface LinksAsideProps {
  children: ReactNode;
}

export function LinksAside({ children }: LinksAsideProps) {
  return <aside className="space-y-2">{children}</aside>;
}
