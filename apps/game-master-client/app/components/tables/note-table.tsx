import type { Note } from "@repo/api";
import {
  type SortingState,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link } from "~/components/ui/link";
import { EntityRowControls } from "./shared";
import { BaseTable } from "./base-table";
import { EditNoteDialog } from "../forms/edit-note-dialog";

const h = createColumnHelper<Note>();

interface NoteTableProps {
  notes: Note[];
}

export function NoteTable({ notes }: NoteTableProps) {
  const [isEditNoteDialogOpen, setIsEditNoteDialogOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const selectedNote = notes.find((note) => note.id === selectedNoteId)!;
  const table = useNoteTable({ data: notes, setSelectedNoteId, setIsEditNoteDialogOpen });
  return (
    <>
      <BaseTable table={table} />
      <EditNoteDialog
        isOpen={isEditNoteDialogOpen}
        setIsOpen={setIsEditNoteDialogOpen}
        note={selectedNote}
      />
    </>
  );
}

interface NoteTableHookProps {
  data: Note[];
  setIsEditNoteDialogOpen: (isOpen: boolean) => void;
  setSelectedNoteId: (noteId: string) => void;
}
const useNoteTable = ({
  data,
  setIsEditNoteDialogOpen,
  setSelectedNoteId,
}: NoteTableHookProps) => {
  const handleEdit = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsEditNoteDialogOpen(true);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Stable reference
  const columns = useMemo(() => {
    const columns = [
      h.accessor("name", {
        cell: ({ cell, row }) => (
          <Link
            variant={"link"}
            href={`/games/${row.original.gameId}/notes/${row.original.id}`}
          >
            {cell.getValue()}
          </Link>
        ),
        header: () => "Name",
      }),
      h.accessor("type", {
        cell: ({ cell }) => cell.getValue(),
        header: () => "Type",
      }),
      h.accessor("createdAt", {
        cell: ({ cell }) => {
          const date = new Date(cell.getValue());
          return <p>{date.toLocaleString("gmt")}</p>;
        },
        header: () => "Created",
      }),
      h.accessor("updatedAt", {
        cell: ({ cell }) => {
          const date = new Date(cell.getValue());
          return <p>{date.toLocaleString("gmt")}</p>;
        },
        header: () => "Updated",
      }),
      h.accessor("userPermissionLevel", {
        cell: ({ cell }) => <p>{cell.getValue()}</p>,
        header: "Permission Level",
      }),
      h.display({
        id: "controls",
        header: () => "Controls",
        cell: ({ row }) => (
          <EntityRowControls handleEdit={handleEdit} entityId={row.original.id} />
        ),
      }),
    ];
    return columns;
  }, []);

  const [sorting, setSorting] = useState<SortingState>([{ id: "updatedAt", desc: true }]);

  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });
};
