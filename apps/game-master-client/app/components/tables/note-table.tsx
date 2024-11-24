import type { Note } from "@repo/api";
import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link } from "~/components/ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { EntityRowControls } from "./shared";

const h = createColumnHelper<Note>();

interface NoteTableProps {
  notes: Note[];
}

export function NoteTable({ notes }: NoteTableProps) {
  const [isEditNoteDialogOpen, setIsEditNoteDialogOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const handleEdit = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsEditNoteDialogOpen(true);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Stable reference
  const columns = useMemo(() => {
    const columns = [
      h.accessor("name", {
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
      h.accessor("type", {
        cell: ({ cell }) => cell.getValue(),
        header: () => "Type",
      }),
      h.accessor("createdAt", {
        cell: ({ cell }) => {
          const date = new Date(cell.getValue());
          return <p>{date.toLocaleString("gmt")}</p>;
        },
        header: () => "Created",
      }),
      h.accessor("updatedAt", {
        cell: ({ cell }) => {
          const date = new Date(cell.getValue());
          return <p>{date.toLocaleString("gmt")}</p>;
        },
        header: () => "Updated",
      }),
      h.accessor("userPermissionLevel", {
        cell: ({ cell }) => <p>{cell.getValue()}</p>,
        header: "Permission Level",
      }),
      h.display({
        id: "controls",
        header: () => "Controls",
        cell: ({ row }) => (
          <EntityRowControls handleEdit={handleEdit} entityId={row.original.id} />
        ),
      }),
    ];
    return columns;
  }, []);

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
