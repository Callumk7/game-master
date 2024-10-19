import type { SDK } from "@repo/api";
import { useQuery } from "@tanstack/react-query";

export const useGetAllUsers = (api: SDK) => {
	return useQuery({
		queryKey: ["users", "all"],
		queryFn: async () => api.users.getAllUsers(),
	});
};
