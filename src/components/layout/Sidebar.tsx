import {
	createSignal,
	onMount,
	onCleanup,
	Show,
	type ParentProps,
} from "solid-js";
import { isServer } from "solid-js/web";
import { A, createAsync, useAction } from "@solidjs/router";
import { toast } from "solid-sonner";
import { getSessionQuery, logoutAction } from "~/lib/api/auth";
import { useAppState } from "~/context";
import XIcon from "lucide-solid/icons/x";
import SunIcon from "lucide-solid/icons/sun";
import MoonIcon from "lucide-solid/icons/moon";
import MenuIcon from "lucide-solid/icons/menu";
import DoorOpenIcon from "lucide-solid/icons/door-open";
import SquareArrowRightExitIcon from "lucide-solid/icons/square-arrow-right-exit";
import UserIcon from "lucide-solid/icons/user";
import Logo from "~/assets/logo.svg";
import "./Sidebar.css";

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

export type SidebarProps = ParentProps & {
	openable?: boolean;
	showLinks?: boolean;
	showLogin?: boolean;
};

export function Sidebar(props: SidebarProps) {
	const state = useAppState();
	const session = createAsync(() => getSessionQuery(), { deferStream: true });
	const logout = useAction(logoutAction);
	const [sidebarOpen, setSidebarOpen] = createSignal(false);

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Escape" && sidebarOpen()) {
			setSidebarOpen(false);
		}
	}

	async function handleLogout() {
		const res = await logout();
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		toast.success("Successfully logged out");
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
			<nav class="sticky top-0 z-99 w-full shadow-md backdrop-blur-xl drop-shadow-lg">
				<div class="logo-area">
					<div class="">
						<Logo />
					</div>
					<div class="logo-text">
						<h2>Phoenix</h2>
						<span>donate & trade</span>
					</div>
				</div>
				<Show when={props.showLinks}>
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
				</Show>
				<div class="nav-right">
					<button
						class="theme-toggle"
						onClick={() => state.setDark(!state.isDark)}
					>
						<Show when={state.isDark} fallback={<MoonIcon />}>
							<SunIcon />
						</Show>
					</button>
					<Show when={props.showLogin}>
						<Show
							when={session()?.ok}
							fallback={
								<a href="/login" class="sign-in-btn">
									Sign In
								</a>
							}
						>
							<A href="/profile" class="block">
								<div class="profile-badge">
									<UserIcon />
								</div>
							</A>
							<button
								class="logout-btn"
								onClick={() => handleLogout()}
							>
								Logout
							</button>
						</Show>
					</Show>

					<Show when={props.showLinks}>
						<button
							class="hamburger"
							onClick={() => setSidebarOpen(true)}
						>
							<MenuIcon />
						</button>
					</Show>
				</div>
			</nav>

			<Show when={props.children}>
				<div class="sidebar" classList={{ open: sidebarOpen() }}>
					<div
						class="close-btn"
						onClick={() => setSidebarOpen(false)}
					>
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
								<Show
									when={state.isDark}
									fallback={<MoonIcon />}
								>
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
			</Show>
			{props.children}
		</div>
	);
}
