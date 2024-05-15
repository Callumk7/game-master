import { Link } from "~/components/ui/link";
import { useFactionRouteData } from "../route";
import { Button } from "~/components/ui/button";
import { Form } from "@remix-run/react";
import { Select, SelectItem } from "~/components/ui/select";
import { useState } from "react";

export function LeaderSelect() {
	const { faction } = useFactionRouteData();
	const [isEditing, setIsEditing] = useState(false);
	return (
		<div>
			{faction.leader && !isEditing ? (
				<div className="border-b border-grade-6 pb-2 flex gap-4 items-center">
					<div>
						<span className="font-semibold mr-3">Leader:</span>
						<Link href={`/characters/${faction.leaderId}`}>{faction.leader.name}</Link>
					</div>
					<Button size="sm" variant="outline" onPress={() => setIsEditing(true)}>
						Change
					</Button>
				</div>
			) : (
				<Form method="POST" className="flex gap-2 items-center">
					<Select
						name="leaderId"
						items={faction.members.map((char) => char.character)}
						placeholder="Select faction leader"
						className={"w-fit"}
					>
						{(item) => <SelectItem>{item.name}</SelectItem>}
					</Select>
					<input type="hidden" value="leader" name="intent" />
					<Button type="submit" size="icon" onPress={() => setIsEditing(false)}>
						Go
					</Button>
				</Form>
			)}
		</div>
	);
}
