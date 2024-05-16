import { MetaFunction } from "@remix-run/cloudflare";
import { SidebarLayout } from "~/components/layout";
import { Sidebar } from "./sidebar";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import { sharedSchema } from "@repo/schema";

export const meta: MetaFunction = () => {
	return [
		{ title: "Game Master" },
		{
			name: "description",
			content: "Create the game of your dreams.",
		},
	];
};

export default function AppRoute() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const result = sharedSchema.safeParse({ id: "string", name: "string" });

	return (
		<SidebarLayout isSidebarOpen={isSidebarOpen} sidebar={<Sidebar />}>
			<Outlet />
		</SidebarLayout>
	);
}
