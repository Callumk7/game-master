import type { Game } from "@repo/api";
import { ListBox, ListBoxItem } from "~/components/ui/list-box";

interface GamesSidebarProps {
  games: Game[];
}

export function GamesSidebar({ games }: GamesSidebarProps) {
  return (
    <aside className="w-64 bg-primary text-primary-foreground fixed h-full overflow-y-auto p-4">
      <ListBox items={games}>
        {(item) => <ListBoxItem href={`/games/${item.id}`}>{item.name}</ListBoxItem>}
      </ListBox>
    </aside>
  );
}
