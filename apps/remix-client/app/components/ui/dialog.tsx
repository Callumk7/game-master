import { cn } from "callum-util";
import { DialogProps, Dialog as RACDialog } from "react-aria-components";

export function Dialog({ className, ...props }: DialogProps) {
	return (
		<RACDialog
			{...props}
			className={cn(
				"outline outline-0 p-4 max-h-[inherit] overflow-auto relative",
				className,
			)}
		/>
	);
}
