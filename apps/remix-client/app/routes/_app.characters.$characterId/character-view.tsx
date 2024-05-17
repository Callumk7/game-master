import { Outlet, useSubmit } from "@remix-run/react";
import { EntityView, EntityHeader, SidebarLayout } from "~/components/layout";
import { loader } from "./route";
import { useTypedLoaderData } from "remix-typedjson";
import { Link } from "~/components/ui/link";
import { NavigationLinks } from "~/components/navigation";
import { DialogTrigger } from "react-aria-components";
import { Button } from "~/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Menu, MenuItem } from "~/components/ui/menu";
import { useState } from "react";
import { CharacterSidebar } from "./components/character-sidebar";

export function CharacterView() {
	const { characterData, noteTree } = useTypedLoaderData<typeof loader>();
	const characterNotes = characterData.notes.map((n) => n.note);
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
