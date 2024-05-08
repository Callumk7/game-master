import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ExitIcon,
	Pencil2Icon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Toolbar } from "./ui/toolbar";
import { Menu, MenuItem } from "./ui/menu";
import { DialogTrigger } from "react-aria-components";
import { Tooltip } from "./ui/tooltip";
import { Form } from "@remix-run/react";
import { QuickNoteSlideOver } from "./quick-note-slideover";

interface AppToolbarProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (isOpen: boolean) => void;
}
export function AppToolbar({ isSidebarOpen, setIsSidebarOpen }: AppToolbarProps) {
	return (
		<Toolbar className="p-4">
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
				<Form method="POST" action="/logout">
					<Button variant="secondary" size="icon-sm" type="submit">
						<ExitIcon />
					</Button>
				</Form>
			</Tooltip>
		</Toolbar>
	);
}
