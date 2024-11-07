import type { Character, FactionWithPermissions } from "@repo/api";
import type { DatabaseCharacterInFaction } from "~/db/schema/characters";

type FactionWithMembersResult = FactionWithPermissions & {
	members: (DatabaseCharacterInFaction & {
		character: Character;
	})[];
};

export function mapMembersOfFaction(
	faction: FactionWithMembersResult,
) {
	return {
		...faction,
		members: faction.members.map((m) => ({
			...m.character,
			role: m.role,
		})),
	};
}
