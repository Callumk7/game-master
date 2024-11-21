import type { Folder } from "@repo/api";
import {
  type SortingState,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { EditFolderDialog } from "~/routes/_app.games.$gameId.folders._index/components/edit-folder-dialog";
import { folderHref } from "~/util/generate-hrefs";
import { Link } from "../ui/link";
import { BaseTable } from "./base-table";
import { EntityRowControls } from "./shared";

interface FolderTableProps {
  folders: Folder[];
}

export function FolderTable({ folders }: FolderTableProps) {
  const [isEditFolderDialogOpen, setIsEditFolderDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const selectedFolder = folders.find((folder) => folder.id === selectedFolderId);
  const table = useFolderTable({
    data: folders,
    setIsEditFolderDialogOpen,
    setSelectedFolderId,
  });
  return (
    <>
      <BaseTable table={table} />
      {selectedFolder ? (
        <EditFolderDialog
          folder={selectedFolder}
          allFolders={folders}
          isOpen={isEditFolderDialogOpen}
          setIsOpen={setIsEditFolderDialogOpen}
        />
      ) : null}
    </>
  );
}

const h = createColumnHelper<Folder>();

interface FolderTableHookProps {
  data: Folder[];
  setIsEditFolderDialogOpen: (isOpen: boolean) => void;
  setSelectedFolderId: (charId: string) => void;
}
const useFolderTable = ({
  data,
  setSelectedFolderId,
  setIsEditFolderDialogOpen,
}: FolderTableHookProps) => {
  const handleEdit = (folderId: string) => {
    setSelectedFolderId(folderId);
    setIsEditFolderDialogOpen(true);
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
