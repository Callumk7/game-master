import type { BasicEntity, EntityType } from "@repo/api";
import { ListBox, ListBoxItem } from "./ui/list-box";

interface EntityListBoxProps<T extends BasicEntity> {
  entityType: EntityType;
  items: T[];
}

// TODO: make this with basic components from react aria

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
