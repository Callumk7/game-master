import type { Character, Faction, FactionWithMembers } from "@repo/api";
import type { DatabaseCharacterInFaction } from "~/db/schema/characters";

type FactionWithMembersResult = Faction & {
	members: (DatabaseCharacterInFaction & {
		character: Character;
	})[];
};

export function mapMembersOfFaction(
	faction: FactionWithMembersResult,
): FactionWithMembers {
	return {
		...faction,
		members: faction.members.map((m) => ({
			...m.character,
			role: m.role,
		})),
	};
}
