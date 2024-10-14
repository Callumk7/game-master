import {
	json,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import "./editor.css";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getTheme } from "./lib/theme/theme.server";
import { ThemeProvider } from "./lib/theme/dark-mode-context";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const theme = await getTheme(request);
	console.log(`Loader theme: ${theme}`);
	return json({ theme });
};

export function Layout({ children }: { children: React.ReactNode }) {
	const { theme } = useLoaderData<typeof loader>();
	return (
		<html lang="en" className={theme}>
			<head>
				<meta charSet="utf-8" />
				<meta name="color-scheme" content={theme === "system" ? "light-dark" : theme} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="dark:dark">
				<ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
