import { useTypedLoaderData } from "remix-typedjson";
import { loader } from "./route";
import { EditableText } from "~/components/editable-text";
import { useSyncEditor } from "~/hooks/sync-editor";
import { EditorPreview } from "~/components/editor-preview";
import { Header } from "~/components/typeography";
import { Card } from "~/components/card";
import { Link } from "~/components/ui/link";
import { INTENT } from "@repo/db";
import { EditNoteToolbar } from "./components/toolbar";

export default function NoteView() {
	const { noteData, folders } = useTypedLoaderData<typeof loader>();

	const { editor, isEditing, setIsEditing } = useSyncEditor({
		initContent: noteData.htmlContent,
	});

	return (
		<div>
			{noteData.folder && (
				<p className="mb-4 text-xs bg-primary-7 text-primary-12 px-2 py-1 rounded-full w-fit">
					{noteData.folder.name}
				</p>
			)}
			<EditableText
				fieldName={"name"}
				value={noteData.name}
				inputClassName={
					"text-3xl font-bold mb-5 focus:outline-none bg-inherit text-grade-12"
				}
				inputLabel={"note name input"}
				buttonClassName={"text-3xl font-bold mb-5"}
				buttonLabel={"note name button"}
				method="patch"
			>
				<input type="hidden" name="intent" value={INTENT.UPDATE_NAME} />
			</EditableText>
			<div className="mb-5">
				<EditNoteToolbar
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					noteId={noteData.id}
					folders={folders}
				/>
			</div>
			<EditorPreview
				isEditing={isEditing}
				editor={editor}
				htmlContent={noteData.htmlContent}
			/>
			<div>
				<Card className="space-y-4 w-fit my-7">
					<Header style="h2">Links</Header>
					<div className="grid grid-cols-3 gap-4">
						<div>
							<Header style="h3">Characters</Header>
							<ul className="space-y-2">
								{noteData.characters.map((char) => (
									<li key={char.characterId}>
										<Link href={`/characters/${char.characterId}`} variant="secondary">
											{char.character.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<Header style="h3">Factions</Header>
							<ul className="space-y-2">
								{noteData.factions.map((char) => (
									<li key={char.factionId}>
										<Link href={`/factions/${char.factionId}`} variant="secondary">
											{char.faction.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<Header style="h3">Sessions</Header>
							<ul className="space-y-2">
								{noteData.sessions.map((char) => (
									<li key={char.sessionId}>
										<Link href={`/sessions/${char.sessionId}`} variant="secondary">
											{char.session.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
