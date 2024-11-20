import type { Folder } from "@repo/api";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { folderHref } from "~/util/generate-hrefs";
import { Link } from "../ui/link";
import { BaseTable } from "./base-table";
import { EntityRowControls } from "./shared";

interface FolderTableProps {
  folders: Folder[];
}

export function FolderTable({ folders }: FolderTableProps) {
  const table = useFolderTable({ data: folders });
  return <BaseTable table={table} />;
}

const h = createColumnHelper<Folder>();

interface FolderTableHookProps {
  data: Folder[];
}
const useFolderTable = ({ data }: FolderTableHookProps) => {
  const [isEditNoteDialogOpen, setIsEditNoteDialogOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const handleEdit = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsEditNoteDialogOpen(true);
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: Stable reference
  const columns = useMemo(() => {
    return [
      h.accessor("name", {
        header: "Name",
        cell: ({ cell, row }) => (
          <Link href={folderHref(row.original.gameId, row.original.id)} variant={"link"}>
            {cell.getValue()}
          </Link>
        ),
      }),
      h.display({
        header: "Controls",
        cell: ({ row }) => (
          <EntityRowControls handleEdit={handleEdit} entityId={row.original.id} />
        ),
      }),
    ];
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);

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
