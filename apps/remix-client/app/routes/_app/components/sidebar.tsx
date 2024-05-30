import {
	PersonIcon,
	HomeIcon,
	PlusCircledIcon,
	EyeOpenIcon,
	Pencil1Icon,
} from "@radix-ui/react-icons";
import type { ReactNode } from "react";
import type { Character, Faction, FolderWithNotes, Note, Session } from "@repo/db";
import { Link } from "~/components/ui/link";
import { Button } from "~/components/ui/button";
import { Form } from "@remix-run/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { DialogTrigger } from "react-aria-components";
import { Popover } from "~/components/ui/popover";
import { Dialog } from "~/components/ui/dialog";
import { TextField } from "~/components/ui/text-field";
import { AppToolbar } from "~/components/app-toolbar";
import { EntityListBox } from "~/components/entity-listbox";
import { Header } from "~/components/typeography";
import { NewSessionForm } from "~/components/forms/new-session";
import { NewCharacterForm } from "~/components/forms/new-character";
import { NewFactionForm } from "~/components/forms/new-faction";

interface SidebarProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (isOpen: boolean) => void;
	characters: Character[];
	factions: Faction[];
	notes: Note[];
	folders: FolderWithNotes[];
	sessions: Session[];
}
export function Sidebar({
	isSidebarOpen,
	setIsSidebarOpen,
	characters,
	factions,
	notes,
	folders,
	sessions,
}: SidebarProps) {
	return (
		<div className="fixed pt-4 pr-2 pl-4 h-full min-h-screen max-h-screen border-r bg-primary-1 min-w-[15vw] max-w-56 border-grade-5">
			<ScrollArea className="h-full">
				<AppToolbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
				<div className="p-2 space-y-4 border-b border-grade-6">
					<SidebarSection
						title="Sessions"
						icon={<HomeIcon />}
						href="/sessions"
						popover={<Dialog>{({ close }) => <NewSessionForm close={close} />}</Dialog>}
					>
						<EntityListBox type="sessions" items={sessions} className="border-0" />
					</SidebarSection>
					<NoteSectionWithFolders folders={folders} unsortedNotes={notes} />
					<SidebarSection
						title="Characters"
						icon={<PersonIcon />}
						href="/characters"
						popover={<Dialog>{({ close }) => <NewCharacterForm close={close} />}</Dialog>}
					>
						<EntityListBox type="characters" items={characters} className="border-0" />
					</SidebarSection>
					<SidebarSection
						title="Factions"
						icon={<EyeOpenIcon />}
						href="/factions"
						popover={<Dialog>{({ close }) => <NewFactionForm close={close} />}</Dialog>}
					>
						<EntityListBox type="factions" items={factions} className="border-0" />
					</SidebarSection>
				</div>
			</ScrollArea>
		</div>
	);
}

// A section for each entity in the application.
interface SidebarSectionProps {
	title: string;
	href: string;
	icon: ReactNode;
	children: ReactNode;
	popover: ReactNode;
}
export function SidebarSection({
	title,
	href,
	icon,
	children,
	popover,
}: SidebarSectionProps) {
	return (
		<div className="relative py-3 w-full">
			<div className="flex justify-between">
				<Link href={href} size="sm" className="flex gap-3 items-center">
					{icon}
					<span>{title}</span>
				</Link>
				<DialogTrigger>
					<Button variant="ghost" size="icon-sm">
						<PlusCircledIcon />
					</Button>
					<Popover>{popover}</Popover>
				</DialogTrigger>
			</div>
			{children}
		</div>
	);
}

// A section for each entity in the application.
interface NoteSectionWithFoldersProps {
	folders: FolderWithNotes[];
	unsortedNotes: Note[];
}
// TODO: there is no empty title validation on the create popover
export function NoteSectionWithFolders({
	folders,
	unsortedNotes,
}: NoteSectionWithFoldersProps) {
	return (
		<SidebarSection
			title="Notes"
			icon={<Pencil1Icon />}
			href="/notes"
			popover={
				<Dialog>
					{({ close }) => (
						<Form method="GET" action="/notes/new" onSubmit={() => close()}>
							<TextField label="Note Title" name="name" />
						</Form>
					)}
				</Dialog>
			}
		>
			<div className="space-y-4">
				{folders.map((folder) => {
					if (folder.notes.length > 0) {
						return (
							<div key={folder.id}>
								<Header style="h5" className="ml-3" colour="amber">
									{folder.name}
								</Header>
								<EntityListBox type="notes" items={folder.notes} className="border-0" />
							</div>
						);
					}
				})}
				<div>
					<Header style="h5" className="ml-3" colour="amber">
						Unsorted
					</Header>
					<EntityListBox type="notes" items={unsortedNotes} className="border-0" />
				</div>
			</div>
		</SidebarSection>
	);
}
