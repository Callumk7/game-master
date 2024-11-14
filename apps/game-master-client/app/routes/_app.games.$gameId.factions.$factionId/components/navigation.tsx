import { useLocation } from "@remix-run/react";
import { Tab, TabList, Tabs } from "~/components/ui/tabs";
import { factionHref } from "~/util/generate-hrefs";

interface FactionNavigationProps {
  factionId: string;
  gameId: string;
}

export function FactionNavigation({ factionId, gameId }: FactionNavigationProps) {
  const { pathname } = useLocation();
  let selectedKey = "/";
  if (pathname.endsWith("/members")) selectedKey = "/members";
  if (pathname.endsWith("/relations")) selectedKey = "/relations";
  if (pathname.endsWith("/images")) selectedKey = "/images";
  const baseUrl = factionHref(gameId, factionId);
  return (
    <Tabs selectedKey={selectedKey}>
      <TabList>
        <Tab id={"/"} href={baseUrl}>
          Overview
        </Tab>
        <Tab id={"/members"} href={`${baseUrl}/members`}>
          Members
        </Tab>
        <Tab id={"/relations"} href={`${baseUrl}/relations`} isDisabled>
          Relations
        </Tab>
        <Tab id={"/images"} href={`${baseUrl}/images`} isDisabled>
          Images
        </Tab>
      </TabList>
    </Tabs>
  );
}
