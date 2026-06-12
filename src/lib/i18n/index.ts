import * as i18n from "@solid-primitives/i18n";
import * as defaultDictRaw from "./dicts/en.json";

export const locales = ["en", "ar"] as const;
export const defaultLocale: (typeof locales)[number] = locales[0];

export type Locale = (typeof locales)[number];
export type RawDictionary = typeof defaultDictRaw;
export type Dictionary = i18n.Flatten<RawDictionary>;

export const defaultDict: Dictionary = i18n.flatten(defaultDictRaw);

export async function fetchDictionary(locale: Locale): Promise<Dictionary> {
	const dict: RawDictionary = await import(`./dicts/${locale}.json`);
	return { ...defaultDict, ...i18n.flatten(dict) };
}

export function isLocale(locale: string): locale is Locale {
	return locales.includes(locale as Locale);
}

export function toLocale(lang: string): Locale | undefined {
	return isLocale(lang) ? lang : undefined;
}

export function initialLocale(): Locale {
	return (
		toLocale(navigator.language.slice(0, 2)) ??
		toLocale(navigator.language.toLocaleLowerCase()) ??
		defaultLocale
	);
}
