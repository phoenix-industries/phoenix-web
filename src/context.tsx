import {
	Suspense,
	createResource,
	createEffect,
	type ParentProps,
	createContext,
	useContext,
	startTransition,
} from "solid-js";
import { Meta } from "@solidjs/meta";
import * as i18n from "@solid-primitives/i18n";
import { store as settingsStore } from "~/lib/utils/settings";
import datetime from "~/lib/utils/datetime";
import {
	fetchDictionary,
	defaultDict,
	type Dictionary,
	type Locale,
} from "~/lib/i18n";

export interface State {
	t: i18n.Translator<Dictionary>;
	get dir(): "ltr" | "rtl";
	get locale(): Locale;
	setLocale(locale: Locale): void;
	get isDark(): boolean;
	setDark(value: boolean): void;
}

const AppContext = createContext<State>({} as State);

export const useAppState = () => useContext(AppContext);

export function AppContextProvider(props: ParentProps) {
	const [settings, setSettings] = settingsStore();

	const locale = () => settings.locale;
	const [dict] = createResource(locale, fetchDictionary, {
		initialValue: defaultDict,
	});

	const t = i18n.translator(dict, i18n.resolveTemplate);

	const state: State = {
		t: (path, ...args) => {
			const v = t(path, ...args);
			return v ? v : (path as typeof v);
		},
		get dir() {
			return t("_config.dir") === "ltr" ? "ltr" : "rtl";
		},
		get locale() {
			return settings.locale;
		},
		setLocale(locale: Locale) {
			void startTransition(() => {
				setSettings("locale", locale);
			});
		},
		get isDark() {
			return settings.dark;
		},
		setDark(value: boolean) {
			setSettings("dark", value);
		},
	};

	createEffect(() => {
		document.documentElement.lang = settings.locale;
		document.documentElement.dir = state.dir;
		datetime.locale(settings.locale);
	});
	createEffect(() => {
		if (settings.dark) {
			document.documentElement.setAttribute("data-theme", "dark");
		} else {
			document.documentElement.setAttribute("data-theme", "light");
		}
	});

	return (
		<Suspense>
			<AppContext.Provider value={state}>
				<Meta name="lang" content={locale()} />
				{props.children}
			</AppContext.Provider>
		</Suspense>
	);
}
