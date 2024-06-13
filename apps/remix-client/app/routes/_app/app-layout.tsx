import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { useState } from "react";
import { SidebarLayout } from "~/components/layout";
import { Sidebar } from "./components/sidebar";
import { Button } from "~/components/ui/button";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Outlet } from "@remix-run/react";

export function AppRoute() {
	const { allCharacters, allFactions, allFolders, allSessions, unsortedNotes, session } =
		useTypedLoaderData<typeof loader>();

	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<SidebarLayout
			isSidebarOpen={isSidebarOpen}
			sidebar={
				<Sidebar
					isSidebarOpen={isSidebarOpen}
					setIsSidebarOpen={setIsSidebarOpen}
					characters={allCharacters}
					factions={allFactions}
					notes={unsortedNotes}
					folders={allFolders}
					sessions={allSessions}
				/>
			}
		>
			<Button className={"absolute top-2 right-2"} size="sm" variant="ghost">
				{session.data.username}
			</Button>
			<div className="relative">
				{!isSidebarOpen && (
					<Button
						size="icon-sm"
						onPress={() => setIsSidebarOpen(true)}
						className="absolute left-9 top-2 z-50"
					>
						<ChevronRightIcon />
					</Button>
				)}
				<Outlet />
			</div>
		</SidebarLayout>
	);
}
