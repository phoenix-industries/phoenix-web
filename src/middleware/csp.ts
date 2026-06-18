import { randomBytes } from "crypto";
import * as env from "~/lib/utils/env";
import type { FetchEvent } from "@solidjs/start/server";

export function onRequest(event: FetchEvent): void {
	const nonce = randomBytes(16).toString("base64");
	event.locals.nonce = nonce;

	const csp = `
		default-src 'self';
		script-src 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic';
		style-src 'self' 'unsafe-inline';
		connect-src 'self' data:
			https://cdn.cmnewz.com
			https://*.adtrafficquality.google
			https://*.googlesyndication.com
			https://adservice.google.com
			https://*.doubleclick.net
			${env.DEV ? "ws://localhost:*" : ""};
		img-src 'self' data: blob:
			https://cdn.cmnewz.com
			https://*.googleusercontent.com
			https://*.googlesyndication.com
			https://*.adtrafficquality.google
			https://*.doubleclick.net;
		frame-src
			https://www.google.com
			https://*.googlesyndication.com
			https://*.adtrafficquality.google
			https://*.doubleclick.net;
		object-src 'none';
		base-uri 'none';
		frame-ancestors 'none';
		form-action 'self';
    `.replace(/\s+/g, " ");
	event.response.headers.set("Content-Security-Policy", csp);
}
