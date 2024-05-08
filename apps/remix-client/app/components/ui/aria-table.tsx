import {
	Cell as AriaCell,
	Column as AriaColumn,
	Row as AriaRow,
	Table as AriaTable,
	TableHeader as AriaTableHeader,
	Button,
	CellProps,
	Collection,
	ColumnProps,
	ColumnResizer,
	Group,
	ResizableTableContainer,
	RowProps,
	TableHeaderProps,
	TableProps,
	composeRenderProps,
	useTableOptions,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { Checkbox } from "./checkbox";
import { composeTailwindRenderProps, focusRing } from "~/utils";
import { ArrowUpIcon, DragHandleDots1Icon } from "@radix-ui/react-icons";

export function Table(props: TableProps) {
	return (
		<ResizableTableContainer className="overflow-hidden scroll-pt-[2.281rem] relative border border-grade-6 rounded-lg">
			<AriaTable
				{...props}
				className="border-separate border-spacing-0 drop-target:outline-2 drop-target:bg-primary-9"
			/>
		</ResizableTableContainer>
	);
}

const columnStyles = tv({
	extend: focusRing,
	base: "px-2 h-5 flex-1 flex gap-1 items-center overflow-hidden",
});

const resizerStyles = tv({
	extend: focusRing,
	base: "w-px px-[8px] translate-x-[8px] box-content py-1 h-5 bg-clip-content bg-gray-400 dark:bg-zinc-500 forced-colors:bg-[ButtonBorder] cursor-col-resize rounded resizing:bg-blue-600 forced-colors:resizing:bg-[Highlight] resizing:w-[2px] resizing:pl-[7px] -outline-offset-2",
});

export function Column(props: ColumnProps) {
	return (
		<AriaColumn
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"[&:hover]:z-20 [&:focus-within]:z-20 text-start py-1 text-sm font-semibold text-grade-12 cursor-default",
			)}
		>
			{composeRenderProps(
				props.children,
				(children, { allowsSorting, sortDirection }) => (
					<div className="flex items-center">
						<Group role="presentation" tabIndex={-1} className={columnStyles}>
							<span className="truncate">{children}</span>
							{allowsSorting && (
								<span
									className={`w-4 h-4 flex items-center justify-center transition ${
										sortDirection === "descending" ? "rotate-180" : ""
									}`}
								>
									{sortDirection && (
										<ArrowUpIcon
											aria-hidden
											className="w-4 h-4 text-gray-500 dark:text-zinc-400 forced-colors:text-[ButtonText]"
										/>
									)}
								</span>
							)}
						</Group>
						{!props.width && <ColumnResizer className={resizerStyles} />}
					</div>
				),
			)}
		</AriaColumn>
	);
}

export function TableHeader<T extends object>(props: TableHeaderProps<T>) {
	const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();

	return (
		<AriaTableHeader
			{...props}
			className={twMerge(
				"sticky top-0 z-10 bg-grade-6/80 backdrop-blur-md supports-[-moz-appearance:none]:bg-grade-5 forced-colors:bg-[Canvas] rounded-t-lg border-b border-grade-6",
				props.className,
			)}
		>
			{/* Add extra columns for drag and drop and selection. */}
			{allowsDragging && <Column width={1} />}
			{selectionBehavior === "toggle" && (
				<AriaColumn
					width={36}
					minWidth={36}
					className="text-start text-sm font-semibold cursor-default p-2"
				>
					{selectionMode === "multiple" && <Checkbox slot="selection" />}
				</AriaColumn>
			)}
			<Collection items={props.columns}>{props.children}</Collection>
		</AriaTableHeader>
	);
}

const rowStyles = tv({
	extend: focusRing,
	base: "group/row relative cursor-default select-none -outline-offset-2 text-grade-12 disabled:text-gray-300 dark:disabled:text-zinc-600 text-sm hover:bg-grade-3 selected:bg-blue-100 selected:hover:bg-blue-200 dark:selected:bg-blue-700/30 dark:selected:hover:bg-blue-700/40",
});

export function Row<T extends object>({
	id,
	columns,
	children,
	...otherProps
}: RowProps<T>) {
	const { selectionBehavior, allowsDragging } = useTableOptions();

	return (
		<AriaRow id={id} {...otherProps} className={rowStyles}>
			{allowsDragging && (
				<Cell>
					<Button slot="drag">
						<DragHandleDots1Icon className="w-5 h-5" />
					</Button>
				</Cell>
			)}
			{selectionBehavior === "toggle" && (
				<Cell>
					<Checkbox slot="selection" />
				</Cell>
			)}
			<Collection items={columns}>{children}</Collection>
		</AriaRow>
	);
}

const cellStyles = tv({
	extend: focusRing,
	base: "border-b border-grade-6  group-last/row:border-b-0 [--selected-border:theme(colors.blue.200)] dark:[--selected-border:theme(colors.blue.900)] group-selected/row:border-[--selected-border] [:has(+[data-selected])_&]:border-[--selected-border] p-2 truncate -outline-offset-2",
});

export function Cell(props: CellProps) {
	return <AriaCell {...props} className={cellStyles} />;
}
