import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useLocation, useParams } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Link } from "~/components/ui/link";
import { JollyMenu, MenuItem } from "~/components/ui/menu";
import { useAppData } from "~/routes/_app/route";
import { GameSettingsMenu } from "./game-settings-menu";

export function GameNavbar() {
  const params = useParams();
  const { pathname } = useLocation();

  const { userGames } = useAppData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = createLinks(params.gameId!);
  return (
    <nav
      className="flex sticky top-0 right-0 z-40 justify-between items-center p-4 w-full border-b bg-background/80 backdrop-blur"
      aria-label="Game navigation bar"
    >
      <div className="flex relative justify-between items-center w-full">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="lg:hidden"
          onPress={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "X" : <HamburgerMenuIcon />}
        </Button>
        <div className="hidden lg:flex lg:gap-1">
          <GameSelectMenu games={userGames} />
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              variant={pathname.includes(link.href) ? "secondary" : "ghost"}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="z-50 lg:flex">
          <GameSettingsMenu gameId={params.gameId!} />
        </div>
      </div>
      {isMenuOpen && (
        <div className="flex flex-col gap-2 mt-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              variant={pathname.endsWith(link.href) ? "secondary" : "ghost"}
              className="py-2 w-full text-center"
            >
              {link.label}
            </Link>
          ))}
          <GameSettingsMenu gameId={params.gameId!} />
        </div>
      )}
    </nav>
  );
}

const createLinks = (gameId: string) => {
  return [
    {
      label: "Notes",
      href: `/games/${gameId}/notes`,
    },
    {
      label: "Characters",
      href: `/games/${gameId}/characters`,
    },
    {
      label: "Factions",
      href: `/games/${gameId}/factions`,
    },
    {
      label: "Folders",
      href: `/games/${gameId}/folders`,
    },
  ];
};

interface GameSelectMenuProps {
  games: { name: string; id: string }[];
}
export function GameSelectMenu({ games }: GameSelectMenuProps) {
  return (
    <JollyMenu label="Games" items={games} variant={"ghost"}>
      {(item) => <MenuItem href={`/games/${item.id}`}>{item.name}</MenuItem>}
    </JollyMenu>
  );
}
