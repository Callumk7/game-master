import { useLocation } from "@remix-run/react";
import { Tab, TabList, Tabs } from "~/components/ui/tabs";
import { characterHref } from "~/util/generate-hrefs";

interface CharacterNavigationProps {
  charId: string;
  gameId: string;
}

// Using buttons instead of links so we can use Remix's navigate hook, to access
// relative path navigation
export function CharacterNavigation({ charId, gameId }: CharacterNavigationProps) {
  const { pathname } = useLocation();
  let selectedKey = "/";
  if (pathname.endsWith("/factions")) selectedKey = "/factions";
  if (pathname.endsWith("/relations")) selectedKey = "/relations";

  const baseUrl = characterHref(gameId, charId);
  return (
    <Tabs selectedKey={selectedKey}>
      <TabList>
        <Tab id={"/"} href={baseUrl}>
          Overview
        </Tab>
        <Tab id={"/factions"} href={`${baseUrl}/factions`}>
          Factions
        </Tab>
        <Tab id={"/relations"} href={`${baseUrl}/relations`}>
          Relations
        </Tab>
        <Tab id={"/images"} href={`${baseUrl}/images`}>
          Images
        </Tab>
      </TabList>
    </Tabs>
  );
}
