import { useParams } from "@remix-run/react";
import { Link } from "~/components/ui/link";
import { GameSettingsMenu } from "./game-settings-menu";
import { Button } from "~/components/ui/button";
import { useIsRightSidebarOpen, useSetRightSidebarOpen } from "~/store/selection";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

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
      label: "Collections",
      href: `/games/${gameId}/collections`,
    },
  ];
};

export function GameNavbar() {
  const params = useParams();
  const links = createLinks(params.gameId!);
  const isRightSidebarOpen = useIsRightSidebarOpen();
  const setIsRightSidebarOpen = useSetRightSidebarOpen();
  return (
    <nav className="flex w-full p-4 justify-between items-center" aria-label="Game navigation bar">
      <div className="flex">
        {links.map((link) => (
          <Link key={link.label} href={link.href} variant={"ghost"}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-4">
        <GameSettingsMenu gameId={params.gameId!} />
        <Button
          size={"icon"}
          variant={"outline"}
          onPress={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          aria-label="Toggle right sidebar"
        >
          {isRightSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </Button>
      </div>
    </nav>
  );
}
