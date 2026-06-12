import type { ParentProps } from "solid-js";
import { Sidebar } from "~/components/layout/Sidebar";
import { Footer } from "~/components/layout/Footer";
import { ScrollTop } from "~/components/utils/ScrollTop";

export default function BaseLayout(props: ParentProps) {
	return (
		<div class="min-h-screen flex flex-col">
			<Sidebar openable={true} showLinks={true} showLogin={true} />
			<div class="flex-1 h-full overflow-auto">{props.children}</div>
			<Footer class="mt-auto" />
			<ScrollTop />
		</div>
	);
}
