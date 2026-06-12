import { json } from "@solidjs/router";
import { TRUSTED_ORIGINS } from "~/lib/utils/csrf";
import type { FetchEvent } from "@solidjs/start/server";

export function onBeforeResponse(event: FetchEvent): Response | void {
	const { request, response } = event;

	response.headers.append("Vary", "Origin");

	const origin = request.headers.get("Origin");
	const requestUrl = new URL(request.url);
	const isApiRequest = requestUrl && requestUrl.pathname.startsWith("/api");

	if (isApiRequest && origin && TRUSTED_ORIGINS.includes(origin)) {
		if (
			request.method === "OPTIONS" &&
			request.headers.get("Access-Control-Request-Method")
		) {
			return json(null, {
				headers: {
					"Access-Control-Allow-Origin": origin,
					"Access-Control-Allow-Methods":
						"OPTIONS, GET, POST, PUT, PATCH, DELETE",
					"Access-Control-Allow-Headers":
						"Authorization, Content-Type",
					"Access-Control-Allow-Credentials": "true",
					"Access-Control-Max-Age": "86400",
					Vary: "Origin",
				},
			});
		}

		response.headers.set("Access-Control-Allow-Origin", origin);
		response.headers.set("Access-Control-Allow-Credentials", "true");
	}
}
