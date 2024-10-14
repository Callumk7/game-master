import { useQuery } from "@tanstack/react-query";
import { clientApi } from "~/lib/queries";

export const useGetGameWithMembers = (gameId: string) => {
	return useQuery({
		queryKey: ["games", gameId],
		queryFn: async () => clientApi.games.getGameWithMembers(gameId),
	});
};
