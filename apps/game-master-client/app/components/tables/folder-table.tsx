import type { Folder } from "@repo/api";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { folderHref } from "~/util/generate-hrefs";
import { Link } from "../ui/link";
import { BaseTable } from "./base-table";

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
    ];
  }, []);

  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
};
