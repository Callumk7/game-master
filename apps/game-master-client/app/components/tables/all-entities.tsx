import type { Character, Faction, Note } from "@repo/api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "../ui/link";
import { characterHref, factionHref, noteHref } from "~/util/generate-hrefs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface AllEntityTableProps {
  notes: Note[];
  characters: Character[];
  factions: Faction[];
}

export function AllEntityTable({ notes, characters, factions }: AllEntityTableProps) {
  const data = [...notes, ...characters, ...factions];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
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
  );
}

const h = createColumnHelper<Note | Character | Faction>();

const columns = [
  h.accessor("name", {
    cell: ({ cell, row }) => {
      if (row.original.id.startsWith("note")) {
        return (
          <Link href={noteHref(row.original.gameId, row.original.id)} variant={"link"}>
            {cell.getValue()}
          </Link>
        );
      }
      if (row.original.id.startsWith("faction")) {
        return (
          <Link href={factionHref(row.original.gameId, row.original.id)} variant={"link"}>
            {cell.getValue()}
          </Link>
        );
      }
      if (row.original.id.startsWith("char")) {
        return (
          <Link
            href={characterHref(row.original.gameId, row.original.id)}
            variant={"link"}
          >
            {cell.getValue()}
          </Link>
        );
      }
    },
  }),
  h.accessor("level", {
    cell: ({ cell }) => cell.getValue(),
  }),
];
