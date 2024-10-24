import type { SDK, User } from "@repo/api";
import { useQuery } from "@tanstack/react-query";

export const useGetGameWithMembers = (gameId: string) => {
	return useQuery({
		queryKey: ["games", gameId],
		queryFn: async () =>
			fetch(`/members/${gameId}`).then(
				(result) => result.json() as Promise<{members: User[]}>,
			),
	});
};
