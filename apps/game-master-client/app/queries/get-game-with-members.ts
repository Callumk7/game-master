import type { SDK } from "@repo/api";
import { useQuery } from "@tanstack/react-query";

export const useGetGameWithMembers = (api: SDK, gameId: string) => {
	return useQuery({
		queryKey: ["games", gameId],
		queryFn: async () => api.games.getGameWithMembers(gameId),
	});
};
