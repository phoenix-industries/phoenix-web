"use server";

import dotenv from "dotenv";

export const MODE = process.env.NODE_ENV ?? "development";
export const DEV = MODE !== "production";

console.log(`env: mode=${MODE.toUpperCase()}`);

if (process.env.NITRO_PRESET !== "cloudflare-module") {
	dotenv.config({
		path: [
			".env",
			".env.local",
			`.env.${DEV? "dev" : "prod"}`,
			`.env.${DEV ? "dev" : "prod"}.local`,
		],
		encoding: "utf8",
		override: true,
		debug: DEV,
		quiet: !DEV,
	});
}

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
