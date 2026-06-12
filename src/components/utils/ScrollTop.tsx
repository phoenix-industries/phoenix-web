import { clientOnly } from "@solidjs/start";
import { createSignal, onMount, onCleanup } from "solid-js";
import ArrowUpIcon from "lucide-solid/icons/arrow-up";

function scrollTop({ threshold = 300 }) {
	const [visible, setVisible] = createSignal(false);
	let ticking = false;

	function updateVisibility() {
		const scrolled = window.scrollY > threshold;
		if (visible() !== scrolled) {
			setVisible(scrolled);
		}
	}

	function handleScroll() {
		if (ticking) {
			return;
		}
		requestAnimationFrame(() => {
			updateVisibility();
			ticking = false;
		});
		ticking = true;
	}

	onMount(() => {
		updateVisibility();
		window.addEventListener("scroll", handleScroll, { passive: true });
	});

	onCleanup(() => {
		window.removeEventListener("scroll", handleScroll);
	});

	return (
		<button
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			aria-label="Scroll to top"
			class="fixed bottom-6 right-6 p-3 text-white rounded-full bg-primary/90 hover:bg-primary shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			classList={{
				"opacity-100 pointer-events-auto": visible(),
				"opacity-0 pointer-events-none": !visible(),
			}}
		>
			<ArrowUpIcon size={24} />
		</button>
	);
}

export const ScrollTop = clientOnly(
	async () => ({
		default: scrollTop,
	}),
	{
		lazy: true,
	},
);
