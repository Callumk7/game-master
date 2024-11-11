import { ArrowDownIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import type { FactionMember, FactionWithMembers } from "@repo/api";
import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, useMemo, useState } from "react";
import { Link } from "~/components/ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { characterHref } from "~/util/generate-hrefs";
import { Card } from "../ui/card";
import { EntityRowControls } from "./shared";

interface FactionTableProps {
  factions: FactionWithMembers[];
}

export function FactionTable({ factions }: FactionTableProps) {
  const [isEditFactionDialogOpen, setIsEditFactionDialogOpen] = useState(false);
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);
  const table = useFactionTable({
    data: factions,
    setIsEditFactionDialogOpen,
    setSelectedFactionId,
  });
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id} className="first:max-w-4">
            {group.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                style={{
                  width:
                    header.index === 0
                      ? 24
                      : header.getSize()
                        ? header.getSize()
                        : "auto",
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </tr>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <Fragment key={row.id}>
            <TableRow>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
            {row.getIsExpanded() && (
              <tr>
                <td colSpan={row.getAllCells().length}>
                  <MemberTable members={row.original.members} />
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

function MemberTable({ members }: { members: FactionMember[] }) {
  const h = createColumnHelper<FactionMember>();
  // biome-ignore lint/correctness/useExhaustiveDependencies: Tanstack table stable reference
  const columns = useMemo(() => {
    return [
      h.accessor("name", {
        size: 600,
        header: "Name",
        cell: ({ cell, row }) => (
          <Link
            href={characterHref(row.original.gameId, row.original.id)}
            variant={"link"}
          >
            {cell.getValue()}
          </Link>
        ),
      }),
      h.accessor("role", {
        size: 50,
        header: "Faction Role",
        cell: ({ cell }) => cell.getValue(),
      }),
    ];
  }, []);

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full border-b">
      <p className="pl-4 ml-2 mt-2 font-medium">Members</p>
      <table className="m-2">
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const h = createColumnHelper<FactionWithMembers>();

interface UseFactionTableArgs {
  data: FactionWithMembers[];
  setIsEditFactionDialogOpen: (isOpen: boolean) => void;
  setSelectedFactionId: (factionId: string) => void;
}
const useFactionTable = ({
  data,
  setIsEditFactionDialogOpen,
  setSelectedFactionId,
}: UseFactionTableArgs) => {
  const handleEdit = (factionId: string) => {
    setSelectedFactionId(factionId);
    setIsEditFactionDialogOpen(true);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Stable reference
  const columns = useMemo(() => {
    return [
      h.display({
        id: "expander",
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <div className="w-[1px]">
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: "pointer" },
                  type: "button",
                }}
              >
                {row.getIsExpanded() ? <ArrowDownIcon /> : <ArrowRightIcon />}
              </button>
            </div>
          ) : null;
        },
      }),
      h.accessor("name", {
        size: 500,
        header: "Name",
        cell: ({ cell, row }) => (
          <Link
            href={`/games/${row.original.gameId}/factions/${row.original.id}`}
            variant={"link"}
          >
            {cell.getValue()}
          </Link>
        ),
      }),
      h.accessor("members", {
        header: "Members",
        cell: ({ row }) => row.original.members.length,
      }),
      h.accessor("userPermissionLevel", {
        header: "Permission Level",
        cell: ({ cell }) => cell.getValue(),
      }),
      h.accessor("createdAt", {
        size: 50,
        cell: ({ cell }) => {
          const date = new Date(cell.getValue());
          return <p>{date.toLocaleDateString("gmt")}</p>;
        },
      }),
      h.display({
        header: "Controls",
        cell: ({ row }) => (
          <EntityRowControls entityId={row.original.id} handleEdit={handleEdit} />
        ),
      }),
    ];
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);

  return useReactTable({
    data,
    columns,
    getRowCanExpand: (row) => row.original.members.length > 0,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });
};
