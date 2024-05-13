import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import { Card } from "./card";
import { Button } from "./ui/button";
import { GridList, GridListItem } from "./ui/grid-list";
import { Header } from "./typeography";
import { Key, Selection } from "react-stately";
import { Link } from "./ui/link";
import { BasicEntity, EntityType, LINK_INTENT } from "@repo/db";

interface EntitySelectCardProps<T extends BasicEntity> {
	targetEntityId: string;
	targetEntityType: EntityType;
	allEntities: T[];
	selectedEntities: Set<Key>;
	setSelectedEntites: (selected: Set<Key>) => void;
	intent: LINK_INTENT;
	action?: string;
}

export function EntitySelectCard<T extends BasicEntity>({
	targetEntityId,
	targetEntityType,
	allEntities,
	selectedEntities,
	setSelectedEntites,
	intent,
	action,
}: EntitySelectCardProps<T>) {
	const fetcher = useFetcher();

	// Component state
	const [list, setList] = useState(allEntities.filter((e) => selectedEntities.has(e.id)));
	const [selectionMode, setSelectionMode] = useState<undefined | "multiple">();

	const handleSelectionChange = (keys: Selection) => {
		if (keys !== "all") {
			setSelectedEntites(keys);
		}
	};

	const labelMap = {
		[LINK_INTENT.CHARACTERS]: "Characters",
		[LINK_INTENT.ALLIES]: "Allies",
		[LINK_INTENT.ENEMIES]: "Enemies",
		[LINK_INTENT.FACTIONS]: "Factions",
		[LINK_INTENT.NOTES]: "Notes",
		[LINK_INTENT.SESSIONS]: "Sessions",
		[LINK_INTENT.PLOTS]: "Plots",
		[LINK_INTENT.ALL]: "All",
	};

	const label = labelMap[intent];

	const form = new FormData();
	selectedEntities.forEach((e) => form.append("entity_id", e.toString()));
	form.append("intent", intent);

	const handleToggleSelectionMode = () => {
		if (selectionMode) {
			fetcher.submit(form, {
				method: "PUT",
				action: action ?? `/${targetEntityType}/${targetEntityId}/links`,
			});
			setList(allEntities.filter((e) => selectedEntities.has(e.id)));
			setSelectionMode(undefined);
		} else {
			setList(allEntities);
			setSelectionMode("multiple");
		}
	};

	return (
		<Card className="space-y-2 bg-grade-2">
			<Header style="h4">{label}</Header>
			<GridList
				className={"bg-grade-1"}
				items={list}
				selectedKeys={selectedEntities}
				onSelectionChange={handleSelectionChange}
				selectionMode={selectionMode}
				renderEmptyState={() => (
					<div className="p-3 text-center w-full text-sm text-grade-10">
						No linked notes <Link href={`/${targetEntityType}/new`}>Create</Link>
					</div>
				)}
			>
				{(char) => <GridListItem>{char.name}</GridListItem>}
			</GridList>
			<Button size="sm" variant="outline" onPress={handleToggleSelectionMode}>
				{selectionMode === "multiple" ? "Save" : "Change"}
			</Button>
		</Card>
	);
}
