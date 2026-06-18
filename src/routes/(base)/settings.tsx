import { createSignal, Show, Switch, Match, Suspense } from "solid-js";
import { createAsync } from "@solidjs/router";
import { ensureSessionQuery } from "~/lib/api/auth";
import { getUserQuery } from "~/lib/api/users";
import { SpinnerInfinity } from "~/components/utils/Spinner";
import { SettingsProfile } from "~/components/settings/SettingsProfile";
import UserCircleIcon from "lucide-solid/icons/user-circle";
import CogIcon from "lucide-solid/icons/cog";
import "./settings.css";
import { SettingsAccount } from "~/components/settings/SettingsAccount";

export default function SettingsPage() {
	const user = createAsync(
		async () => {
			await ensureSessionQuery();
			const user = await getUserQuery("me");
			if (!user.ok) return null;
			return user.data;
		},
		{
			initialValue: null,
			deferStream: true,
		},
	);
	const [activeSection, setActiveSection] = createSignal("profile");

	return (
		<main class="container">
			<div class="settings-layout">
				<div class="settings-sidebar">
					<div
						class="settings-nav-item"
						classList={{ active: activeSection() === "profile" }}
						onClick={() => setActiveSection("profile")}
					>
						<UserCircleIcon size="20" /> Profile
					</div>
					<div
						class="settings-nav-item"
						classList={{ active: activeSection() === "account" }}
						onClick={() => setActiveSection("account")}
					>
						<CogIcon size="20" /> Account
					</div>
				</div>
				<div class="settings-content">
					<Suspense
						fallback={<SpinnerInfinity class="text-primary" />}
					>
						<Show
							when={user()}
							fallback={
								<div style="text-align:center;padding:2rem;">
									Loading settings...
								</div>
							}
						>
							{(u) => (
								<Switch fallback={<div>Unknown section</div>}>
									<Match when={activeSection() === "profile"}>
										<SettingsProfile user={u()} />
									</Match>
									<Match when={activeSection() === "account"}>
										<SettingsAccount user={u()} />
									</Match>
								</Switch>
							)}
						</Show>
					</Suspense>
				</div>
			</div>
		</main>
	);
}
