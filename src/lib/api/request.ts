import * as env from "~/lib/utils/env";
import { refresh, useAuthSession } from "./auth";

export type ServerResponse<T> =
	| {
			ok: true;
			data: T;
	  }
	| {
			ok: false;
			error: string;
	  };

export async function request<T>(
	route: string,
	options?: RequestInit & { query?: Record<string, string> },
): Promise<ServerResponse<T>> {
	"use server";
	const { query, ...init } = options ?? {};
	const url = new URL(route, env.vars.SERVER_URL);
	if (query) {
		url.search = new URLSearchParams(query).toString();
	}
	const auth = await useAuthSession();
	const res = await fetch(url, {
		...init,
		headers: {
			Authorization: `${auth.data.token_type} ${auth.data.access_token}`,
			"Content-Type": "application/json",
			...init?.headers,
		},
	});
	switch (res.status) {
		case 401: {
			const data = await refresh();
			if (!data.ok) {
				return { ok: false, error: data.error };
			}
			await auth.update(data.data);
			return request<T>(route, init);
		}
		case 204:
			return { ok: true, data: null as T };
	}

	const contentType = res.headers.get("content-type");
	if (!contentType) {
		return { ok: false, error: "No content-type header" };
	}
	if (contentType.startsWith("application/json")) {
		return res.json();
	}
	if (contentType.startsWith("text/plain")) {
		return { ok: false, error: await res.text() };
	}
	return { ok: false, error: "Unknown content-type" };
}
