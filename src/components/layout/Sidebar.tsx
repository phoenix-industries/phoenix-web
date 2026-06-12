import {
	createSignal,
	onMount,
	onCleanup,
	Show,
	type ParentProps,
} from "solid-js";
import { useAppState } from "~/context";
import XIcon from "lucide-solid/icons/x";
import SunIcon from "lucide-solid/icons/sun";
import MoonIcon from "lucide-solid/icons/moon";
import MenuIcon from "lucide-solid/icons/menu";
import DoorOpenIcon from "lucide-solid/icons/door-open";
import SquareArrowRightExitIcon from "lucide-solid/icons/square-arrow-right-exit";
import "./Sidebar.css";
import { isServer } from "solid-js/web";

type Link = {
	name: string;
	href: string;
	class?: string;
};

// TODO
const links: Link[] = [
	{ name: "Market", href: "/market" },
	{ name: "Donate", href: "/donate" },
	{ name: "Sell", href: "/sell" },
	{ name: "Categories", href: "/categories" },
	{ name: "About", href: "/about" },
	{ name: "App", href: "/mobile-app" },
];

export function Sidebar(props: ParentProps) {
	const state = useAppState();
	const [sidebarOpen, setSidebarOpen] = createSignal(false);

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Escape" && sidebarOpen()) {
			setSidebarOpen(false);
		}
	}

	onMount(() => {
		if (!isServer && typeof window !== "undefined") {
			window.addEventListener("keydown", handleKeyDown);
		}
	});
	onCleanup(() => {
		if (!isServer && typeof window !== "undefined") {
			window.removeEventListener("keydown", handleKeyDown);
		}
	});

	return (
		<div>
			<nav>
				<div class="logo-area">
					{/*
					<img
						src="assets/images/photo_2026-02-17_19-01-20.jpg"
						alt="Phoenix"
					/>
					*/}
					<div class="logo-text">
						<h2>Phoenix</h2>
						<span>donate & trade</span>
					</div>
				</div>
				<a href="#app-download" class="app-link-mobile">
					App
				</a>
				<div class="nav-links">
					<a href="#market">Market</a>
					<a href="#donate">Donate</a>
					<a href="#sell">Sell</a>
					<a href="#categories">Categories</a>
					<a href="about.html">About</a>
					<a href="#app-download" class="app-link">
						App
					</a>
				</div>
				<div class="nav-right">
					<button
						class="theme-toggle"
						onClick={() => state.setDark(!state.isDark)}
					>
						<Show when={state.isDark} fallback={<MoonIcon />}>
							<SunIcon />
						</Show>
					</button>
					<a href="/login" class="sign-in-btn">
						Sign In
					</a>
					<button
						class="hamburger"
						onClick={() => setSidebarOpen(true)}
					>
						<MenuIcon />
					</button>
				</div>
			</nav>

			<div class="sidebar" classList={{ open: sidebarOpen() }}>
				<div class="close-btn" onClick={() => setSidebarOpen(false)}>
					<XIcon />
				</div>
				<ul>
					<li>
						<a href="#market">Market</a>
					</li>
					<li>
						<a href="#donate">Donate</a>
					</li>
					<li>
						<a href="#sell">Sell</a>
					</li>
					<li>
						<a href="#categories">Categories</a>
					</li>
					<li>
						<a href="about.html">About</a>
					</li>
					<li>
						<a href="#app-download">App</a>
					</li>
					<li>
						<button
							id="sidebarThemeToggle"
							onClick={() => state.setDark(!state.isDark)}
						>
							<Show when={state.isDark} fallback={<MoonIcon />}>
								<SunIcon />
							</Show>
							Dark Mode
						</button>
					</li>
					<li>
						<a href="sign.html">
							<DoorOpenIcon /> Sign In
						</a>
					</li>
					<li>
						<button id="logoutSidebarBtn" class="logout-btn">
							<SquareArrowRightExitIcon /> Logout
						</button>
					</li>
				</ul>
			</div>
			<div
				class="overlay"
				onClick={() => setSidebarOpen(false)}
				classList={{ active: sidebarOpen() }}
			></div>
			{props.children}
		</div>
	);
}
