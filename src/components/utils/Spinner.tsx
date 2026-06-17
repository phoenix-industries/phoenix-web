import { Portal } from "solid-js/web";
import "./Spinner.css";

export function SpinnerCircle(props: { class?: string }) {
	return (
		<div class="flex justify-center items-center">
			<span
				class={`loading-circle ${props.class ?? "size-25 text-primary "}`}
			></span>
		</div>
	);
}

export function SpinnerInfinity(props: { class?: string }) {
	return (
		<div class="flex justify-center items-center">
			<span
				class={`loading-infinity ${props.class ?? "size-25 text-primary"}`}
			></span>
		</div>
	);
}

export function SpinnerInfinityOverlay(props: { class?: string }) {
	return (
		<Portal>
			<SpinnerInfinity class={`absolute inset-0 z-50 ${props.class ?? "size-25 text-primary"}`} />
		</Portal>
	);
}
