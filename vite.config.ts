import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import solidSVG from "vite-plugin-solid-svg";

export default defineConfig({
	base: process.env.BASE_URL || "/",
	envPrefix: "PUBLIC_",
	build: {
		sourcemap: true,
	},
	server: {
		port: Number(process.env.APP_PORT || 3000),
	},
	plugins: [
		tailwindcss(),
		solidSVG({
			defaultAsComponent: true,
			svgo: {
				enabled: true,
			},
		}),
		solidStart({
			middleware: "./src/middleware/index.ts",
		}),
		nitro({
			preset: process.env.NITRO_PRESET,
			baseURL:
				process.env.NITRO_APP_BASE_URL || process.env.BASE_URL || "/",
		}),
	],
});
