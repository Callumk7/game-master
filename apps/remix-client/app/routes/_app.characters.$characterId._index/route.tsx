import { EntityListBox } from "~/components/entity-listbox";
import { useCharacterRouteData } from "../_app.characters.$characterId/route";
import { EditorPreview } from "~/components/editor-preview";
import { Header, HeaderLink } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { useSyncEditor } from "~/hooks/sync-editor";
import { Pencil1Icon, PlusCircledIcon, TriangleUpIcon } from "@radix-ui/react-icons";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { extractParam } from "~/lib/zx-util";
import { Card } from "~/components/card";
import {
	BasicEntity,
	CharacterWithRaceAndFactions,
	EntityType,
	LINK_INTENT,
	LinkIntentSchema,
} from "@repo/db";
import { DialogTrigger } from "react-aria-components";
import { Popover } from "~/components/ui/popover";
import { useSubmit } from "@remix-run/react";
import { useAppData } from "../_app/route";
import { ListBox, ListBoxItem } from "~/components/ui/list-box";
import { createApi, post, put } from "~/lib/game-master";
import { validateUser } from "~/lib/auth";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	// On the character page, we can add links to other entities, we do this
	// with a PUT request to the server, with the intent, and the required ids.
	// In the case of this specific route, that is ALWAYS a single id.
	if (request.method === "POST") {
		const characterId = extractParam("characterId", params);
		const form = await request.formData();
		const res = await post(context, `characters/${characterId}/links`, form);
		console.log(res);
		return json({ success: "maybe" });
	}
};

export default function CharacterIndex() {
	const { allFactions, allSessions } = useAppData();
	const { characterData } = useCharacterRouteData();
	const { editor, isEditing, setIsEditing } = useSyncEditor({
		initContent: characterData.bio,
		action: `/characters/${characterData.id}`,
	});
	return (
		<div className="grid grid-cols-3 gap-4">
			<div className="space-y-4 col-span-2">
				<div className="flex gap-x-6 items-center">
					<Header style="h2">Character Bio</Header>
					<Button variant="ghost" onPress={() => setIsEditing(!isEditing)} size="icon-sm">
						{isEditing ? <TriangleUpIcon /> : <Pencil1Icon />}
					</Button>
				</div>
				<EditorPreview
					editor={editor}
					isEditing={isEditing}
					htmlContent={characterData.bio}
				/>
			</div>
			<div className="space-y-10 pl-16">
				<LinkAside
					type="factions"
					header="Factions"
					items={characterData.factions.map((f) => f.faction)}
					allItems={allFactions}
					intent={LINK_INTENT.FACTIONS}
				/>
				<LinkAside
					type="sessions"
					header="Sessions"
					items={characterData.sessions.map((s) => s.session)}
					allItems={allSessions}
					intent={LINK_INTENT.SESSIONS}
				/>
			</div>
		</div>
	);
}

interface LinkAsideProps<T> {
	header: string;
	items: T[];
	allItems: T[];
	type: EntityType;
	intent: LINK_INTENT;
}
function LinkAside<T extends BasicEntity>({
	header,
	items,
	allItems,
	type,
	intent,
}: LinkAsideProps<T>) {
	return (
		<Card>
			<div className="flex w-full justify-between items-center">
				<HeaderLink to={`/${type}`} style="h4" className="mb-3 pl-3">
					{header}
				</HeaderLink>
				<LinkEntityDropdown items={allItems} intent={intent} />
			</div>
			<EntityListBox items={items} type={type} className="border-0" />
		</Card>
	);
}

interface LinkEntityDropdownProps<T> {
	items: T[];
	action?: string;
	intent: LINK_INTENT;
}
function LinkEntityDropdown<T extends BasicEntity>({
	items,
	action,
	intent,
}: LinkEntityDropdownProps<T>) {
	const submit = useSubmit();
	return (
		<DialogTrigger>
			<Button variant="ghost" size="icon-sm">
				<PlusCircledIcon />
			</Button>
			<Popover>
				<ListBox
					items={items}
					onAction={(k) =>
						submit({ targetId: k.toString(), intent }, { method: "POST", action })
					}
					className={"border-0"}
				>
					{(item) => <ListBoxItem>{item.name}</ListBoxItem>}
				</ListBox>
			</Popover>
		</DialogTrigger>
	);
}
