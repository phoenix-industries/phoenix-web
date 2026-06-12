import type { ParentProps } from "solid-js";
import { Sidebar } from "~/components/layout/Sidebar";

export default function AuthLayout(props: ParentProps) {
	return (
		<>
			<Sidebar />
			{props.children}
		</>
	);
}
