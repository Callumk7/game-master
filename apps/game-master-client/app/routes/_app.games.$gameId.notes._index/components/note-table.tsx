import { TrashIcon } from "@radix-ui/react-icons";
import type { Note } from "@repo/api";
import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const helper = createColumnHelper<Note>();

const columns = [
  helper.accessor("name", {
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
  helper.accessor("type", {
    cell: ({ cell }) => cell.getValue(),
    header: () => "Type",
  }),
  helper.accessor("createdAt", {
    cell: ({ cell }) => {
      const date = new Date(cell.getValue());
      return <p>{date.toLocaleString("gmt")}</p>;
    },
    header: () => "Created At",
  }),
  helper.accessor("userPermissionLevel", {
    cell: ({ cell }) => <p>{cell.getValue()}</p>,
    header: "Permission Level",
  }),
  helper.display({
    id: "controls",
    header: () => "Controls",
    cell: () => (
      <Button size={"icon"} variant={"secondary"}>
        <TrashIcon />
      </Button>
    ),
  }),
];

interface NoteTableProps {
  notes: Note[];
}

export function NoteTable({ notes }: NoteTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: notes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  console.log(table.getState().sorting);

  return (
    <Card>
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
    </Card>
  );
}
