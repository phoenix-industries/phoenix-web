import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import solidSVG from "vite-plugin-solid-svg";

export default defineConfig({
	build: {
		target: "esnext",
	},
	esbuild: {
		target: "esnext",
	},
	server: {
		port: Number(process.env.APP_PORT || 3000),
	},
	envPrefix: "PUBLIC_",
	plugins: [
		tailwindcss(),
		solidSVG({
			defaultAsComponent: true,
			svgo: {
				enabled: true,
				svgoConfig: {},
			},
		}),
		solidStart({
			middleware: "./src/middleware/index.ts",
		}),
		nitro(),
	],
});
