import type { Character, Faction, FactionMember } from "@repo/api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Link } from "~/components/ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Text } from "~/components/ui/typeography";

interface PrimaryFactionProps {
  faction: Faction;
  members: FactionMember[];
}

export function PrimaryFaction({ faction, members }: PrimaryFactionProps) {
  return (
    <div className="p-7 grid grid-cols-3 gap-7">
      <div className="col-span-2">
        <Text variant={"h3"} weight={"bold"}>
          {faction.name}
        </Text>
        <Text className="whitespace-pre-wrap">{faction.content}</Text>
      </div>
      <div>
        <Text variant={"h3"} weight={"bold"}>
          Members
        </Text>
        <PrimaryFactionMemberTable memberRows={members} />
      </div>
    </div>
  );
}

interface PrimaryFactionMemberTableProps {
  memberRows: FactionMember[];
}
function PrimaryFactionMemberTable({ memberRows }: PrimaryFactionMemberTableProps) {
  const h = createColumnHelper<FactionMember>();
  const columns = useMemo(
    () => [
      h.accessor("name", {
        cell: ({ cell, row }) => (
          <Link
            variant={"link"}
            href={`/games/${row.original.gameId}/characters/${row.original.id}`}
          >
            {cell.getValue()}
          </Link>
        ),
      }),
      h.accessor("role", {
        cell: ({ cell }) => cell.getValue(),
      }),
    ],
    [h],
  );
  const table = useReactTable({
    data: memberRows,
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
