import { useLocation } from "react-router";
import { Tab, TabList, Tabs } from "~/components/ui/tabs";
import { noteHref } from "~/util/generate-hrefs";

interface NoteNavigationProps {
  noteId: string;
  gameId: string;
}

// Using buttons instead of links so we can use Remix's navigate hook, to access
// relative path navigation
export function NoteNavigation({ noteId, gameId }: NoteNavigationProps) {
  const { pathname } = useLocation();
  let selectedKey = "/";
  if (pathname.endsWith("/links")) selectedKey = "/links";
  if (pathname.endsWith("/images")) selectedKey = "/images";

  const baseUrl = noteHref(gameId, noteId);
  return (
    <Tabs selectedKey={selectedKey}>
      <TabList>
        <Tab id={"/"} href={baseUrl}>
          Overview
        </Tab>
        <Tab id={"/links"} href={`${baseUrl}/links`}>
          Links
        </Tab>
        <Tab id={"/images"} href={`${baseUrl}/images`}>
          Images
        </Tab>
      </TabList>
    </Tabs>
  );
}
