export function Footer(props: { class?: string }) {
	return (
		<div
			class={`p-6 text-center border border-(--divider-color) text-muted-foreground text-md ${props.class ?? ""}`}
		>
			Copyright © 2026 Phoenix -{" "}
			<a href="/about.html" class="text-primary font-bold">
				About
			</a>{" "}
			-{" "}
			<a href="sign.html" class="text-primary font-bold">
				Sign In
			</a>
		</div>
	);
}
