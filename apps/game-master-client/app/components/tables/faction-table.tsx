import type { Faction } from "@repo/api";
import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
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

const helper = createColumnHelper<Faction>();

const columns = [
  helper.accessor("name", {
    cell: ({ cell, row }) => (
      <Link
        href={`/games/${row.original.gameId}/factions/${row.original.id}`}
        variant={"link"}
      >
        {cell.getValue()}
      </Link>
    ),
  }),
  helper.accessor("createdAt", {
    cell: ({ cell }) => {
      const date = new Date(cell.getValue());
      return <p>{date.toLocaleDateString("gmt")}</p>;
    },
  }),
];

interface FactionTableProps {
  factions: Faction[];
}

export function FactionTable({ factions }: FactionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: factions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

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