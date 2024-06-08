import { ChevronLeftIcon, ChevronRightIcon, ExitIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Toolbar } from "./ui/toolbar";
import { Tooltip } from "./ui/tooltip";
import { Form } from "@remix-run/react";
import { QuickNoteSlideOver } from "./quick-note-slideover";
import { useAppData } from "~/routes/_app/route";

interface AppToolbarProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (isOpen: boolean) => void;
}
export function AppToolbar({ isSidebarOpen, setIsSidebarOpen }: AppToolbarProps) {
	return (
		<div className="sticky space-y-3 p-4">
			<Toolbar>
				<Tooltip content={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}>
					<Button size="icon-sm" onPress={() => setIsSidebarOpen(!isSidebarOpen)}>
						{isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</Button>
				</Tooltip>
				<Separator orientation="vertical" />
				<Tooltip content={"Create new..."}>
					<QuickNoteSlideOver action="/notes/new" />
				</Tooltip>
				<Tooltip content={"Logout"}>
					<Form method="POST" action="/logout" className="flex items-center">
						<Button variant="secondary" size="icon-sm" type="submit">
							<ExitIcon />
						</Button>
					</Form>
				</Tooltip>
			</Toolbar>
		</div>
	);
}
