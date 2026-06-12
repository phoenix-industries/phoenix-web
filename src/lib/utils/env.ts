"use server";

import dotenv from "dotenv";

export const MODE = process.env.NODE_ENV ?? "development";
export const DEV = MODE === "development";
export const PROD = MODE === "production";

console.log(`env: mode=${MODE.toUpperCase()}`);

dotenv.config({
	path: [
		".env",
		".env.local",
		`.env.${PROD ? "prod" : "dev"}`,
		`.env.${PROD ? "prod" : "dev"}.local`,
	],
	encoding: "utf8",
	override: true,
	debug: DEV,
	quiet: PROD,
});

const envVarKeys = [
	"TRUSTED_ORIGINS",
	"CSRF_TOKEN",
	"SERVER_URL",
	"SESSION_SECRET",
] as const;
type EnvVarKey = (typeof envVarKeys)[number];

export const vars: Record<EnvVarKey, string> = envVarKeys.reduce(
	(obj, key) => {
		if (process.env[key] === undefined) {
			throw new Error(`env: missing ${key}`);
		}
		obj[key] = process.env[key]!;
		return obj;
	},
	{} as Record<EnvVarKey, string>,
);
