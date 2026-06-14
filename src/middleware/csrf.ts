import { json } from "@solidjs/router";
import * as crypto from "crypto";
import * as env from "~/lib/utils/env";
import * as csrf from "~/lib/utils/csrf";
import type { FetchEvent } from "@solidjs/start/server";

export function onRequest(event: FetchEvent): Response | void {
	const { request, response } = event;

	if (csrf.SAFE_METHODS.includes(request.method)) {
		const cookies = request.headers.get("Cookie");
		if (!cookies || !cookies.includes(csrf.COOKIE_NAME)) {
			const token = csrf.generateToken(
				event.locals.session?.id ?? crypto.randomUUID(),
			);
			response.headers.set(
				"Set-Cookie",
				`${csrf.COOKIE_NAME}=${token}; Path=/; SameSite=Lax; ${!env.DEV ? "Secure;" : ""} HttpOnly=false`,
			);
			response.headers.set(csrf.HEADER_NAME, token);
		}
		return;
	}

	const requestUrl = new URL(request.url);
	const origin = request.headers.get("Origin");

	if (origin) {
		const parsedOrigin = new URL(origin);
		if (
			parsedOrigin.origin !== requestUrl.origin &&
			!csrf.TRUSTED_ORIGINS.includes(parsedOrigin.host)
		) {
			return json({ error: "origin invalid" }, { status: 403 });
		}
	}

	if (!origin && requestUrl.protocol === "https:") {
		const referer = request.headers.get("Referer");

		if (!referer) {
			return json({ error: "referer not supplied" }, { status: 403 });
		}

		const parsedReferer = new URL(referer);

		if (parsedReferer.protocol !== "https:") {
			return json({ error: "referer invalid" }, { status: 403 });
		}

		if (
			parsedReferer.host !== requestUrl.host &&
			!csrf.TRUSTED_ORIGINS.includes(parsedReferer.host)
		) {
			return json({ error: "referer invalid" }, { status: 403 });
		}
	}

	const cookieToken = request.headers
		.get("Cookie")
		?.match(new RegExp(`${csrf.COOKIE_NAME}=([^;]+)`))?.[1];
	let submittedToken: string | null = request.headers
		.get("Content-Type")
		?.includes("application/json")
		? request.headers.get(csrf.HEADER_NAME)
		: null;
	if (submittedToken && (!cookieToken || cookieToken !== submittedToken)) {
		return json({ error: "invalid CSRF token" }, { status: 403 });
	}
}
