import type { Character, CharacterWithFaction } from "@repo/api";
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
import { characterHref, factionHref } from "~/util/generate-hrefs";

const helper = createColumnHelper<CharacterWithFaction>();

const columns = [
  helper.accessor("name", {
    header: "Name",
    cell: ({ cell, row }) => (
      <Link href={characterHref(row.original.gameId, row.original.id)} variant={"link"}>
        {cell.getValue()}
      </Link>
    ),
  }),
  helper.accessor("primaryFaction.name", {
    header: "Primary Faction",
    cell: ({ cell, row }) => {
      if (row.original.primaryFaction) {
        return (
          <Link
            variant={"link"}
            href={factionHref(row.original.gameId, row.original.primaryFaction?.id)}
          >
            {cell.getValue()}
          </Link>
        );
      }
    },
  }),
  helper.accessor("createdAt", {
    header: "Created",
    cell: ({ cell }) => {
      const date = new Date(cell.getValue());
      return <p>{date.toLocaleDateString("gmt")}</p>;
    },
  }),
  helper.accessor("updatedAt", {
    header: "Updated",
    cell: ({ cell }) => {
      const date = new Date(cell.getValue());
      return <p>{date.toLocaleDateString("gmt")}</p>;
    },
  }),
];

interface CharacterTableProps {
  characters: CharacterWithFaction[];
}
export function CharacterTable({ characters }: CharacterTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: characters,
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
