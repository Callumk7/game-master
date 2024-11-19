import type {  Folder } from "@repo/api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { folderHref } from "~/util/generate-hrefs";
import { Link } from "../ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface FolderTableProps {
  folders: Folder[];
}

export function FolderTable({ folders }: FolderTableProps) {
  const table = useFolderTable({ data: folders });
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const h = createColumnHelper<Folder>();

interface FolderTableHookProps {
  data: Folder[];
}
const useFolderTable = ({
  data
}: FolderTableHookProps) => {
  const columns = useMemo(() => {
    return [
      h.accessor("name", {
        header: "Name",
        cell: ({ cell, row }) => (
          <Link href={folderHref(row.original.gameId, row.original.id)}>{cell.getValue()}</Link>
        )
      })
    ]
  }, [])

  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })
}
