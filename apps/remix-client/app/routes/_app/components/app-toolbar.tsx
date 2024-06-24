import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ExitIcon,
	HomeIcon,
    MagicWandIcon,
} from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Toolbar } from "~/components/ui/toolbar";
import { Tooltip } from "~/components/ui/tooltip";
import { Form, useNavigate } from "@remix-run/react";
import { QuickNoteSlideOver } from "~/components/quick-note-slideover";

interface AppToolbarProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (isOpen: boolean) => void;
}
export function AppToolbar({ isSidebarOpen, setIsSidebarOpen }: AppToolbarProps) {
	const navigate = useNavigate();
	return (
		<div className="sticky space-y-3 p-4">
			<Toolbar>
				<Tooltip content={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}>
					<Button
						size="icon-sm"
						variant="outline"
						onPress={() => setIsSidebarOpen(!isSidebarOpen)}
					>
						{isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</Button>
				</Tooltip>
				<Tooltip content={"Home"}>
					<Button size="icon-sm" variant="outline" onPress={() => navigate("/")}>
						<HomeIcon />
					</Button>
				</Tooltip>
				<Separator orientation="vertical" />
				<Tooltip content={"Create new..."}>
					<QuickNoteSlideOver action="/notes/new" />
				</Tooltip>
        <Tooltip content={"Generate note.."}>
          <Form>
            <Button type="submit" variant="outline" size="icon-sm">
              <MagicWandIcon />
            </Button>
          </Form>
        </Tooltip>
				<Tooltip content={"Logout"}>
					<Form method="POST" action="/logout" className="flex items-center">
						<Button variant="outline" size="icon-sm" type="submit">
							<ExitIcon />
						</Button>
					</Form>
				</Tooltip>
        
			</Toolbar>
		</div>
	);
}
