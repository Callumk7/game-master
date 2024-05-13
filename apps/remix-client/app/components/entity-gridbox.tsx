import { BasicEntity, EntityType } from "@repo/db";
import { GridList, GridListItem } from "./ui/grid-list";
import { Button } from "./ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";

interface EntityGridBoxProps<T> {
	items: T[];
	type: EntityType;
	contentType: EntityType;
	className?: string;
}

export function EntityGridBox<T extends BasicEntity>({
	items,
	type,
	contentType,
	className,
}: EntityGridBoxProps<T>) {
	const submit = useSubmit();
	return (
		<GridList items={items} className={className}>
			{(item) => (
				<GridListItem href={`/${contentType}/${item.id}`}>
					<div className="w-full flex justify-between items-center font-semibold">
						{item.name}
						<Button
							variant="ghost"
							size="icon-sm"
							onPress={() => submit({ itemId: item.id }, { method: "DELETE" })}
						>
							<Cross1Icon />
						</Button>
					</div>
				</GridListItem>
			)}
		</GridList>
	);
}
