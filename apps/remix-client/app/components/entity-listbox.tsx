import { BasicEntity, EntityType } from "@repo/db";
import { ListBox, ListBoxItem } from "./ui/list-box";

interface EntityListBoxProps<T> {
	items: T[];
	type: EntityType;
	className?: string;
}
export function EntityListBox<T extends BasicEntity>({
	items,
	type,
	className,
}: EntityListBoxProps<T>) {
	return (
		<ListBox
			items={items}
			className={className}
			aria-label="Navigation links"
			renderEmptyState={() => (
				<p className="w-full text-sm text-grade-10 italic text-center p-3">
					Nothing to display
				</p>
			)}
		>
			{(item) => <ListBoxItem href={`/${type}/${item.id}`}>{item.name}</ListBoxItem>}
		</ListBox>
	);
}
