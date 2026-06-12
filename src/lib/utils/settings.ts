import { toLocale, initialLocale, type Locale } from "~/lib/i18n";
import { createStore } from "solid-js/store";
import * as storage from "@solid-primitives/storage";

interface Settings {
	locale: Locale;
	dark: boolean;
}

export function initialSettings(): Settings {
	return {
		locale: initialLocale(),
		dark:
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches,
	};
}

export function deserialize(data: string): Settings {
	const parsed: unknown = JSON.parse(data);
	if (!parsed || typeof parsed !== "object") {
		return initialSettings();
	}
	return {
		locale:
			("locale" in parsed &&
				typeof parsed.locale === "string" &&
				toLocale(parsed.locale)) ||
			initialLocale(),
		dark:
			"dark" in parsed && typeof parsed.dark === "boolean"
				? parsed.dark
				: false,
	};
}

export function store() {
	const cookieOptions: storage.CookieOptions = {
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
	};
	return storage.makePersisted(createStore(initialSettings()), {
		name: "settings",
		storage: storage.cookieStorage,
		storageOptions: cookieOptions,
		deserialize: deserialize,
	});
}
