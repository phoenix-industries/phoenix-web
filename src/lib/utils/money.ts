export const defaultLocale = "en-EG";
export const defaultCurrency = "EGP";

export const formatOptions: Intl.NumberFormatOptions = {
	style: "currency",
	currency: defaultCurrency,
	useGrouping: true,
	currencySign: "accounting",
	currencyDisplay: "code",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
};

export const defaultFormatter = new Intl.NumberFormat(
	defaultLocale,
	formatOptions,
);

export type FormatOptions = Intl.NumberFormatOptions & {
	locale?: string;
};

export function format(n: number, options?: FormatOptions): string {
	return options
		? new Intl.NumberFormat(
				options?.locale ?? defaultLocale,
				options,
			).format(n / 100)
		: defaultFormatter.format(n / 100);
}
