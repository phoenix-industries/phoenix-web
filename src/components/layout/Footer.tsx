import { A } from "@solidjs/router";

export function Footer(props: { class?: string }) {
	return (
		<div
			class={`p-6 text-center border border-(--divider-color) text-muted-foreground text-md ${props.class ?? ""}`}
		>
			Copyright © 2026 Phoenix -{" "}
			<A href="/about" class="text-primary font-bold">
				About
			</A>
		</div>
	);
}
