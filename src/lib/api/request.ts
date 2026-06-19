import * as env from "~/lib/utils/env";
import { useSession } from "@solidjs/start/http";

export const AUTH_ROUTE = "/auth";

export type ServerResponse<T> =
	| {
			ok: true;
			data: T;
	  }
	| {
			ok: false;
			error: string;
	  };

export type RequestOptions = RequestInit & {
	params?: Record<string, string | number | boolean>;
};

export type AuthSessionData = {
	user_id: string;
	token_type: string;
	access_token: string;
	refresh_token: string;
	expires_at: number;
};

const NO_REFRESH_ROUTES = new Set<string>([
	`${AUTH_ROUTE}/refresh`,
	`${AUTH_ROUTE}/register`,
	`${AUTH_ROUTE}/login`,
	`${AUTH_ROUTE}/logout`,
]);

export async function useAuthSession() {
	"use server";
	return await useSession<AuthSessionData>({
		name: "auth",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		password: env.vars.SESSION_SECRET,
		cookie: {
			maxAge: 30 * 24 * 60 * 60, // 30 days
			httpOnly: true,
			secure: !env.DEV,
			sameSite: "lax",
			path: "/",
		},
	});
}

export async function refresh(
	token?: string,
): Promise<ServerResponse<AuthSessionData>> {
	"use server";
	if (!token) {
		const auth = await useAuthSession();
		if (!auth.data) {
			return { ok: false, error: "No auth session" };
		}
		token = auth.data.refresh_token;
		if (!token) {
			return { ok: false, error: "No refresh token" };
		}
	}
	return await request<AuthSessionData>(`${AUTH_ROUTE}/refresh`, {
		method: "POST",
		body: JSON.stringify({
			refresh_token: token,
		}),
	});
}

export type URLOptions = {
	baseURL?: string | URL;
	params?: Record<string, string | number | boolean>;
};

export function generateURL(route: string, options?: URLOptions): URL {
	const url = new URL(route, options?.baseURL);
	for (const key in options?.params) {
		url.searchParams.append(key, String(options?.params[key]));
	}
	return url;
}

export async function request<T>(
	route: string,
	options?: RequestOptions,
): Promise<ServerResponse<T>> {
	"use server";
	const { params, ...init } = options ?? {};
	const url = generateURL(route, {
		baseURL: env.vars.SERVER_URL,
		params: params,
	});
	const auth = await useAuthSession();
	const res = await fetch(url, {
		...init,
		headers: {
			Authorization: `${auth.data.token_type} ${auth.data.access_token}`,
			...init?.headers,
		},
	});
	switch (res.status) {
		case 401:
			{
				if (!NO_REFRESH_ROUTES.has(route)) {
					const data = await refresh();
					if (!data.ok) {
						return { ok: false, error: data.error };
					}
					await auth.update(data.data);
					return await request<T>(route, init);
				}
			}
			break;
		case 204:
			return { ok: true, data: null as T };
	}

	const contentType = res.headers.get("content-type");
	if (!contentType) {
		return { ok: false, error: "No content-type header" };
	}
	if (contentType.startsWith("application/json")) {
		return await res.json();
	}
	if (contentType.startsWith("text/plain")) {
		return { ok: false, error: await res.text() };
	}
	return { ok: false, error: "Unknown content-type" };
}
