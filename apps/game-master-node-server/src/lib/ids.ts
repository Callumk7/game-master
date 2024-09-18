import { uuidv4 } from "callum-util";

export function generateGameId() {
	return `game_${uuidv4()}`;
}

export function generateNoteId() {
	return `note_${uuidv4()}`;
}

export function generateCharacterId() {
	return `char_${uuidv4()}`;
}

export function generateFactionId() {
	return `faction_${uuidv4()}`;
}
