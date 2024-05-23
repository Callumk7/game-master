import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Outlet, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { DialogTrigger } from "react-aria-components";
import { useTypedLoaderData } from "remix-typedjson";
import { EntityHeader, EntityView, SidebarLayout } from "~/components/layout";
import { NavigationLinks } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { Link } from "~/components/ui/link";
import { Menu, MenuItem } from "~/components/ui/menu";
import { CharacterSidebar } from "./components/character-sidebar";
import type { loader } from "./route";

export function CharacterView() {
	const { characterData, noteTree } = useTypedLoaderData<typeof loader>();
	const links = [
		{
			name: "Home",
			href: `/characters/${characterData.id}`,
		},
		{
			name: "Notes",
			href: `/characters/${characterData.id}/notes`,
		},
		{
			name: "Faction",
			href: `/characters/${characterData.id}/faction`,
		},
		{
			name: "links",
			href: `/characters/${characterData.id}/links`,
		},
	];
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	return (
		<SidebarLayout
			isSidebarOpen={isSidebarOpen}
			sidebar={<CharacterSidebar notes={noteTree} />}
		>
			<EntityView top className="px-6">
				<EntityHeader
					title={characterData.name}
					menu={<CharacterMenu characterId={characterData.id} />}
				>
					<NavigationLinks links={links} />
				</EntityHeader>
				<Outlet />
			</EntityView>
		</SidebarLayout>
	);
}

function CharacterMenu({ characterId }: { characterId: string }) {
	const submit = useSubmit();
	return (
		<DialogTrigger>
			<Button variant="ghost" size="icon">
				<DotsHorizontalIcon />
			</Button>
			<Menu>
				<MenuItem
					onAction={() =>
						submit({ characterId }, { method: "DELETE", action: "/characters" })
					}
				>
					Delete
				</MenuItem>
				<MenuItem>Duplicate</MenuItem>
			</Menu>
		</DialogTrigger>
	);
}
