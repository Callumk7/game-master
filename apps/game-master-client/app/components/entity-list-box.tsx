import type { BasicEntity, EntityType } from "~/types/general";
import { ListBox, ListBoxItem } from "./ui/list-box";

interface EntityListBoxProps<T extends BasicEntity> {
	entityType: EntityType;
	items: T[];
}

export function EntityListBox<T extends BasicEntity>({
	entityType,
	items,
}: EntityListBoxProps<T>) {
	return (
		<ListBox items={items}>
			{(item) => (
				<ListBoxItem href={`/games/${item.gameId}/${entityType}/${item.id}`}>
					{item.name}
				</ListBoxItem>
			)}
		</ListBox>
	);
}
