import { Portal } from "solid-js/web";
import "./Spinner.css";

export function SpinnerCircle(props: { class?: string }) {
	return (
		<div class={`flex justify-center items-center ${props.class}`}>
			<span class="size-25 text-primary loading-circle"></span>
		</div>
	);
}

export function SpinnerInfinity(props: { class?: string }) {
	return (
		<div class={`flex justify-center items-center ${props.class}`}>
			<span class="size-25 text-primary loading-infinity"></span>
		</div>
	);
}

export function SpinnerInfinityOverlay(props: { class?: string }) {
	return (
		<Portal>
			<SpinnerInfinity
				class={`absolute inset-0 z-50 bg-base-100 ${props.class}`}
			/>
		</Portal>
	);
}
