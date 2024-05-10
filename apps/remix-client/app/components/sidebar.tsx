import {
	PersonIcon,
	HomeIcon,
	PlusCircledIcon,
	EyeOpenIcon,
	Pencil1Icon,
} from "@radix-ui/react-icons";
import type { ReactNode } from "react";
import type {
	Character,
	Faction,
	FolderWithNotes,
	NamedPlot,
	Note,
	Plot,
	Session,
} from "@repo/db";
import { Link } from "./ui/link";
import { Button } from "./ui/button";
import { Form, useNavigate } from "@remix-run/react";
import { ScrollArea } from "./ui/scroll-area";
import { DialogTrigger } from "react-aria-components";
import { Popover } from "./ui/popover";
import { Dialog } from "./ui/dialog";
import { TextField } from "./ui/text-field";
import { AppToolbar } from "./app-toolbar";
import { EntityListBox } from "./entity-listbox";
import { Header } from "./typeography";
import { NumberField } from "./ui/number-field";
import { NewSessionForm } from "./forms/new-session";
import { NewCharacterForm } from "./forms/new-character";
import { NewFactionForm } from "./forms/new-faction";

interface SidebarProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (isOpen: boolean) => void;
	characters: Character[];
	factions: Faction[];
	plots: Plot[];
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
	plots,
	sessions,
}: SidebarProps) {
	const plotsWithName = plots.filter((plot): plot is NamedPlot => plot.name !== null);
	return (
		<div className="fixed min-w-[15vw] max-w-56 h-full min-h-screen max-h-screen pt-4 bg-grade-1 border-r border-grade-5">
			<ScrollArea className="h-full">
				<AppToolbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
				<div className="p-2 border-b border-grade-6 space-y-4">
					<SidebarSection
						title="Sessions"
						icon={<HomeIcon />}
						href="/sessions"
						popover={<Dialog>{({ close }) => <NewSessionForm close={close} />}</Dialog>}
					>
						<EntityListBox type="sessions" items={sessions} className="border-0" />
					</SidebarSection>
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
						{folders.map((folder) => (
							<div key={folder.id}>
								<Header style="h5">{folder.name}</Header>
								<EntityListBox type="notes" items={folder.notes} className="border-0" />
							</div>
						))}
						<div>
							<Header style="h5">Unsorted</Header>
							<EntityListBox type="notes" items={notes} className="border-0" />
						</div>
					</SidebarSection>
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
						href="/characters"
						popover={<Dialog>{({ close }) => <NewFactionForm close={close} />}</Dialog>}
					>
						<EntityListBox type="characters" items={characters} className="border-0" />
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
// TODO: there is no empty title validation on the create popover
export function SidebarSection({
	title,
	href,
	icon,
	children,
	popover,
}: SidebarSectionProps) {
	const navigate = useNavigate();
	return (
		<div className="relative w-full py-3">
			<div className="flex justify-between">
				<Link
					href={href}
					size="sm"
					className="flex gap-3 items-center text-grade-11 font-semibold"
				>
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
	title: string;
	href: string;
	icon: ReactNode;
	children: ReactNode;
	isNoteSection?: boolean;
}
// TODO: there is no empty title validation on the create popover
export function NoteSectionWithFolders({
	title,
	href,
	icon,
	children,
	isNoteSection,
}: NoteSectionWithFoldersProps) {
	const navigate = useNavigate();
	return (
		<div className="relative w-full py-3">
			<div className="flex justify-between">
				<Link
					href={href}
					size="sm"
					className="flex gap-3 items-center text-grade-11 font-semibold"
				>
					{icon}
					<span>{title}</span>
				</Link>
				{isNoteSection ? (
					<DialogTrigger>
						<Button variant="ghost" size="icon-sm">
							<PlusCircledIcon />
						</Button>
						<Popover>
							<Dialog>
								{({ close }) => (
									<Form method="GET" action={`${href}/new`} onSubmit={() => close()}>
										<TextField label="Note Title" name="name" />
									</Form>
								)}
							</Dialog>
						</Popover>
					</DialogTrigger>
				) : (
					<Button variant="ghost" size="icon-sm" onPress={() => navigate(`${href}/new`)}>
						<PlusCircledIcon />
					</Button>
				)}
			</div>
			{children}
		</div>
	);
}
