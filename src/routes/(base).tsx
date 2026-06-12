import type { ParentProps } from "solid-js";
import { Sidebar } from "~/components/layout/Sidebar";
import { Footer } from "~/components/layout/Footer";

export default function BaseLayout(props: ParentProps) {
	return (
		<>
			<Sidebar openable={true} showLinks={true} showLogin={true} />
			{props.children}
			<Footer class="mt-auto" />
		</>
	);
}
