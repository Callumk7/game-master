import { Form, useNavigate, useSearchParams } from "@remix-run/react";
import { Container } from "~/components/layout";
import { TextEditor, useDefaultEditor } from "~/components/tiptap";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/field";
import { Toolbar } from "~/components/ui/toolbar";

export function NewNoteView() {
	const editor = useDefaultEditor("Start writing...");
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	return (
		<Container>
			<Form method="POST">
				<div className="flex flex-col gap-5">
					<Toolbar>
						<Button type="submit" className="w-fit">
							Save
						</Button>
						<Button
							variant="secondary"
							className="w-fit"
							onPress={() => navigate("/notes")}
						>
							Cancel
						</Button>
					</Toolbar>
					<Input
						defaultValue={searchParams.get("name") ?? "Note Title"}
						type="text"
						name="name"
						className={"pl-0 text-3xl font-semibold"}
						autoFocus
					/>
					<input type="hidden" name="htmlContent" value={editor?.getHTML()} />
				</div>
			</Form>
			<TextEditor editor={editor} />
		</Container>
	);
}
