import type {
	Character,
	Faction,
	Session,
	Note,
	BasicEntity,
	EntityType,
} from "@repo/db";
import { cn } from "callum-util";
import { Card } from "~/components/card";
import { Header } from "~/components/typeography";
import { Link } from "~/components/ui/link";
import { Separator } from "~/components/ui/separator";

interface LinksAsideProps {
	characters?: Character[];
	factions?: Faction[];
	sessions?: Session[];
	notes?: Note[];
	className?: string;
}
export function LinksAside({
	characters,
	factions,
	sessions,
	notes,
	className,
}: LinksAsideProps) {
	if (
		(!characters || characters.length === 0) &&
		(!factions || factions.length === 0) &&
		(!sessions || sessions.length === 0) &&
		(!notes || notes.length === 0)
	) {
		return null;
	}
	return (
		<div className={cn("pl-7 space-y-7", className)}>
			<Card>
				<div className="flex justify-between items-center mb-2 w-full">
					<Header style="h2" tanker>
						Links
					</Header>
				</div>
				<Separator />
				{characters && characters.length > 0 && (
					<LinksSection label="Characters" links={characters} type="characters" />
				)}
				{factions && factions.length > 0 && (
					<LinksSection label="Factions" links={factions} type="factions" />
				)}
				{sessions && sessions.length > 0 && (
					<LinksSection label="Sessions" links={sessions} type="sessions" />
				)}
				{notes && notes.length > 0 && (
					<LinksSection label="Notes" links={notes} type="notes" />
				)}
			</Card>
		</div>
	);
}

interface LinksSectionProps {
	links: BasicEntity[];
	label: string;
	type: EntityType;
}
function LinksSection({ links, label, type }: LinksSectionProps) {
	return (
		<>
			<h2 className="my-3 text-lg font-semibold">{label}</h2>
			<ul className="flex flex-col gap-2">
				{links.map((link) => (
					<li key={link.id}>
						<Link href={`/${type}/${link.id}`}>{link.name}</Link>
					</li>
				))}
			</ul>
		</>
	);
}

// function AddLinkModal() {
// 	const { noteData } = useNoteIdLoaderData();
// 	const { allCharacters, allFactions, allSessions } = useAppData();
// 	const [characters, setCharacters] = useState(
// 		new Set(noteData.characters.map((c) => c.characterId as Key)),
// 	);
// 	return (
// 		<DialogTrigger>
// 			<Button variant="ghost" size="icon-sm">
// 				<PlusCircledIcon />
// 			</Button>
// 			<Modal width="wide" height="fixed">
// 				<Dialog>
// 					<Header style="h3">Add Links</Header>
// 					<Tabs>
// 						<TabList>
// 							<Tab id="char">Characters</Tab>
// 							<Tab id="fact">Factions</Tab>
// 						</TabList>
// 						<TabPanel id="char">
// 							<EntitySelectCard
// 								targetEntityId={noteData.id}
// 								targetEntityType={"characters"}
// 								allEntities={allCharacters}
// 								selectedEntities={characters}
// 								setSelectedEntites={setCharacters}
// 								intent={LINK_INTENT.CHARACTERS}
// 								action=""
// 							/>
// 						</TabPanel>
// 						<TabPanel id="fact">fact</TabPanel>
// 					</Tabs>
// 				</Dialog>
// 			</Modal>
// 		</DialogTrigger>
// 	);
// }
