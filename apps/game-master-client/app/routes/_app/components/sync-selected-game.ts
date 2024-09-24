import { useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useGameSelectionId, useSetGameSelection } from "~/store/selection";

export const useSyncSelectedGameWithParams = () => {
	const params = useParams();
	const selectedGame = useGameSelectionId();
	const updateSelection = useSetGameSelection();

	useEffect(() => {
		if (params.gameId && selectedGame !== params.gameId) {
			updateSelection(params.gameId);
		}
	});

	return {
		selectedGame,
		updateSelection,
	};
};
