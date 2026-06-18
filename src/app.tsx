import { Suspense, type ParentProps } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider, Title } from "@solidjs/meta";
import { Toaster } from "solid-sonner";
import { AppContextProvider, useAppState } from "~/context";
import "~/lib/utils/datetime";
// import "@fontsource/inter";
import "./app.css";

function Root(props: ParentProps) {
	const ctx = useAppState();
	return (
		<>
			<Title>{ctx.t("global.title")}</Title>
			<Toaster
				richColors
				expand={false}
				theme={ctx.isDark ? "dark" : "light"}
			/>
			<main role="main">
				<Suspense>{props.children}</Suspense>
			</main>
		</>
	);
}

export default function App() {
	return (
		<MetaProvider>
			<Router
				base={import.meta.env.BASE_URL}
				root={(props) => (
					<AppContextProvider>
						<Root>{props.children}</Root>
					</AppContextProvider>
				)}
			>
				<FileRoutes />
			</Router>
		</MetaProvider>
	);
}
