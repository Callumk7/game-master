import { useSessionRouteData } from "../_app.sessions.$sessionId/route";
import { Form, json } from "@remix-run/react";
import { useAppData } from "../_app/route";
import { Card } from "~/components/card";
import { Header } from "~/components/typeography";
import { RenderHtml } from "~/components/render-html";
import { Select, SelectItem } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { SewingPinIcon } from "@radix-ui/react-icons";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { extractParam } from "~/lib/zx-util";
import { patch } from "~/lib/game-master";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const sessionId = extractParam("sessionId", params);
	const form = await request.formData();
	const res = await patch(context, `sessions/${sessionId}`, form);
	return json(await res.json());
};

export default function SessionViewIndex() {
	const { session } = useSessionRouteData();
	return (
		<div>
			<PinnedNote pinnedNoteId={session.pinnedNoteId} />
		</div>
	);
}

function PinnedNote({ pinnedNoteId }: { pinnedNoteId: string | null }) {
	const { allNotes } = useAppData();
	const note = allNotes.find((note) => note.id === pinnedNoteId);
	if (!note) {
		return (
			<div className="max-w-md">
				<Form method="POST" className="flex gap-2 items-center">
					<Select name="pinnedNoteId" items={allNotes} placeholder="Select a note to pin">
						{(item) => <SelectItem>{item.name}</SelectItem>}
					</Select>
					<Button type="submit" size="icon-sm">
						<SewingPinIcon />
					</Button>
				</Form>
			</div>
		);
	}

	return (
		<Card className="border-amber-6">
			<Collapsible>
				<CollapsibleTrigger>
					<div className="w-full">
						<Header style="h3">{note.name}</Header>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<RenderHtml content={note.htmlContent} />
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}
