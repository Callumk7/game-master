import { cn } from "callum-util";
import {
	forwardRef,
	type HTMLAttributes,
	type ThHTMLAttributes,
	type TdHTMLAttributes,
} from "react";

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
	({ className, ...props }, ref) => (
		<div className="overflow-auto relative w-full">
			<table
				ref={ref}
				className={cn("w-full caption-bottom text-sm", className)}
				{...props}
			/>
		</div>
	),
);
Table.displayName = "Table";

const TableHeader = forwardRef<
	HTMLTableSectionElement,
	HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		className={cn("[&_tr]:border-b border-grade-6", className)}
		{...props}
	/>
));
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<
	HTMLTableSectionElement,
	HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = forwardRef<
	HTMLTableSectionElement,
	HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={cn(
			"border-t border-grade-6 bg-grade-3 font-medium [&>tr]:last:border-b-0",
			className,
		)}
		{...props}
	/>
));
TableFooter.displayName = "TableFooter";

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
	({ className, ...props }, ref) => (
		<tr
			ref={ref}
			className={cn(
				"border-b border-grade-6 transition-colors hover:bg-grade-2 data-[state=selected]:bg-grade-4",
				className,
			)}
			{...props}
		/>
	),
);
TableRow.displayName = "TableRow";

const TableHead = forwardRef<
	HTMLTableCellElement,
	ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			"h-12 px-4 text-left align-middle font-medium text-grade-12 [&:has([role=checkbox])]:pr-0",
			className,
		)}
		{...props}
	/>
));
TableHead.displayName = "TableHead";

const TableCell = forwardRef<
	HTMLTableCellElement,
	TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td
		ref={ref}
		className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
		{...props}
	/>
));
TableCell.displayName = "TableCell";

const TableCaption = forwardRef<
	HTMLTableCaptionElement,
	HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption ref={ref} className={cn("mt-4 text-sm text-grade-12", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
};
