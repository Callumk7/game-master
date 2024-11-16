import { FileTextIcon, PersonIcon, TrashIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import type { Id } from "@repo/api";
import type { ReactNode } from "react";
import type { MenuItemProps } from "react-aria-components";
import { Button } from "~/components/ui/button";
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "~/components/ui/menu";

interface GameSettingsMenuProps {
  gameId: Id;
}

export function GameSettingsMenu({ gameId }: GameSettingsMenuProps) {
  const submit = useSubmit();
  return (
    <MenuTrigger>
      <Button variant={"outline"}>Game Settings</Button>
      <MenuPopover>
        <Menu>
          <SettingsMenuItem href={`/games/${gameId}/members`} icon={<PersonIcon />}>
            Members
          </SettingsMenuItem>
          <SettingsMenuItem href={`/games/${gameId}/manage`} icon={<FileTextIcon />}>
            Manage Game
          </SettingsMenuItem>
          <SettingsMenuItem
            onAction={() => submit({ gameId }, { method: "DELETE" })}
            icon={<TrashIcon />}
          >
            Delete Game
          </SettingsMenuItem>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}

interface SettingsMenuItemProps extends MenuItemProps {
  children: ReactNode;
  icon: ReactNode;
}

export function SettingsMenuItem({ icon, children, ...props }: SettingsMenuItemProps) {
  return (
    <MenuItem {...props}>
      <div className="flex items-center gap-x-2 w-full">
        {icon}
        {children}
      </div>
    </MenuItem>
  );
}
