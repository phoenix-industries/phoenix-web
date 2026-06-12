import * as env from "~/lib/utils/env";
import type { FetchEvent } from "@solidjs/start/server";

export function onRequest(event: FetchEvent): void {
	if (env.DEV) {
		console.debug(`Request: ${event.request.method} ${event.request.url}`);
	}
}
